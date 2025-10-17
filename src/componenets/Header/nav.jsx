

import { useState } from "react"
import { Link } from "react-router-dom";


import { HomeIcon, ProjectIcon, EducationIcon, BlogIcon } from "../../assets/icons/sideBarIcon";

export const Nav = () => {

    const [toogle, setToggle] = useState(true);


    const navItems = [
        { to: "/", label: "Home", Icon: HomeIcon },
        { to: "/", label: "Education", Icon: EducationIcon },
        { to: "/", label: "Projects", Icon: ProjectIcon },
        { to: "/", label: "Blogs", Icon: BlogIcon }
    ]

    return <nav className={`h-screen bg-white-400 dark:bg-black dark:text-white transition-all duration-1000  ${toogle ? "w-18" : "w-40"} pl-2 
        flex flex-col items-center justify-between`}
        onMouseEnter={() => setToggle(false)}
        onMouseLeave={() => setToggle(true)}>

        <div className="h-80 w-full mt-40 flex flex-col gap-14 items-center">
            {navItems.map(({ to, label, Icon }) => {
                return <Link to={to} className="flex w-22 h-12 items-center justify-center gap-2">
                    {toogle ? <Icon /> : <span>{label}</span>}
                </Link>
            })}
        </div>
        <span className="border-2 rounded px-2 mb-18 mx-1">
            <b>{toogle ? "." : "_"}</b>
        </span>
    </nav>

}