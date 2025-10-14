"use client";

import { createContext, useContext, useState } from "react";

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
    // Separate month states for different pages
    const [dashboardMonth, setDashboardMonth] = useState(null);
    const [masterDataMonth, setMasterDataMonth] = useState(null);

    return (
        <MonthContext.Provider
            value={{
                dashboardMonth,
                setDashboardMonth,
                masterDataMonth,
                setMasterDataMonth,
            }}
        >
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => useContext(MonthContext);
