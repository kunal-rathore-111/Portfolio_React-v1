

import { NavComps } from "./navComps";
import { useNavToggleContextProvider } from "@/context/NavToggleContext";

export const Nav = () => {

    const { toggle, setToggle } = useNavToggleContextProvider();

    return <nav className={`h-full bg-white-400 dark:bg-black dark:text-white transition-all duration-1000  ${toggle ? "w-[8vw]" : "w-[12vw]"} pl-2  pt-30 fixed z-100  
        flex flex-col items-center justify-between`}
        onMouseEnter={() => setToggle(false)}
        onMouseLeave={() => setToggle(true)}>

        <div className="h-90 w-full  flex flex-col gap-14 items-center">
            <NavComps toggle={toggle} />
        </div>

        <span className="border-2 border-black dark:border-white rounded px-2 mb-18 mx-1">
            <b>{toggle ? "." : "_"}</b>
        </span>
    </nav>

}