
import { Link } from "react-router-dom";
/* icons */

import { HomeIcon, ProjectIcon, AboutIcon, ReadsIcon } from "../../assets/icons/sideBarIcon";
import { useScrollContext } from "@/context/ScrollContext";


export const NavComps = ({ toogle }) => {
    const { homeRef, AboutRef, ProjectsRef, ReadsRef } = useScrollContext();

    const navItems = [
        { ref: homeRef, label: "Home", Icon: HomeIcon },
        { ref: AboutRef, label: "About", Icon: AboutIcon },
        { ref: ProjectsRef, label: "Projects", Icon: ProjectIcon },
        { ref: ReadsRef, label: "Reads", Icon: ReadsIcon }
    ]

    const scrollToFunc = (ref) => {
        ref?.current?.scrollIntoView({ behavior: "smooth" })
    }
    return (<>
        {
            navItems.map(({ ref, label, Icon }) => {
                return <div className="flex w-22 h-12 items-center justify-center gap-2 cursor-pointer"
                    onClick={() => scrollToFunc(ref)}>
                    {toogle ? <Icon strokeWidth={1.5} /> : <span>{label}</span>}
                </div>
            })
        }
    </>)
}