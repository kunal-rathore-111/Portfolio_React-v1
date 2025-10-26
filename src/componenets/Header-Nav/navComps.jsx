
import { Link } from "react-router-dom";
/* icons */

import { HomeIcon, ProjectIcon, AboutIcon, BlogIcon } from "../../assets/icons/sideBarIcon";

const navItems = [
    { to: "/home", label: "Home", Icon: HomeIcon },
    { to: "/about", label: "About", Icon: AboutIcon },
    { to: "/projects", label: "Projects", Icon: ProjectIcon },
    { to: "/blogs", label: "Blogs", Icon: BlogIcon }
]
export const NavComps = ({ toogle }) => {
    return (<>
        {
            navItems.map(({ to, label, Icon }) => {
                return <Link to={to} className="flex w-22 h-12 items-center justify-center gap-2">
                    {toogle ? <Icon strokeWidth={1.5} /> : <span>{label}</span>}
                </Link>
            })
        }
    </>)
}