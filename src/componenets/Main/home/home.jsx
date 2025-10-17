
// using prism for styling code block of profile
import Prism from "prismjs";
import "../../../assets/styles/prism-holi-theme.css"

import "prismjs/components/prism-javascript"; // importing language
import { useEffect } from "react";
import { ContactDiv } from "../../contactSection";

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
    { title: "Github", icon: <Github />, link: 'www.g.com' },
    { title: "Email", icon: <Mail />, link: 'www.g.com' },
    { title: "Linkdin", icon: <Linkedin />, link: 'www.g.com' }
]


export const HomePage = () => {

    // useEffect for highlighing code
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        // main div of the home page/landing
        <div className="h-screen flex flex-col justify-center mx-11">

            {/* first section which will shown on landing */}
            <section className="flex flex-row  items-center justify-between" >

                {/* left part for greeting and name */}
                <div className="flex flex-col justify-center my-18 h-full gap-4 ">
                    <div >
                        <h1 className="text-3xl md:text-4xl font-[300] 
                        text-[#4B0096] dark:text-[#1BD05D]" >Hey there!, I'm-
                        </h1>
                    </div>
                    <div className="pl-3 flex flex-col gap-6 w-[600px]">
                        <h1 className="text-7xl md:text-[150px] font-[600]" >Kunal Rathore </h1>
                        <p className="text-3xl font-[400]">
                            Software Engineer Student.
                            <span className="text-gray-600 dark:text-slate-400 font-[300]"> A self-taught full-stack developer with an
                                interest in Computer Science.</span>
                        </p>
                        <div className="flex gap-3">
                            {Contact.map((d) => { return <ContactDiv title={d.title} icon={d.icon} /> })}
                        </div>
                    </div>
                </div>

                {/* code themed my info */}
                <div className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 p-1 rounded-xl mr-12 w-[300px] md:w-auto">
                    <pre className="!m-0">
                        <code className="language-javascript">
                            {codeString}
                        </code>
                    </pre>
                </div>
            </section >
        </div >
    )
}