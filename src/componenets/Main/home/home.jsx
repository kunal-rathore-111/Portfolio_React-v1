
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
        <div className="h-screen flex flex-col justify-center mx-9">

            <section className="flex flex-row items-start justify-between " >
                <div className="flex flex-col justify-start my-18 h-full gap-4 ">
                    <div>
                        <h1 className="text-8xl font-[400]">Hello,</h1>
                        <h1 className="text-9xl font-[500]"> I'm Kunal</h1>
                    </div>
                    <pre >I work with React Ecosystem, and write to teach people
                        <br />
                        how to rebuild and redefine fundamental concepts through
                        <br />
                        mental models.
                    </pre>
                </div>


                <div className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 p-1 rounded-xl mr-12">
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