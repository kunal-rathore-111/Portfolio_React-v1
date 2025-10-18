
import { Link } from "react-router-dom";

import { HomeIcon, ProjectIcon, EducationIcon, BlogIcon } from "../../assets/icons/sideBarIcon";

const navItems = [
    { to: "/", label: "Home", Icon: HomeIcon },
    { to: "/", label: "Education", Icon: EducationIcon },
    { to: "/", label: "Projects", Icon: ProjectIcon },
    { to: "/", label: "Blogs", Icon: BlogIcon }
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