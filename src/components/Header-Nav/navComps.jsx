
import { Link } from "react-router-dom";
/* icons */

import { HomeIcon, ProjectIcon, AboutIcon, ReadsIcon } from "../../assets/icons/sideBarIcon";
import { useScrollContext } from "@/context/ScrollContext";

import { useLenis } from "lenis/react";

export const NavComps = ({ toggle }) => {
    const { HomeRef, AboutRef, ProjectsRef, ReadsRef } = useScrollContext();


    const navItems = [
        { ref: HomeRef, label: "Home", Icon: HomeIcon },
        { ref: AboutRef, label: "About", Icon: AboutIcon },
        { ref: ProjectsRef, label: "Projects", Icon: ProjectIcon },
        { ref: ReadsRef, label: "Reads", Icon: ReadsIcon }
    ]

    const lenis = useLenis();

    const scrollToFunc = (ref) => {
        if (ref?.current) {
            lenis?.scrollTo(ref.current, { offset: 0 });
        }
    }
    return (<>
        {
            navItems.map(({ ref, label, Icon }) => {
                return <div className="flex w-22 h-12 items-center justify-center gap-2 cursor-pointer"
                    onClick={() => scrollToFunc(ref)}>
                    {toggle ? <Icon strokeWidth={1.5} /> : <span>{label}</span>}
                </div>
            })
        }
    </>)
}