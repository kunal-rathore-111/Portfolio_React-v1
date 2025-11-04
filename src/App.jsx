

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

// files
import { Nav } from "./components/Header-Nav/nav.jsx";
//icons 
import { SunMedium, Moon } from "lucide-react";


import { ErrorPage } from "./components/Main-Pages/ErrorPage.jsx";
import { MainComp } from "./components/Main-Pages/Main.jsx";
import { ScrollContextProvider } from "./context/ScrollContext.jsx";


export default function App() {

    const [isDarkMode, setMode] = useState(true); //  by default it will be dark

    function toggleMode() {
        document.documentElement.classList.toggle('dark');
        setMode(!isDarkMode);
    }

    return (
        <BrowserRouter>

            <div className="h-screen w-screen flex box-border ">

                <div className="m-5 text-lgflex justify-center fixed gap-2 bg-gray-800  dark:bg-black text-emerald-300 dark:text-lime-400  p-2 ring-2 rounded-xl z-11" > Project status- Working... </div>

                {/* dark mode toggle button */}
                <button className="fixed z-12 right-10 top-5 bg-gray-50 p-2 shadow-md rounded-lg"
                    onClick={toggleMode}>
                    {isDarkMode ? <SunMedium strokeWidth={1.5} /> : <Moon strokeWidth={1.5} />}
                </button>

                <ScrollContextProvider>
                    {/* navbar */}
                    <Nav></Nav>

                    {/* Main pages*/}
                    <Routes>
                        <Route path="/home" element={<MainComp />} />
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </ScrollContextProvider>

            </div >
        </BrowserRouter >

    )


}

