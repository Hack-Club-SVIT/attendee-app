import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
	Badge,
	Button,
	Heading,
	HStack,
	Image,
	Input,
	Tag,
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
			// console.log(
			// 	JSON.stringify(
			// 		res.data.data.attributes.photo.data.attributes.formats
			// 	)
			// );

			return res.data.data;
		} catch (err) {
			return Toast.show({ description: "Something wrong, try again" });
		}
	};

	const dateArr = [
		null,
		"2022-09-26",
		"2022-09-27",
		"2022-09-28",
		"2022-09-29",
		"2022-09-30",
		"2022-10-01",
		"2022-10-02",
		"2022-10-03",
		"2022-10-04",
		"2022-10-05",
	];

	const getAttendanceId = () => {
		let d = new Date();
		let dd = String(d.getDate()).padStart(2, "0");
		let mm = String(d.getMonth() + 1).padStart(2, "0"); //January is 0!
		let yyyy = d.getFullYear();

		const today = `${yyyy}-${mm}-${dd}`;
		// const today = "2022-09-29";

		const attendance_id = dateArr.findIndex(i => i == today);
		return attendance_id;
	};

	const authVIP = (id: string | number) => {
		const vips = {
			2951: "Patel Ronak Ghanshyambhai",
			2952: "Patel Hardik Vasantbhai",
			2953: "Patel Gaurang Arvindbhai",
			2954: "Patel Alpeshbhai Prafulbhai",
			2955: "Patel Naitikbhai Markandbhai",
			2956: "Patel Dineshbhai Manibhai",
			2957: "Patel Saileshbhai Rasikbhai",
			2958: "Patel Kinkal Bhupendrabhai",
			2959: "Patel Hemant Navneetbhai",
			2960: "Patel Sanjaybhai Arvindbhai",
		};

		setAppState("SCAN");

		setStringInput("");
		setShowScanner(true);
		return Toast.show({
			description: `You are authorized by ${vips[id as string]}`,
		});
	};

	const handleBarCodeScan = ({ data }: { data: string }) => {
		if (!data && !input_data) {
			return Toast.show({ description: "Please enter Participant ID" });
		}
		const id = (data.replace(/^\D+/g, "") as any) * 1;

		Vibration.vibrate(30);
		setAppState("LOADING");
		setScanned(true);
		setShowScanner(false);

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
			if (id >= 2951 && id <= 2960) return authVIP(id);
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

		const id = (str.replace(/^\D+/g, "") as any) * 1;
		console.log(id);

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
			if (id >= 2951 && id <= 2960) return authVIP(id);
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

	const handleAttendanceUpdate = async (member_id: number) => {
		const current_attendances = data?.attributes.attendances.data.map(
			i => i.id
		);

		const attendance_id = getAttendanceId();

		const already_updated = current_attendances?.includes(attendance_id);

		if (attendance_id == -1)
			return Toast.show({
				description: "Attendance will be active during navratri",
			});
		if (already_updated) return;

		if (!current_attendances)
			return Toast.show({ description: "Something wrong, try again" });

		axios
			.put(`/api/males/${member_id}`, {
				attendances: [...current_attendances, attendance_id],
			})
			.then(r => {
				console.log(r.data);
				return Toast.show({ description: "Attendance updated" });
			})
			.catch(err => {})
			.finally(() => {
				setStringInput("");
				setAppState("SCAN");
				setShowScanner(true);
			});
	};
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
									<Text fontSize='lg' fontWeight='bold'>
										VGV
										{gender[0] +
											String(data.id).padStart(4, "0")}
									</Text>
								</HStack>
								{data.attributes.age && (
									<HStack>
										<Text fontSize='lg'>Age: </Text>
										<Text fontSize='lg'>
											{data.attributes.age}
										</Text>
									</HStack>
								)}
								{data.attributes.attendances && (
									<HStack>
										<Text fontSize='lg'>
											Days Attended:{" "}
										</Text>
										<HStack space={2}></HStack>
										<Text fontSize='lg'>
											{data.attributes.attendances.data.map(
												(att, i) => (
													<Badge
														rounded='full'
														key={i}
														bg='green.300'
													>
														{att.id}
													</Badge>
												)
											)}
										</Text>
									</HStack>
								)}
								{gender == "MALE" && (
									<>
										{data.attributes.mobile && (
											<HStack>
												<Text fontSize='lg'>
													Mobile:{" "}
												</Text>
												<Text fontSize='lg'>
													{data.attributes.mobile}
												</Text>
											</HStack>
										)}
										{data.attributes.address && (
											<HStack>
												<Text fontSize='lg'>
													Address:{" "}
												</Text>
												<Text fontSize='lg'>
													{data.attributes.address}
												</Text>
											</HStack>
										)}
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
								handleAttendanceUpdate(data.id);
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
