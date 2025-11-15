import { HomePage } from "./Home.jsx";
import { AboutPage } from "./About.jsx";
import { ProjectsPage } from "./Projects.jsx";
import { useScrollContext } from "@/context/ScrollContext.jsx";

import { useNavToggleContextProvider } from "@/context/NavToggleContext.jsx";
import { ReadsPage } from "./Reads.jsx";
import Footer from "../Footer.jsx";

export const MainComp = () => {
    const { HomeRef, AboutRef, ProjectsRef, ReadsRef } = useScrollContext();

    const { toggle } = useNavToggleContextProvider();



    return <main className={`w-full flex flex-col pl-10 pr-18  transition-all duration-1000 ${toggle ? "pl-[10vw]" : "pl-[12vw]"}`}>
        <div className="py-18" ref={HomeRef} ><HomePage /></div>
        <div className="py-18" ref={AboutRef} ><AboutPage /></div>
        <div className="py-10" ref={ProjectsRef} ><ProjectsPage /></div>
        <div className="py-10" ref={ReadsRef} ><ReadsPage /></div>
        <Footer />
    </main>
}