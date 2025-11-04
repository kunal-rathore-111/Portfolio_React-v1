import { HomePage } from "./Home.jsx";
import { AboutPage } from "./About.jsx";
import { ProjectsPage } from "./Projects.jsx";
import { useScrollContext } from "@/context/ScrollContext.jsx";


export const MainComp = () => {
    const { homeRef, AboutRef, ProjectsRef, ReadsRef } = useScrollContext();

    return <main className="h-full w-full flex flex-col overflow-y-scroll text-black bg-white dark:text-white dark:bg-black pl-10 pr-18">
        <div className="py-30" ref={homeRef} ><HomePage /></div>
        <div className="py-30" ref={AboutRef} ><AboutPage /></div>
        <div className="py-30" ref={ProjectsRef} ><ProjectsPage /></div>
    </main>
}