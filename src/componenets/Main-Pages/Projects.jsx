
import profileImg from "../../assets/profile.png"

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
import { useState } from "react";



const ProjectsData = [
    {
        topicName: "Dark-Theme",
        discription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque explicabo dolore error et animi commodi minima sunt deleniti. A veritatis soluta voluptatem at officiis accusamus nesciunt harum nemo! Perferendis, quam?",
        icons: [],
        deployLink: "https://portfolio-react-v1-nine.vercel.app/"
    },
    {}
]

export const ProjectsPage = () => {
    return <div className="h-full flex flex-col gap-10  p-2">

        <span className="text-3xl">Projects- </span>

        <ProjectInfoDiv />
    </div>
}

const ProjectInfoDiv = () => {
    const [showImg, toggleShowImg] = useState(false);
    return <div className=" flex items-center justify-end relative">

        <div className="h-[54vh] w-[42vw] relative rounded-md overflow-hidden">

            <div onMouseEnter={() => { toggleShowImg(!showImg) }}
                onMouseLeave={() => { toggleShowImg(!showImg) }}
                className={`transition-all duration-300 bg-blue-400 h-full w-full  absolute ${showImg ? "opacity-0" : "opacity-55"}`}

            ></div>


            <img src={profileImg} alt="" className="h-[54vh] w-[42vw] object-cover" />
        </div>

        {/* section 1 for the texts like name of project dis and technologies etc */}
        <section className=" w-[51vw] left-0 flex flex-col justify-center p-4 absolute gap-6 z-10 text-white dark:text-black bg-gray-800 dark:bg-white shadow-sm shadow-slate-900 rounded-md">
            {/* <div className="ring ring-blue-400 flex flex-col gap-10  "> */}
            <span className="text-2xl">Topic name</span>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque explicabo dolore error et animi commodi minima sunt deleniti. A veritatis soluta voluptatem at officiis accusamus nesciunt harum nemo! Perferendis, quam?
            </p>
            <span>
                <p className="flex gap-4">
                    <span className=" size-6"><TypeScript /></span>
                    <span className=" size-6"><MongoDB /></span>
                    <span className=" size-6"><Vercel /></span>
                    <span className=" size-6"><ReactIcon /></span>
                    <span className=" size-6"><TailwindCss /></span>
                    <span className=" size-6"><Postman /></span>

                </p>
                <span>
                    deployLink
                </span>
                <span>
                    Details
                </span>
            </span>
        </section>
    </div >
}