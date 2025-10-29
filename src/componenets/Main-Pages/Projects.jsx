
import themepng from "../../assets/projects/theme.png"

import TypeScript from "../../assets/icons/technologies/TypeScript";
import ReactIcon from "../../assets/icons/technologies/React";
import MongoDB from "../../assets/icons/technologies/MongoDB";
import Vercel from "../../assets/icons/technologies/Vercel";
import TailwindCss from "../../assets/icons/technologies/TailwindCss";
import NodeJs from "../../assets/icons/technologies/Node";
import SocketIo from "../../assets/icons/technologies/SocketIo";
import ExpressJs from "../../assets/icons/technologies/Express";
import Github from "../../assets/icons/technologies/Github";
import Postman from "../../assets/icons/technologies/Postman";
import JSON from "../../assets/icons/technologies/JSON";
import VS from "../../assets/icons/technologies/VS";
import Cursor from '../../assets/icons/technologies/Cursor';


import Readmore from "../../assets/icons/technologies/Readmore";
import Link from "../../assets/icons/technologies/Link"


const ProjectsData = [
    {
        topicName: "Dark-Theme",
        discription: "rweorihfisfhfshfsfhsdfhsdfhsdkfsdhfwer we9irwer weomirwoeriweoriewjor rowweqweqwewqeweirorijeorijqw 0e5 m8u3q409585e843u5983459djfo ierutoeiwrjtpoe8rt mt9we8 98tuwcerosddadsaopaosdpaosdkpsdokaps",
        icons: [JSON, Cursor, VS, Github,],
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        readmore: "will add later",
        image: "will add later",
    },

]

export const ProjectsPage = () => {
    return <div className="h-full flex flex-col gap-4 p-2">

        <span className="text-3xl">Projects- </span>
        {ProjectsData.map((p, i) => {
            return <ProjectInfoDiv topicName={p?.topicName} discription={p?.discription} icons={p?.icons} deployLink={p?.deployLink} github={p?.github} readmore={p?.readmore} image={p?.image} key={i} />
        })}
    </div>
}






const ProjectInfoDiv = (props) => {
    return <div className=" flex items-center justify-end relative mx-3 font-light">

        <div className="relative">

            <div className="absolute inset-0 transition-all duration-300 bg-indigo-900 dark:bg-white h-full w-full opacity-26 hover:opacity-0"

            ></div>


            <img src={themepng} alt="" className="h-[58vh] w-[44vw] object-cover" />
        </div>

        {/* section 1 for the texts like name of project dis and technologies etc */}
        <section className=" w-[46vw] left-0 flex flex-col justify-center p-4 absolute gap-4 z-10">

            <span className="text-2xl">{props?.topicName}</span>

            <p className="bg-gray-800 dark:bg-white shadow-sm shadow-slate-900 rounded-md p-6 flex flex-col  text-white dark:text-black gap-6">
                {props?.discription}
                <span>
                    <p className="flex gap-4">
                        {props?.icons.map((Icon) => {
                            return <span className=" size-6"><Icon /></span>
                        })}
                    </p>
                </span>

            </p>
            <div className="flex gap-4">
                <span>
                    <a href={props.deployLink} target="_blank" rel="noopener noreferrer"><Link /></a>
                </span>
                <span>
                    <a href={props.github} target="_blank" rel="noopener noreferrer"><Github /></a>
                </span>
                <span>
                    {/* need to implement later via useNavigate SPA */}
                    <span><Readmore /></span>
                </span>

            </div>
        </section >
    </div >
}