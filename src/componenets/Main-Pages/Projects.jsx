
import profileImg from "../../assets/profile.png"
export const ProjectsPage = () => {
    return <div className="h-full flex flex-col gap-10  p-2">

        <span className="text-3xl">Projects- </span>

        <div className=" flex items-center justify-end relative">

            <img src={profileImg} alt="" className="h-[54vh] w-[42vw] object-cover" />

            {/* section 1 for the texts like name of project dis and technologies etc */}
            <section className=" w-[51vw] left-0 flex flex-col justify-center p-4 absolute gap-6 z-10 text-white dark:text-black bg-gray-800 dark:bg-white shadow-sm shadow-slate-900 rounded-md">
                {/* <div className="ring ring-blue-400 flex flex-col gap-10  "> */}
                <span className="text-2xl">Topic name</span>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque explicabo dolore error et animi commodi minima sunt deleniti. A veritatis soluta voluptatem at officiis accusamus nesciunt harum nemo! Perferendis, quam?
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, nihil.
                </p>
            </section>
        </div>
    </div>
}