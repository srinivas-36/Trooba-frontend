"use client";

import { createContext, useContext, useState } from "react";

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
    const [selectedMonth, setSelectedMonth] = useState(null); // default: null
    // console.log("selectedMonth : ", selectedMonth)

    return (
        <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => useContext(MonthContext);
