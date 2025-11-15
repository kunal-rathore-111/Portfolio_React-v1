import themepng from "../../assets/projects/theme.png"
import expensifypng from "../../assets/projects/expensify.png"
import todopng from "../../assets/projects/todo.png"

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
import HTML from "@/assets/icons/technologies/HTML";
import CSS from "@/assets/icons/technologies/CSS";

import Readmore from "../../assets/icons/technologies/Readmore";
import LinkIcon from "../../assets/icons/technologies/Link"


import ToolTipEffect from "@/components/tooltip";
import { ProjectContextProvider, useProject } from "@/context/ProjectContext";
import Git from "@/assets/icons/technologies/Git";
import Mdx from "@/assets/icons/technologies/Mdx";
import Vite from "@/assets/icons/technologies/Vite";
import Figma from "@/assets/icons/technologies/Figma";
import Npm from "@/assets/icons/technologies/Npm";

export const ProjectsData = [
    {
        topicName: "VSCode Dark Theme",
        discription: `A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.`,
        icons: [
            { JSON },
            { VS },
            { Cursor },
            { Mdx },
            { Git },
        ],
        github: "https://github.com/kunal-rathore-111/dark-dev-theme.git",
        deployLink: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
        readmore: "will add later",
        image: themepng,
    },

    {
        topicName: "Todo Web-Application",
        discription: `A full-stack Todo application featuring secure user authentication, and a responsive design for seamless task management. Track their daily tasks efficiently.

        Example Creds, Email- kunalx1@gmail.com password- Kunal@1234`,
        icons: [
            { HTML },
            { CSS },
            { JavaScript },
            { NodeJs },
            { ExpressJs },
            { MongoDB },
        ],
        github: `https://github.com/kunal-rathore-111/Todo_Project`,
        deployLink: `https://todo-project-kohl.vercel.app/`,
        readmore: "will add later",
        image: todopng,
    },
    {
        topicName: "Expensify - Expense Tracker Application",
        discription: `A comprehensive full-stack expense tracking application designed to help users manage their finances effectively. Featured with a robust backend API and an intuitive frontend interface to help users organize and monitor their expenses efficiently.`,
        icons: [
            { React },
            { JavaScript },
            { NodeJs },
            { ExpressJs },
            { MongoDB },
        ],
        github: `https://github.com/kunal-rathore-111/Expensify_Update_Project-2`,
        deployLink: `https://expensify-update-project-2.vercel.app`,
        readmore: "will add later",
        image: expensifypng,
    },

]

/* main function of the file */
export const ProjectsPage = () => {
    return <div className="h-full flex flex-col p-2 ">
        <span className="text-3xl">Projects- </span>
        <div className="flex flex-col">
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
        <div className={`flex items-center ${index ? "justify-start" : "justify-end"}  relative mx-4 font-light my-20`}>
            <ProjectImageDiv />
            <ProjectTextDiv />
        </div >)
}

const ProjectImageDiv = () => {
    // accessing the project provider data
    const { props } = useProject();
    return (<div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-700 group">

        <div className="absolute transition-all duration-500 bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-blue-500/40 dark:from-green-500/30 dark:via-emerald-400/25 dark:to-teal-500/30 h-full w-full opacity-40 group-hover:opacity-0 z-10"
        >
        </div>

        <img
            src={props.image}
            alt={props?.topicName || "Project preview"}
            className="h-[52vh] w-[44vw] object-cover transition-transform duration-500 group-hover:scale-105"
        />
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

            <p className="whitespace-pre-line">{props?.discription}</p>

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
                return <span key={i} className=" size-6"><ToolTipEffect Icon={Icon} name={name} /> </span>
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