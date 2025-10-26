
// using prism for styling code block of profile
import Prism from "prismjs";
import "../../assets/styles/prism-holi-theme.css"

import "prismjs/components/prism-javascript"; // importing language
import { useEffect } from "react";

import { Linkedin, Github, Mail } from "lucide-react";

const codeString = `const Profile = {
  name: 'Kunal Rathore',
  title: 'Full-Stack Developer | Problem Solver',
  skills: [
    'React', 'TypeScript', 'Express', 'Node.js',
    'MySQL', 'MongoDB', 'Redis',
    'AWS', 'GraphQL', 'Figma',
    'Git', 'Linux'....
  ],
  problemSolver: true,
  hireable: function () {
    return (
      this.hardWorker &&
      this.problemSolver &&
      this.skills.length >= 5 &&
    );
  }
};`;


const Contact = [
    { title: "Github", icon: <Github strokeWidth={1.5} />, navigateLink: 'https://github.com/Kunal-Rathore-5' },
    { title: "Email", icon: <Mail strokeWidth={1.5} />, navigateLink: 'https://mail.google.com/mail/?view=cm&fs=1&to=kunalworkspace111@gmail.com' },
    { title: "Linkdin", icon: <Linkedin strokeWidth={1.5} />, navigateLink: '' }
]


export const HomePage = () => {

    // useEffect for highlighing code
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="h-full w-full flex flex-col justify-between">
            {/* first section which will shown on landing */}
            <section className="flex flex-row  items-center justify-between" >

                {/* left part for greeting and name */}
                <div className="flex flex-col justify-center  h-full gap-4 ">
                    <GreetComp />
                </div>

                {/* right part, code themed my info */}
                <div className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 p-1 rounded-xl w-[300px] md:w-auto">
                    <pre className="!m-0">
                        <code className="language-javascript">
                            {codeString}
                        </code>
                    </pre>
                </div>
            </section >

        </div>
    )
}


const GreetComp = () => {
    return <div>
        <h1 className="text-3xl md:text-4xl font-[300] 
                text-[#4B0096] dark:text-yellow-300" >Hey there!, I'm-
        </h1>

        <div className="pl-3 flex flex-col gap-6 w-[600px]">
            <h1 className="text-7xl md:text-[150px] font-[600] text-black dark:text-gray-200 " >Kunal Rathore
            </h1>
            <DiscComp />
            <div className="flex gap-3">
                <ContactComps />
            </div>
        </div>
    </div>
}

const DiscComp = () => {
    return <p className="text-3xl font-[400]">
        Software Engineer Student.
        <span className="text-gray-600 dark:text-slate-400 font-[300]"> A self-taught full-stack developer with an
            interest in Computer Science.</span>
    </p>

}

const ContactComps = () => {
    return <>
        {Contact.map((d) => { return <ContactDiv title={d.title} icon={d.icon} navigateLink={d.navigateLink} /> })}
    </>
}

const ContactDiv = (props) => {
    return (
        <a href={props.navigateLink} target="_blank">
            <span
                className="text-lg font-light border-2  py-1 px-3 rounded-lg cursor-pointer flex gap-2 items-center ">

                {props.icon ? props.icon : ""}
                <span>{props?.title}</span>

            </span>
        </a>
    )
}
