"use client";
import { createContext, useContext, useState } from "react";

const PageHeaderContext = createContext();

export function PageHeaderProvider({ children }) {
    const [header, setHeader] = useState({
        icon: null,
        title: "",
        subtitle: "",
    });

    return (
        <PageHeaderContext.Provider value={{ header, setHeader }}>
            {children}
        </PageHeaderContext.Provider>
    );
}

export function usePageHeader() {
    return useContext(PageHeaderContext);
}
