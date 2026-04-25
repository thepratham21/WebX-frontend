import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { serverUrl } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { Mail, Lock, User, X, ArrowRight } from 'lucide-react';

const Login = ({ open, onClose }) => {
    const dispatch = useDispatch();

    // ✅ FIX: states inside component
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    // ✅ Signup handler
    const handleSignUp = async () => {
        try {
            if (!name || !email || !password) {
                return alert("All fields required");
            }
            
            setLoading(true);
            const { data } = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { name, email, password },
                { withCredentials: true }
            );

            dispatch(setUserData(data));
            setLoading(false);
            onClose();

        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    // ✅ Google login
    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);

            const { data } = await axios.post(
                `${serverUrl}/api/auth/google`,
                {
                    name: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL,
                },
                { withCredentials: true }
            );

            dispatch(setUserData(data));
            setLoading(false);
            onClose();

        } catch (error) {
            setLoading(false);
            console.error(error);
            alert("Google login failed. Please try again.");
        }
    };

    // ✅ Email login
    const handleEmailLogin = async () => {
        try {
            if (!email || !password) {
                return alert("Email and password required");
            }
            
            setLoading(true);
            const { data } = await axios.post(
                `${serverUrl}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            dispatch(setUserData(data));
            setLoading(false);
            onClose();

        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-md bg-linear-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="p-8">
                        {/* Logo/Brand */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-linear-to-r from-white/10 to-white/5 rounded-full border border-white/10">
                                <span className="text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    W
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {isSignup ? "Create Account" : "Welcome Back"}
                            </h2>
                            <p className="text-sm text-gray-400 mt-2">
                                {isSignup 
                                    ? "Start building amazing websites with WebX" 
                                    : "Sign in to continue to WebX"}
                            </p>
                        </div>

                        {/* FORM */}
                        <div className="space-y-4">
                            {isSignup && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-white placeholder-gray-500"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-white placeholder-gray-500"
                                />
                            </div>

                            <button
                                onClick={isSignup ? handleSignUp : handleEmailLogin}
                                disabled={loading}
                                className="relative w-full py-2.5 bg-white text-black rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {isSignup ? "Create Account" : "Sign In"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-linear-to-br from-gray-900 to-black text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full py-2.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-gray-300 hover:text-white disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm">Continue with Google</span>
                            </button>
                            
                            <button
                                disabled={loading}
                                className="w-full py-2.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-gray-300 hover:text-white disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                                </svg>
                                <span className="text-sm">Continue with GitHub</span>
                            </button>
                        </div>

                        
                        <p className="text-center mt-6 text-sm text-gray-400">
                            {isSignup ? "Already have an account?" : "Don't have an account?"}
                            <button
                                onClick={() => {
                                    setIsSignup(!isSignup)
                                    setName("")
                                    setEmail("")
                                    setPassword("")
                                }}
                                className="ml-2 text-white hover:underline font-medium"
                            >
                                {isSignup ? "Sign In" : "Create Account"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Login;