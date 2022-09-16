import React, { useState } from "react";

type MainContextType = {
    camera_image: any;
    setCameraImage: any;
    logged_in: any;
    setLoggedIn: any;
};

const MainContext = React.createContext<MainContextType>({
    camera_image: null,
    setCameraImage: null,
    logged_in: null,
    setLoggedIn: null,
});

export function MainContextProvider({ children }: { children: React.ReactNode }) {
    const [camera_image, setCameraImage] = useState();
    const [logged_in, setLoggedIn] = useState(true);

    return (
        <MainContext.Provider
            value={{
                camera_image,
                setCameraImage,
                logged_in,
                setLoggedIn,
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export default MainContext;
