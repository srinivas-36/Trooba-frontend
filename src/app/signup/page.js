"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, Building, User, CheckCircle, XCircle } from "lucide-react";

export default function SignupPage() {
    const { login } = useAuth();
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength calculator
    useEffect(() => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    }, [password]);

    const validateForm = () => {
        const newErrors = {};

        if (!company.trim()) newErrors.company = "Company name is required";
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (company && email && password) {
                const fakeToken = "jwt-example-token";
                login(fakeToken);
            }
            setIsLoading(false);
        }, 1500);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 50) return "bg-red-500";
        if (passwordStrength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">Join us and start your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Company Name"
                                className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                                value={company}
                                onChange={(e) => {
                                    setCompany(e.target.value);
                                    if (errors.company) setErrors({ ...errors, company: '' });
                                }}
                            />
                        </div>
                        {errors.company && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.company}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.email}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className={`w-full pl-10 pr-10 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>

                        {password && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                                        style={{ width: `${passwordStrength}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Password strength: {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                                </div>
                            </div>
                        )}

                        {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.password}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className={`w-full pl-10 pr-10 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                }}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>



                <p className="text-sm text-gray-600 mt-6 text-center">
                    Already have an account?{" "}
                    <a href="/" className="text-purple-600 font-semibold hover:underline transition-all">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}