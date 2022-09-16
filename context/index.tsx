import React, { useState } from "react";

type MainContextType = {
    camera_image: any;
    setCameraImage: any;
};

const MainContext = React.createContext<MainContextType>({ camera_image: null, setCameraImage: null });

export function MainContextProvider({ children }: { children: React.ReactNode }) {
    const [camera_image, setCameraImage] = useState();

    return (
        <MainContext.Provider
            value={{
                camera_image,
                setCameraImage,
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export default MainContext;
