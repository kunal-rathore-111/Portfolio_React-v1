import { HomePage } from "./Home.jsx";
import { AboutPage } from "./About.jsx";
import { ProjectsPage } from "./Projects.jsx";
import { useScrollContext } from "@/context/ScrollContext.jsx";

import { useNavToggleContextProvider } from "@/context/NavToggleContext.jsx";

export const MainComp = () => {
    const { homeRef, AboutRef, ProjectsRef, ReadsRef } = useScrollContext();

    const { toggle } = useNavToggleContextProvider();



    return <main className={`w-full flex flex-col pl-10 pr-18  transition-all duration-1000 ${toggle ? "pl-[10vw]" : "pl-[12vw]"}`}>
        <div className="py-18" ref={homeRef} ><HomePage /></div>
        <div className="py-18" ref={AboutRef} ><AboutPage /></div>
        <div className="py-10" ref={ProjectsRef} ><ProjectsPage /></div>
    </main>
}