
import Prism from "prismjs";
import "../../../assets/styles/prism-holi-theme.css"
import "../../../assets/styles/prism-holi-theme-light.css"

import "prismjs/components/prism-javascript"; // lang.
import { useEffect } from "react";


const code = {
    name: 'Nazmul Hossain',
    title: 'Full-Stack Developer | Cloud Enthusiast | Problem Solver',
    skills: [
        'React', 'NextJS', 'Redux', 'Express',
        'MySQL', 'MongoDB', 'Docker', 'AWS', 'TypeScript',
        'GraphQL', 'Git', 'Linux', 'Discord Development'
    ],
    hardWorker: true,
    quickLearner: true,
    problemSolver: true,
    yearsOfExperience: 4,
    hireable: function () {
        return (
            this.hardWorker &&
            this.problemSolver &&
            this.skills.length >= 5 &&
            this.yearsOfExperience >= 3
        );
    }
};

const codeString = `const code = ${JSON.stringify(code, null, 2)}`

export const HomePage = () => {

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="h-screen flex flex-col justify-center mx-9">

            <section className="flex flex-row items-start gap-8 justify-between " >
                <div className="flex flex-col justify-start mt-30  h-full gap-4 ">
                    <div>
                        <h1 className="text-7xl font-[400]">Hello,</h1>
                        <h1 className="text-9xl font-[500]"> I'm Kunal</h1>
                    </div>
                    <pre >I work with React Ecosystem, and write to teach people
                        <br />
                        how to rebuild and redefine fundamental concepts through
                        <br />
                        mental models.
                    </pre>
                </div>

                <div className='w-[650px] mr-4'>
                    <pre >
                        <code className="language-javascript">
                            {codeString}
                        </code>
                    </pre>
                </div>
            </section>

        </div>
    )
}