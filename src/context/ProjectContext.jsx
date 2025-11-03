import { createContext, useContext } from "react";



export const ProjectContext = createContext();

export const ProjectContextProvider = ({ children, value }) => {
    return <ProjectContext.Provider value={value}>
        {children}
    </ProjectContext.Provider>
}

//opening box (where box is ProjectContext provider storing the value)

export const useProject = () => {
    const context = useContext(ProjectContext); // get the props of the provider
    if (!context) return "In-accessible outside the project context provider";
    return context;
}

