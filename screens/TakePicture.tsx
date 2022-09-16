import { Camera } from "expo-camera";
import { Button, View } from "native-base";
import React, { useContext, useRef } from "react";
import { StyleSheet } from "react-native";
import MainContext from "../context";
import { RootStackScreenProps } from "../types";

export default function TakePicture({
	navigation,
}: RootStackScreenProps<"TakePicture">) {
	const cameraRef = useRef<any>();
	const { setCameraImage } = useContext(MainContext);

	const takePicture = async () => {
		const options = {
			quality: 0.5,
			base64: true,
			exif: false,
		};

		const photo = await cameraRef.current.takePictureAsync(options);

		setCameraImage(photo);

		navigation.goBack();
	};

	return (
		<View flex={1}>
			<Camera style={styles.camera} ref={cameraRef}>
				<View flex={1} alignItems='center' justifyContent='flex-end'>
					<Button onPress={takePicture} mb={12} size='lg'>
						Take Photo
					</Button>
				</View>
			</Camera>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
