
import { Link } from "react-router-dom";

import { HomeIcon, ProjectIcon, EducationIcon, BlogIcon } from "../../assets/icons/sideBarIcon";

const navItems = [
    { to: "/home", label: "Home", Icon: HomeIcon },
    { to: "/education", label: "Education", Icon: EducationIcon },
    { to: "/projects", label: "Projects", Icon: ProjectIcon },
    { to: "/blogs", label: "Blogs", Icon: BlogIcon }
]
export const NavComps = ({ toogle }) => {
    return (<>
        {
            navItems.map(({ to, label, Icon }) => {
                return <Link to={to} className="flex w-22 h-12 items-center justify-center gap-2">
                    {toogle ? <Icon /> : <span>{label}</span>}
                </Link>
            })
        }
    </>)
}