

import profileImg from "../../assets/profile.png"

export const AboutPage = () => {
    {/* second section  */ }
    return <section className="h-full w-full flex flex-row items-center justify-evenly" >
        {/* image div */}
        <img src={profileImg} alt="profileImg" className="rounded-xl h-100  shadow-xl" />
        {/* rigth part for about me */}
        <div className="flex flex-col justify-center  gap-4 w-[50%] ">
            <AboutComp />
        </div>
    </section >
}


const AboutComp = () => {
    return <div className="flex flex-col w-150 font-light dark:font-extralight ">
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