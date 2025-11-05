import { createContext, useContext } from "react";
import { useState } from "react";

const NavContext = createContext();

export function NavToggleContextProvider({ children }) {

    const [toggle, setToggle] = useState(true);
    const val = { toggle, setToggle };
    return <NavContext.Provider value={val}>
        {children}
    </NavContext.Provider>
}

export function useNavToggleContextProvider() {
    return useContext(NavContext);
}