

import { useState } from "react"
import { NavComps } from "./navComps";
export const Nav = () => {

    const [toogle, setToggle] = useState(true);

    return <nav className={`h-screen bg-white-400 dark:bg-black dark:text-white transition-all duration-1000  ${toogle ? "w-[8vw]" : "w-[14vw]"} pl-2 
        flex flex-col items-center justify-between`}
        onMouseEnter={() => setToggle(false)}
        onMouseLeave={() => setToggle(true)}>

        <div className="h-80 w-full mt-40 flex flex-col gap-14 items-center">
            <NavComps toogle={toogle} />
        </div>

        <span className="border-2 rounded px-2 mb-18 mx-1">
            <b>{toogle ? "." : "_"}</b>
        </span>
    </nav>

}