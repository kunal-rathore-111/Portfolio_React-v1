
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
        topicName: "VSCode Dark Theme",
        discription: "A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.",
        icons: [JSON, Cursor, VS, Github,],
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        readmore: "will add later",
        image: "will add later",
    },
    {
        topicName: "Dark-Theme",
        discription: "A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.",
        icons: [JSON, Cursor, VS, Github,],
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        readmore: "will add later",
        image: "will add later",
    },

]

export const ProjectsPage = () => {
    return <div className="h-full flex flex-col p-2">

        <span className="text-3xl">Projects- </span>
        {ProjectsData.map((p, i) => {
            return (i % 2 === 0 ? <ProjectInfoDivLeft topicName={p?.topicName} discription={p?.discription} icons={p?.icons} deployLink={p?.deployLink} github={p?.github} readmore={p?.readmore} image={p?.image} key={i} />
                :
                <ProjectInfoDivRight topicName={p?.topicName} discription={p?.discription} icons={p?.icons} deployLink={p?.deployLink} github={p?.github} readmore={p?.readmore} image={p?.image} key={i} />
            )
        })}
    </div>
}


/* creating two comps left and right tried to do with one using the conditional tailwind but will became very messy so the idea is to create two comps other is copy of first just little changes in positions and reder conditionally in the Projects Page */
const ProjectInfoDivLeft = (props) => {
    return <div className=" flex items-center justify-end relative mx-4 font-light pb-40 ">

        <div className="relative">

            <div className="absolute  transition-all duration-300 bg-indigo-900 dark:bg-white h-full w-full opacity-26 hover:opacity-0"

            ></div>


            <img src={themepng} alt="" className="h-[56vh] w-[44vw] object-cover" />
        </div>

        {/* section 1 for the texts like name of project dis and technologies etc */}
        <section className=" w-[46vw] left-0 flex flex-col justify-center p-4 absolute gap-4 z-10 ">

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
const ProjectInfoDivRight = (props) => {
    return <div className=" flex items-center justify-start relative mx-4 font-light pb-40">

        <div className="relative">

            <div className="absolute  transition-all duration-300 bg-indigo-900 dark:bg-white h-full w-full opacity-26 hover:opacity-0"

            ></div>


            <img src={themepng} alt="" className="h-[56vh] w-[44vw] object-cover" />
        </div>

        {/* section 1 for the texts like name of project dis and technologies etc */}
        <section className=" w-[46vw] right-0 flex flex-col justify-center p-4 absolute gap-4 z-10 items-end">

            <span className="text-2xl">{props?.topicName}</span>

            <p className="bg-gray-800 dark:bg-white shadow-sm shadow-slate-900 rounded-md p-6 flex flex-col  text-white dark:text-black gap-6 items-end text-right">
                <p> {props?.discription}</p>
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