

import { BrowserRouter } from "react-router-dom"
import { useState } from "react";

// files
import { Nav } from "./componenets/Header/nav";
import { Main } from "./componenets/Main/main.jsx";

//icons 
import { Sun, Moon } from "./assets/icons/darkMode";


export default function App() {

    const [isDarkMode, setMode] = useState(true); //  by default it will be dark

    function toggleMode() {
        document.documentElement.classList.toggle('dark');
        setMode(!isDarkMode);
    }

    return <BrowserRouter>

        <div className="h-screen w-screen flex border-box">
            <Nav></Nav>

            {/* Main */}
            < Main />
        </div>

        <button className="fixed right-10 top-5 bg-gray-50 p-2 shadow-md  rounded-lg"
            onClick={toggleMode}>
            {isDarkMode ? <Sun /> : <Moon />}
        </button>

    </BrowserRouter >

}


