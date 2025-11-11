import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

// files
import { Nav } from "./components/Header-Nav/nav.jsx";
//icons 
import { SunMedium, Moon } from "lucide-react";

import { ReactLenis, useLenis } from "lenis/react";

function ScrollHandler() {
    useLenis((lenis) => { })
}

import { ErrorPage } from "./components/Main-Pages/ErrorPage.jsx";
import { MainComp } from "./components/Main-Pages/Main.jsx";
import { ScrollContextProvider } from "./context/ScrollContext.jsx";
import { NavToggleContextProvider } from "./context/NavToggleContext.jsx";
import Footer from "./components/Footer.jsx";
import Oneko from "./components/Oneko.jsx"; // Add this import

export default function App() {

    const [isDarkMode, setMode] = useState(true); //  by default it will be dark

    function toggleMode() {
        document.documentElement.classList.toggle('dark');
        setMode(!isDarkMode);
    }

    return (
        <BrowserRouter>
            <ReactLenis root options={{ smoothWheel: true, duration: 3.7 }} >
                <ScrollHandler />
                <Oneko />
                <div className="w-screen flex box-border ">

                    <div className="m-5 text-lgflex justify-center fixed gap-2 bg-gray-800  dark:bg-black text-emerald-300 dark:text-lime-400  p-2 ring-2 rounded-xl z-111" > Project status- Working... </div>

                    {/* dark mode toggle button */}
                    <button className="fixed z-12 dark:bg-black border-2 dark:border-white right-10 top-5 bg-gray-50 p-2 shadow-md rounded-lg"
                        onClick={toggleMode}>
                        {isDarkMode ? <SunMedium strokeWidth={1.5} /> : <Moon strokeWidth={1.5} />}
                    </button>

                    <ScrollContextProvider>
                        {/* navbar */}
                        <NavToggleContextProvider>
                            <Nav></Nav>

                            {/* Main pages*/}
                            <Routes>
                                <Route path="/" element={
                                    <div className="w-full flex flex-col text-black bg-white dark:text-white dark:bg-black">
                                        <MainComp />
                                        <Footer />
                                    </div>
                                } />
                                <Route path="/*" element={<ErrorPage />} />
                            </Routes>
                        </NavToggleContextProvider>
                    </ScrollContextProvider>

                </div >
            </ReactLenis >
        </BrowserRouter >

    )


}

