import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainContextProvider } from "./context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    console.log(colorScheme);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <MainContextProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <NativeBaseProvider>
                        <SafeAreaProvider>
                            <Navigation colorScheme={colorScheme} />
                            <StatusBar />
                        </SafeAreaProvider>
                    </NativeBaseProvider>
                </SafeAreaView>
            </MainContextProvider>
        );
    }
}
