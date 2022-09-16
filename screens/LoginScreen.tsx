import axios from "axios";
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

		axios
			.post("https://api.hackclubsvit.co/api/auth/local", {
				identifier: email,
				password,
			})
			.then(r => {
				navigation.navigate("AddEntry");
				console.log("LOGIN SUCCESS", r.data.jwt);
			})
			.catch(() => {
				console.error("ERROR");
				Toast.show({ description: "Invalid email or password" });
			});
	};

	return (
		<VStack bg='white' justifyContent='center' h='100%' alignItems='center'>
			<VStack w='80%'>
				<FormControl isRequired>
					<FormControl.Label>Email</FormControl.Label>
					<Input
						mb={4}
						size='xl'
						value={email}
						onChangeText={e => setEmail(e)}
					/>
					<FormControl.Label>Password</FormControl.Label>
					<Input
						mb={8}
						size='xl'
						type='password'
						value={password}
						onChangeText={e => setPassword(e)}
					/>
					<Button onPress={handleSubmit}>Login</Button>
				</FormControl>
			</VStack>
		</VStack>
	);
};

export default LoginScreen;
