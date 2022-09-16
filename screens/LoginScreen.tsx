import axios from "axios";
import { Button, FormControl, Input, Toast, VStack } from "native-base";
import React, { useContext, useState } from "react";
import { RootStackScreenProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainContext from "../context";

const LoginScreen = ({ navigation }: RootStackScreenProps<"Login">) => {
    const { setLoggedIn } = useContext(MainContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (email.trim().length == 0 || password.trim().length === 0) {
            return Toast.show({ description: "Email or Password missing" });
        }

        axios
            .post("/api/auth/local", {
                identifier: email,
                password,
            })
            .then((r) => {
                setLoggedIn(true);
                AsyncStorage.setItem("token", r.data.jwt);
                navigation.navigate("AddEntry");
            })
            .catch((error) => {
                console.error("ERROR", error);
                Toast.show({ description: "Invalid email or password" });
            });
    };

    return (
        <VStack bg="white" justifyContent="center" h="100%" alignItems="center">
            <VStack w="80%">
                <FormControl isRequired>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input mb={4} size="xl" value={email} onChangeText={(e) => setEmail(e)} />
                    <FormControl.Label>Password</FormControl.Label>
                    <Input mb={8} size="xl" type="password" value={password} onChangeText={(e) => setPassword(e)} />
                    <Button onPress={handleSubmit}>Login</Button>
                </FormControl>
            </VStack>
        </VStack>
    );
};

export default LoginScreen;
