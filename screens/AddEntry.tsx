import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
	Button,
	FormControl,
	HStack,
	Image,
	Input,
	KeyboardAvoidingView,
	Radio,
	TextArea,
	Toast,
	VStack,
} from "native-base";
import React, { useContext, useState } from "react";
import MainContext from "../context";
import { RootStackScreenProps } from "../types";
// import * as FileSystem from "expo-file-system";

const Gender = {
    Male: "MALE",
    Female: "FEMALE",
};

// const uploadToStrapi = async (resource_uri: any, parameters: any) => {
// 	try {
// 		let uploading = await FileSystem.uploadAsync(
// 			"https://api.hackclubsvit.co/api/upload",
// 			resource_uri,
// 			{
// 				uploadType: FileSystem.FileSystemUploadType.MULTIPART,
// 				httpMethod: "POST",
// 				fieldName: "files",
// 				parameters,
// 			}
// 		);
// 		//returns server response
// 		return uploading;
// 	} catch (error) {
// 		console.log("Error", error);
// 		return error;
// 	}
// };

export default function AddEntry({
	navigation,
}: RootStackScreenProps<"AddEntry">) {
	const { camera_image, setCameraImage, setLoggedIn } =
		useContext(MainContext);
	const [gender, setGender] = useState("");
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [address, setAddress] = useState("");
	const [age, setAge] = useState("");
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [image, setImage] = useState<any>();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.01,
        });

        console.log("Object keys", Object.keys(result));

        if (!result.cancelled) {
            setCameraImage(undefined);
            setImage(result);
        }
    };

    const handleTakePicture = async () => {
        await requestPermission();
        if (permission) {
            navigation.navigate("TakePicture");
        } else {
            Toast.show({ description: "Permission Denied!! Try Again" });
        }
    };

    const handleSubmit = () => {
        if (gender.trim().length === 0) {
            Toast.show({ description: "Select the gender" });
        }

        if (name.trim().length === 0) {
            Toast.show({ description: "Enter Name" });
        }

        if (mobile.trim().length === 0 || mobile.trim().length !== 10) {
            Toast.show({ description: "Enter a Valid Mobile Number" });
        }

		axios
			.post("/api/attendees", {
				data: { gender, name, mobile, age, address },
			})
			.then(async r => {
				let form_data = new FormData();
				if (gender == Gender.Female) return;
				if (camera_image) {
					// await uploadToStrapi(camera_image.uri, {
					// 	refId: r.data.id,
					// 	field: "photo",
					// 	ref: "attendee",
					// });
					let imgBlob = await (await fetch(camera_image.uri)).blob();
					console.log("blob", imgBlob);
					form_data.append("files", imgBlob, name);
					form_data.append("refId", r.data.id);
					form_data.append("field", "photo");
					form_data.append("ref", "attendee");
				} else if (image) {
					let imgBlob = await (await fetch(image)).blob();
					console.log("blob", imgBlob);

					form_data.append("files", imgBlob, name);
					form_data.append("refId", r.data.id);
					form_data.append("field", "photo");
					form_data.append("ref", "attendee");
					// await uploadToStrapi(image, {
					// 	refId: r.data.id,
					// 	field: "photo",
					// 	ref: "attendee",
					// });
					// 	form_data.append("files", image);
					// 	form_data.append("refId", r.data.id);
					// 	form_data.append("field", "photo");
					// 	form_data.append("ref", "attendee");
				}
				// axios
				// 	.post("/api/upload", form_data)
				// 	.then(r => {
				// 		console.log("UPLOAD SUCC");
				// 	})
				// 	.catch(err =>
				// 		console.log(
				// 			"UPLOAD ERROR: ",
				// 			JSON.stringify(err.response)
				// 		)
				// 	);
				await AsyncStorage.setItem("token", r.data.jwt);
				navigation.navigate("AddEntry");
			})
			.catch(error => {
				console.error("ERROR", JSON.stringify(error));
				Toast.show({
					description: "Invalid email or password",
				});
			});
	};

        let form_data = new FormData();
        form_data.append("files", image.uri);
        form_data.append("field", "photo");
        form_data.append("ref", "attendee");
        form_data.append("refId", "24");

        axios
            .post("/api/upload", form_data)
            .then((r) => {
                console.log("UPLOAD SUCCESSFULL", r);
            })
            .catch((err) => console.log("UPLOAD ERROR: ", JSON.stringify(err.response)));

        return;

        axios
            .post("/api/attendees", {
                data: { gender, name, mobile, age, address },
            })
            .then(async (r) => {
                let form_data = new FormData();
                if (gender == Gender.Female) return;
                if (camera_image) {
                    form_data.append("files", image);
                }
                // if (image) {
                //     form_data.append("files");
                //     form_data.append("refId", r.data.id);
                //     form_data.append("field", "photo");
                //     form_data.append("ref", "attendee");
                // }
                axios
                    .post("/api/upload", form_data)
                    .then((r) => {
                        console.log("UPLOAD SUCC");
                    })
                    .catch((err) => console.log("UPLOAD ERROR: ", JSON.stringify(err.response)));
                await AsyncStorage.setItem("token", r.data.jwt);
                navigation.navigate("AddEntry");
            })
            .catch((error) => {
                console.error("ERROR", JSON.stringify(error.response));
                Toast.show({
                    description: "Invalid email or password",
                });
            });
    };

    const handleLogout = () => {
        setLoggedIn(false);
        AsyncStorage.removeItem("token", () => {
            navigation.navigate("Login");
        });
    };

    return (
        <VStack bg="white" flex={1} px={4} pt={4}>
            <FormControl>
                <KeyboardAvoidingView>
                    <FormControl.Label>Gender</FormControl.Label>
                    <Radio.Group onChange={setGender} name="gender">
                        <HStack space={4}>
                            <Radio value={Gender.Male}>Male</Radio>
                            <Radio value={Gender.Female}>Female</Radio>
                        </HStack>
                    </Radio.Group>

                    {gender === Gender.Male && (
                        <HStack mt={4} space={4}>
                            <Button onPress={handleTakePicture} variant="outline">
                                Take Photo
                            </Button>
                            <Button onPress={pickImage} variant="outline">
                                Select Photo
                            </Button>
                        </HStack>
                    )}

                    {(camera_image || image) && (
                        <Image w="100" h="100" src={image?.uri ?? camera_image.uri ?? ""} alt="" />
                    )}

                    <FormControl.Label mt={4}>Name</FormControl.Label>
                    <Input size="lg" onChangeText={setName} placeholder="Name" />

                    <FormControl.Label mt={4}>Mobile</FormControl.Label>
                    <Input size="lg" onChangeText={setMobile} keyboardType="number-pad" placeholder="Mobile" />

                    <FormControl.Label mt={4}>Age</FormControl.Label>
                    <Input size="lg" onChangeText={setAge} keyboardType="number-pad" placeholder="Age" />

                    <FormControl.Label mt={4}>Address (Optional)</FormControl.Label>
                    <TextArea
                        onChangeText={setAddress}
                        autoCompleteType=""
                        size="lg"
                        type="text"
                        placeholder="Address (Optional)"
                    />

                    <Button onPress={handleSubmit} mt="12" size="lg">
                        Submit
                    </Button>

                    <Button onPress={handleLogout} variant="ghost" mt="2" size="md">
                        logout
                    </Button>
                </KeyboardAvoidingView>
            </FormControl>
        </VStack>
    );
}
