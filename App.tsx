import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainContextProvider } from "./context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<MainContextProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
					<NativeBaseProvider>
						<SafeAreaProvider>
							<StatusBar />
							<Navigation colorScheme={colorScheme} />
						</SafeAreaProvider>
					</NativeBaseProvider>
				</SafeAreaView>
			</MainContextProvider>
		);
	}
}
