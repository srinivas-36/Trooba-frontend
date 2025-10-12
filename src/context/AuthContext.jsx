"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [company, setCompany] = useState(null);
    const [shopifyCheck, setShopifyCheck] = useState(null)
    const [shopifyUrl, setShopifyUrl] = useState(null)
    const router = useRouter();

    // Load token & company from localStorage on client side
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedCompany = localStorage.getItem("company_name");
        const savedShopify = localStorage.getItem("shopify_access_token_check");
        const savedShopifyUrl = localStorage.getItem("shopify_store_url");

        if (savedToken) setToken(savedToken);
        if (savedCompany) setCompany(savedCompany);
        if (savedShopify) setShopifyCheck(savedShopify === "true"); // convert string to boolean
        if (savedShopifyUrl) setShopifyUrl(savedShopifyUrl);
    }, []);

    // console.log(company)
    const login = (newToken, company_name, shopify_access_token_check, shopify_store_url) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("company_name", company_name);
        localStorage.setItem("shopify_access_token_check", shopify_access_token_check);
        localStorage.setItem("shopify_store_url", shopify_store_url);

        setToken(newToken);
        setCompany(company_name);
        setShopifyCheck(shopify_access_token_check);
        setShopifyUrl(shopify_store_url);

        router.push("/settings");
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("company_name");
        localStorage.removeItem("shopify_access_token_check");
        localStorage.removeItem("shopify_store_url");
        setToken(null);
        setCompany(null);
        setShopifyCheck(null)
        setShopifyUrl(null)
        router.push("/");
        toast.success("Logged out successfully");
    };

    // Only provide context once token is loaded
    const value = {
        token,
        company,
        shopifyCheck,
        shopifyUrl,
        login,
        logout,
        setShopifyCheck,
        setShopifyUrl
    };


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
