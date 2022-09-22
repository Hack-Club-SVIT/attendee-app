import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
	Button,
	Heading,
	HStack,
	Image,
	Input,
	Text,
	Toast,
	View,
	VStack,
} from "native-base";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	SafeAreaView,
	StatusBar,
	Vibration,
} from "react-native";

export interface IResponse {
	data: IResponseData;
	status: number;
	headers: any;
	config: any;
	request: any;
}

interface Format {
	name: string;
	hash: string;
	ext: string;
	mime: string;
	path: null;
	width: number;
	height: number;
	size: number;
	url: string;
}

interface IResponseData {
	id: number;
	attributes: {
		name: string;
		mobile: string;
		age: number;
		address: string;
		createdAt: Date;
		updatedAt: Date;
		date_of_birth: null;
		locale: string;
		photo: {
			data: {
				id: number;
				attributes: {
					name: string;
					alternativeText: string;
					caption: string;
					width: number;
					height: number;
					formats: {
						thumbnail: Format;
						medium: Format;
						small: Format;
						large: Format;
					};
					hash: string;
					ext: string;
					mime: string;
					size: number;
					url: string;
					previewUrl: null;
					provider: string;
					provider_metadata: null;
					createdAt: Date;
					updatedAt: Date;
				};
			};
		};
		attendances: { data: any[] };
		localizations: any;
	};
}

export default function Scanner() {
	const [scanned, setScanned] = useState(false);
	const [input_data, setInputData] = useState<string>("");
	const [string_input, setStringInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [show_scanner, setShowScanner] = useState(true);
	const [data, setData] = useState<IResponseData>();
	const [app_state, setAppState] = useState<"SCAN" | "DATA" | "LOADING">(
		"SCAN"
	);
	const [gender, setGender] = useState<"MALE" | "FEMALE">("FEMALE");

	const handleBarCodeScan = ({ data }: { data: string }) => {
		if (!data && !input_data) {
			return Toast.show({ description: "Please enter Participant ID" });
		}

		Vibration.vibrate(30);
		setAppState("LOADING");
		setScanned(true);
		setShowScanner(false);

		const id = parseInt(data.substring(4), 10);

		if (data[3] === "F") {
			setGender("FEMALE");
			// Female
			fetchData(id, true)
				.then(r => {
					setData(r);
					setAppState("DATA");
				})
				.catch(() => {
					setAppState("SCAN");
				});
		} else {
			setGender("MALE");
			// Male
			fetchData(id)
				.then(r => {
					setData(r);
					setAppState("DATA");
				})
				.catch(() => {
					setAppState("SCAN");
				});
		}
	};
	const handleTextEnter = (str: string) => {
		if (!string_input) {
			return Toast.show({ description: "Please enter Participant ID" });
		}

		Vibration.vibrate(30);
		setAppState("LOADING");
		setShowScanner(false);

		const id = parseInt(str.substring(1), 5);

		if (str[0] === "F") {
			setGender("FEMALE");
			// Female
			fetchData(id, true)
				.then(r => {
					setData(r);
					setAppState("DATA");
					setStringInput("");
				})
				.catch(() => {
					setAppState("SCAN");
				});
		} else {
			setGender("MALE");
			// Male
			fetchData(id)
				.then(r => {
					setData(r);
					setStringInput("");
					setAppState("DATA");
				})
				.catch(() => {
					setAppState("SCAN");
				});
		}
	};

	const fetchData = async (id: number, female?: boolean) => {
		console.log("ID", id);
		try {
			if (female) {
				const res = await axios.get<IResponse>(
					`/api/females/${id}?populate=*`
				);
				return res.data.data;
			}
			const res = await axios.get<IResponse>(
				`/api/males/${id}?populate=*`
			);
			console.log(
				JSON.stringify(
					res.data.data.attributes.photo.data.attributes.formats
				)
			);

			return res.data.data;
		} catch (err) {
			return Toast.show({ description: "Something wrong, try again" });
		}
	};

	// const handleAttendance =async()=>{

	// };
	if (app_state == "LOADING") {
		return (
			<HStack
				justifyContent='center'
				space={2}
				alignItems='center'
				py={12}
			>
				<ActivityIndicator />
				<Text>Loading...</Text>
			</HStack>
		);
	}
	if (app_state == "DATA") {
		return (
			<>
				<View pt={12}>
					{!!data?.attributes && !show_scanner && !loading && (
						<>
							{gender !== "FEMALE" &&
								data?.attributes.photo.data.attributes.formats
									.medium && (
									<Image
										alt='candidate image'
										src={`https://api.hackclubsvit.co${data.attributes.photo.data.attributes.formats.small.url}`}
										w={Dimensions.get("screen").width}
										h={300}
										resizeMode='contain'
									/>
								)}

							<VStack paddingX={4}>
								<Heading>{data.attributes.name}</Heading>
								<HStack pt={4}>
									<Text fontSize='lg'>ID: </Text>
									<Text fontSize='lg'>{data.id}</Text>
								</HStack>
								<HStack>
									<Text fontSize='lg'>Age: </Text>
									<Text fontSize='lg'>
										{data.attributes.age}
									</Text>
								</HStack>
								{gender == "MALE" && (
									<>
										<HStack>
											<Text fontSize='lg'>Mobile: </Text>
											<Text fontSize='lg'>
												{data.attributes.mobile}
											</Text>
										</HStack>
										<HStack>
											<Text fontSize='lg'>Address: </Text>
											<Text fontSize='lg'>
												{data.attributes.address}
											</Text>
										</HStack>
									</>
								)}
							</VStack>
						</>
					)}
				</View>
				{data && (
					<VStack space='2' p={12}>
						<Button
							size='lg'
							onPress={() => {
								setScanned(false);
								setShowScanner(true);
								setLoading(false);
								setData(undefined);
							}}
						>
							Done
						</Button>
						<Button
							variant='subtle'
							onPress={() => {
								setScanned(false);
								setShowScanner(true);
								setLoading(false);
								setData(undefined);
								setAppState("SCAN");
							}}
						>
							Go back
						</Button>
					</VStack>
				)}
			</>
		);
	}
	return (
		<VStack bgColor='#fafafa' flex={1} py='12'>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
				style={{
					height: show_scanner ? 300 : 0,
					width: Dimensions.get("screen").width,
				}}
			/>
			<HStack p='4' space={2}>
				<Input
					placeholder='Enter ID manually'
					value={string_input}
					onChangeText={setStringInput}
					flexGrow='1'
				/>
				<Button
					size='sm'
					disabled={string_input.trim() == ""}
					onPress={() => handleTextEnter(string_input)}
				>
					Next
				</Button>
			</HStack>
		</VStack>
	);
}
