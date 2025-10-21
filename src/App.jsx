

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

// files
import { Nav } from "./componenets/Header-Nav/nav.jsx";

//icons 
import { Sun, Moon } from "./assets/icons/darkMode";
import { ErrorPage } from "./componenets/Main-Pages/ErrorPage.jsx";
import { HomePage } from "./componenets/Main-Pages/home.jsx";
import { EducationPage } from "./componenets/Main-Pages/Education.jsx";


export default function App() {

    const [isDarkMode, setMode] = useState(true); //  by default it will be dark

    function toggleMode() {
        document.documentElement.classList.toggle('dark');
        setMode(!isDarkMode);
    }

    return (
        <BrowserRouter>

            <div className="h-screen w-screen flex box-border">

                {/* dark mode toggle button */}
                <button className="fixed right-10 top-5 bg-gray-50 p-2 shadow-md  rounded-lg"
                    onClick={toggleMode}>
                    {isDarkMode ? <Sun /> : <Moon />}
                </button>

                {/* navbar */}
                <Nav></Nav>

                {/* Main pages*/}
                <main className="h-full flex-grow overflow-y-scroll text-black bg-white dark:text-white dark:bg-black">
                    <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/education" element={<EducationPage />} />
                        <Route path="/projects" element={<HomePage />} />
                        <Route path="/blogs" element={<HomePage />} />
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </main>
            </div >
        </BrowserRouter >

    )


}

