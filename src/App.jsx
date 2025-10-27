

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";

// files
import { Nav } from "./componenets/Header-Nav/nav.jsx";
//icons 
import { SunMedium, Moon } from "lucide-react";


import { ErrorPage } from "./componenets/Main-Pages/ErrorPage.jsx";
import { HomePage } from "./componenets/Main-Pages/Home.jsx";
import { AboutPage } from "./componenets/Main-Pages/About.jsx";
import { ProjectsPage } from "./componenets/Main-Pages/Projects.jsx";

export default function App() {

    const [isDarkMode, setMode] = useState(true); //  by default it will be dark

    function toggleMode() {
        document.documentElement.classList.toggle('dark');
        setMode(!isDarkMode);
    }

    return (
        <BrowserRouter>

            <div className="h-screen w-screen flex box-border ">

                <div className="m-5 text-lgflex justify-center fixed gap-2  dark:bg-black dark:text-lime-400  p-2 ring-2 rounded-xl" > Project status- Working </div>

                {/* dark mode toggle button */}
                <button className="fixed right-10 top-5 bg-gray-50 p-2 shadow-md  rounded-lg"
                    onClick={toggleMode}>
                    {isDarkMode ? <SunMedium strokeWidth={1.5} /> : <Moon strokeWidth={1.5} />}
                </button>

                {/* navbar */}
                <Nav></Nav>


                {/* Main pages*/}
                <main className="h-full w-full flex-grow overflow-y-scroll text-black bg-white dark:text-white dark:bg-black pt-20 pl-10 pr-10">
                    <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        {/* <Route path="/reads" element={<HomePage />} /> */}
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </main>
            </div >
        </BrowserRouter >

    )


}

