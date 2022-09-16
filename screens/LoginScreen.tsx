import { Button, FormControl, Input, Toast, VStack } from "native-base";
import React, { useState } from "react";
import { RootStackScreenProps } from "../types";

const LoginScreen = ({ navigation }: RootStackScreenProps<"Login">) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        navigation.navigate("AddEntry");
        if (email.trim().length == 0 || password.trim().length === 0) {
            return Toast.show({ description: "Email or Password missing" });
        }
    };

    return (
        <VStack bg="white" justifyContent="center" h="100%" alignItems="center">
            <VStack w="80%">
                <FormControl isRequired>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input mb={4} size="xl" />
                    <FormControl.Label>Password</FormControl.Label>
                    <Input mb={8} size="xl" type="password" />
                    <Button onPress={handleSubmit}>Login</Button>
                </FormControl>
            </VStack>
        </VStack>
    );
};

export default LoginScreen;
