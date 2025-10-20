
// using prism for styling code block of profile
import Prism from "prismjs";
import "../../../assets/styles/prism-holi-theme.css"

import "prismjs/components/prism-javascript"; // importing language
import { useEffect } from "react";
import profileImg from "../../../assets/profile.png"

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
    { title: "Github", icon: <Github />, navigateLink: 'https://github.com/Kunal-Rathore-5' },
    { title: "Email", icon: <Mail />, navigateLink: 'https://mail.google.com/mail/?view=cm&fs=1&to=kunalworkspace111@gmail.com' },
    { title: "Linkdin", icon: <Linkedin />, navigateLink: '' }
]


export const HomePage = () => {

    // useEffect for highlighing code
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="h-full flex flex-col ml-11 mr-14">
            {/* first section which will shown on landing */}
            <section className="flex flex-row  items-center justify-between py-17" >

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
            {/* second section  */}
            <section className="flex flex-row  items-center justify-evenly py-30" >

                {/* image div */}
                <img src={profileImg} alt="profileImg" className="rounded-xl h-100  shadow-xl" />
                {/* rigth part for about me */}
                <div className="flex flex-col justify-center  gap-4   w-[50%] ">
                    <AboutComp />
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
                className="text-xl font-light  border-2 border-slate-500 py-1 px-2 rounded cursor-pointer flex gap-2 items-center">

                {props.icon ? props.icon : ""}
                <span>{props?.title}</span>

            </span>
        </a>
    )
}

const AboutComp = () => {
    return <div className="flex flex-col w-150 font-light dark:font-extralight">
        <span className="text-4xl ">About Me- </span>
        <span className="text-xl">
            <p>
                <br />
                I'm a pre-final year B.Tech student specializing in Information Technology, passionate about solving real-world problems through technology. With a strong foundation in programming, data structures, and web development, I'm continuously exploring new technologies and working on projects that challenge me to grow.
            </p>
            <br />
            <p> Currently honing my skills in <span className=" text-fuchsia-600  dark:text-lime-500 dark:font-light"> Web Development </span>, I'm actively looking for internship opportunities to apply my knowledge in real-world scenarios and contribute to impactful projects. I thrive in collaborative environments, enjoy learning from others, and am eager to take on challenges that push my boundaries.</p>

        </span>
    </div>
}