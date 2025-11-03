
import themepng from "../../assets/projects/theme.png"

import TypeScript from "../../assets/icons/technologies/TypeScript";
import React from "../../assets/icons/technologies/React";
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
import JavaScript from "@/assets/icons/technologies/JS";

import Readmore from "../../assets/icons/technologies/Readmore";
import LinkIcon from "../../assets/icons/technologies/Link"


import ToolTipEffect from "@/components/ui/tooltip";

const ProjectsData = [
    {
        topicName: "VSCode Dark Theme",
        discription: `A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.`,
        icons: [
            { JSON },
            { VS },
            { Cursor },
        ],
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        readmore: "will add later",
        image: themepng,
    },

    {
        topicName: "Todo Web-Application",
        discription: `A full-stack Todo application built with the MERN stack (MongoDB, Express.js, Node.js) and vanilla JavaScript frontend.
The application features user authentication todo management with CRUD operations, and a responsive design.`,
        icons: [
            /*  { HTML },
             { CSS }, */
            { JavaScript },
            { NodeJs },
            { ExpressJs },
            { MongoDB },
        ],
        github: `https://github.com/kunal-rathore-111/Todo_Project`,
        deployLink: `https://todo-project-kohl.vercel.app/`,
        readmore: "will add later",
        image: themepng,
    },

    {
        topicName: "VSCode Dark Theme",
        discription: "A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.",
        icons: [
            { JSON },
            { VS },
            { Cursor },
        ],
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        readmore: "will add later",
        image: themepng,
    },

    {
        topicName: "VSCode Dark Theme",
        discription: "A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.",
        icons: [
            { JSON },
            { VS },
            { Cursor },
        ],
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        readmore: "will add later",
        image: themepng,
    },


]

import { ProjectContextProvider, useProject } from "@/context/ProjectContext";


export const ProjectsPage = () => {
    return <div className="h-full flex flex-col p-2">

        <span className="text-3xl">Projects- </span>
        <div className="flex flex-col gap-30">
            {ProjectsData.map((props, i) => {
                // passing the data in p and the 0 or 1 for condtional alignment 
                const index = i % 2;
                const val = { props, index };
                return <ProjectContextProvider value={val} key={i}>
                    <ProjectInfoDiv />
                </ProjectContextProvider>
            })}
        </div>
    </div>
}


/* creating two comps left and right tried to do with one using the conditional tailwind but will became very messy so the idea is to create two comps other is copy of first just little changes in positions and reder conditionally in the Projects Page */
const ProjectInfoDiv = () => {
    const { index } = useProject();
    return (
        <div className={`flex items-center ${index ? "justify-start" : "justify-end"}  relative mx-4 font-light`}>
            <ProjectImageDiv />
            <ProjectTextDiv />
        </div >)
}

const ProjectImageDiv = () => {
    // accessing the project provider data
    const { props } = useProject();
    return (<div className="relative">

        <div className="absolute  transition-all duration-300 bg-gray-600 dark:bg-green-200 h-full w-full opacity-36 hover:opacity-0"
        >
        </div>

        <img src={props.image} alt="" className="h-[52vh] w-[44vw] object-cover" />
    </div>)
}

{/* section 1 for the texts like name of project dis and technologies etc */ }

const ProjectTextDiv = () => {
    const { props, index } = useProject();
    return <section className={`w-[48vw] ${index ? "right-0 items-end" : "left-0 items-start"} flex flex-col justify-center  p-4 absolute gap-4 z-10`}>
        <span className="text-2xl">{props?.topicName}</span>
        <ProjectDiscriptionDiv />
    </section >
}



const ProjectDiscriptionDiv = () => {
    const { props, index } = useProject();
    return <div className={`flex flex-col ${index ? "items-end" : "items-start"} gap-6 ml-2`}>

        < div className={`bg-green-400 dark:bg-gray-900 shadow-sm shadow-slate-900 rounded-sm p-4 flex flex-col ${index ? "items-end" : "items-start"} gap-6 `}  >

            {props?.discription}

            < TechnologyIcons />

        </div >
        <LinksForMoreDiv />
    </div >
}

const TechnologyIcons = () => {
    const { props } = useProject();
    return (
        <div className=" flex justify-start gap-4 bg-[#EDE8DC] dark:bg-gray-700 w-fit p-2 rounded px-3 py-1.5">
            {props?.icons.map((iconObj, i) => {
                if (!iconObj || Object.entries(iconObj).length === 0) return null;
                const [name, Icon] = Object.entries(iconObj)[0];
                return <span key={i} className=" size-6"><ToolTipEffect Icon={Icon} name={name} /></span>
            })}
        </div>)
}

const LinksForMoreDiv = () => {
    const { props } = useProject();
    return (
        <div className="flex gap-3 ml-2">
            <a href={props.github} target="_blank" rel="noopener noreferrer"><Github /></a>
            <a href={props.deployLink} target="_blank" rel="noopener noreferrer"><LinkIcon /></a>
            <a href=" need to implement later via useNavigate SPA "><Readmore /></a>
        </div>
    )
}