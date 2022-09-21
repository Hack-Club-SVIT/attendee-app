import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, Heading, HStack, Image, Text, Toast, VStack } from "native-base";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Vibration } from "react-native";

export interface Response {
    data: Data;
}

export interface Data {
    id: number;
    attributes: Attributes;
}

export interface Attributes {
    name: string;
    age: number;
    mobile: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    locale: string;
    date_of_birth: Date;
}

const temp_image = "https://api.hackclubsvit.co/uploads/AAKASHKUMAR_JIGNESHBHAI_BHOI_c3ab25c13e.jpg";

export default function Scanner() {
    const [scanned, setScanned] = useState(false);
    const [input_data, setInputData] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [show_scanner, setShowScanner] = useState(true);
    const [data, setData] = useState<Response>();

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (!data && !input_data) {
            return Toast.show({ description: "Please enter Participant ID" });
        }

        Vibration.vibrate(30);
        setLoading(true);
        setScanned(true);
        setShowScanner(false);

        const id = parseInt(data.substring(4), 10);

        if (data[3] === "F") {
            // For females

            const response = await axios.get<Response>(`/api/females/${id}`);

            setData(response.data);
        } else {
            // For males

            const response = await axios.get<Response>(`/api/males/${id}`);

            setData(response.data);
        }

        setLoading(false);
    };

    return (
        <VStack bgColor="#fff" flex={1}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: show_scanner ? 400 : 0, width: Dimensions.get("screen").width }}
            />
            <Button
                onPress={() => {
                    setScanned(false);
                    setShowScanner(true);
                    setLoading(false);
                    setData(null);
                }}
            >
                Reset
            </Button>

            {loading && (
                <HStack justifyContent="center" space={2} alignItems="center" py={4}>
                    <ActivityIndicator />
                    <Text>Loading...</Text>
                </HStack>
            )}

            {data && !show_scanner && (
                <>
                    <Image
                        alt="candidate image"
                        src={temp_image}
                        w={Dimensions.get("screen").width}
                        h={300}
                        resizeMode="contain"
                    />

                    <VStack paddingX={4}>
                        <Heading>{data.data.attributes.name}</Heading>
                        <HStack pt={4}>
                            <Text fontSize="lg">ID: </Text>
                            <Text fontSize="lg">{data.data.id}</Text>
                        </HStack>
                        <HStack>
                            <Text fontSize="lg">Age: </Text>
                            <Text fontSize="lg">{data.data.attributes.age}</Text>
                        </HStack>
                        <HStack>
                            <Text fontSize="lg">Mobile: </Text>
                            <Text fontSize="lg">{data.data.attributes.mobile}</Text>
                        </HStack>
                        <HStack>
                            <Text fontSize="lg">Address: </Text>
                            <Text fontSize="lg">{data.data.attributes.address}</Text>
                        </HStack>
                    </VStack>
                </>
            )}
        </VStack>
    );
}
