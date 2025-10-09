
import Prism from "prismjs";
import "../../../assets/styles/prism-holi-theme.css"

import "prismjs/components/prism-javascript"; // lang.
import { useEffect } from "react";


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



export const HomePage = () => {

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="h-screen flex flex-col justify-start lg:justify-center items-center mx-11">

            <section className="flex flex-col lg:flex-row items-center justify-between md:gap-40" >
                <div className="flex flex-col justify-center my-18 h-full gap-4 ">
                    <div >
                        <h1 className="text-3xl md:text-4xl font-[300] 
                        text-[#4B0096] dark:text-[#1BD05D]" >Hey there!, I'm-
                        </h1>
                    </div>
                    <div className="pl-3 flex flex-col gap-4 w-[600px]">
                        <h1 className="text-7xl md:text-[150px] font-[600]" >Kunal Rathore </h1>
                        <p className="text-3xl font-[400]">
                            Software Engineer Student.
                            <span className="text-gray-600 dark:text-slate-400 font-[300]"> A self-taught full-stack developer with an
                                interest in Computer Science.</span>
                        </p>
                    </div>
                </div>


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