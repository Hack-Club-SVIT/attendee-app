import { Camera, CameraType } from "expo-camera";
import {
    Box,
    Button,
    FormControl,
    HStack,
    Input,
    KeyboardAvoidingView,
    Radio,
    Text,
    TextArea,
    Toast,
    View,
    VStack,
} from "native-base";
import React, { useContext, useState } from "react";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { RootStackScreenProps } from "../types";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native";
import MainContext from "../context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Gender = {
    Male: "MALE",
    Female: "FEMALE",
};

export default function AddEntry({ navigation }: RootStackScreenProps<"AddEntry">) {
    const { camera_image } = useContext(MainContext);
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            setImage(result.uri);
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

        if (age.trim().length === 0) {
            Toast.show({ description: "Enter Age" });
        }

        console.log("Form data ->", {
            gender,
            name,
            mobile,
            address,
            age,
            camera_image,
        });
    };

    const handleLogout = () => {
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
