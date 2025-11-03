
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


import Readmore from "../../assets/icons/technologies/Readmore";
import LinkIcon from "../../assets/icons/technologies/Link"


import ToolTipEffect from "@/components/ui/tooltip";


const ProjectsData = [
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

export const ProjectsPage = () => {
    return <div className="h-full flex flex-col p-2">

        <span className="text-3xl">Projects- </span>
        <div className="flex flex-col gap-30">
            {ProjectsData.map((p, i) => {
                return (i % 2 === 0 ?
                    <ProjectInfoDivLeft
                        topicName={p?.topicName}
                        discription={p?.discription}
                        icons={p?.icons}
                        deployLink={p?.deployLink}
                        github={p?.github}
                        readmore={p?.readmore}
                        image={p?.image}
                        key={i} />

                    :
                    <ProjectInfoDivLeft
                        topicName={p?.topicName}
                        discription={p?.discription}
                        icons={p?.icons}
                        deployLink={p?.deployLink} github={p?.github} readmore={p?.readmore} image={p?.image} key={i} />
                    /*  <ProjectInfoDivRight topicName={p?.topicName} discription={p?.discription} icons={p?.icons} deployLink={p?.deployLink} github={p?.github} readmore={p?.readmore} image={p?.image} key={i} /> */
                )
            })}
        </div>
    </div>
}


/* creating two comps left and right tried to do with one using the conditional tailwind but will became very messy so the idea is to create two comps other is copy of first just little changes in positions and reder conditionally in the Projects Page */
const ProjectInfoDivLeft = () => {
    return <div className=" flex items-center justify-end relative mx-4 font-light">

        <ProjectImageDiv />
        <ProjectTextDiv />


    </div >
}


const ProjectImageDiv = () => {
    return (<div className="relative">

        <div className="absolute  transition-all duration-300 bg-gray-600 dark:bg-green-200 h-full w-full opacity-36 hover:opacity-0"
        ></div>

        <img src={image} alt="" className="h-[50vh] w-[44vw] object-cover" />
    </div>)
}

{/* section 1 for the texts like name of project dis and technologies etc */ }
const ProjectTextDiv = () => {
    return <section className=" w-[46vw] left-0 flex flex-col justify-center p-4 absolute gap-4 z-10 ">

        <span className="text-2xl">{props?.topicName}</span>
        <ProjectDiscriptionDiv />
    </section >
}

const ProjectDiscriptionDiv = () => {
    return (<>
        <div className="bg-gray-800 bg-green-400 dark:bg-gray-900 shadow-sm shadow-slate-900 rounded-sm p-4 flex flex-col gap-6 ml-2">

            {props?.discription}

            <TechnologyIcons />

        </div>
        <LinksForMoreDiv />
    </>)
}

const TechnologyIcons = () => {
    return (
        <div className=" flex justify-start gap-4 bg-white dark:bg-lime-400 w-fit p-2 rounded px-3 py-2">
            {props?.icons.map((iconObj, i) => {
                if (!iconObj || Object.entries(iconObj).length === 0) return null;
                const [name, Icon] = Object.entries(iconObj)[0];
                return <span key={i} className=" size-6"><ToolTipEffect Icon={Icon} name={name} /></span>
            })}
        </div>)
}

const LinksForMoreDiv = () => {
    return (
        <div className="flex gap-3 ml-2">
            <a href={props.github} target="_blank" rel="noopener noreferrer"><Github /></a>
            <a href={props.deployLink} target="_blank" rel="noopener noreferrer"><LinkIcon /></a>
            <a href=" need to implement later via useNavigate SPA "><Readmore /></a>
        </div>
    )
}