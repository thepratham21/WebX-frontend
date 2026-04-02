import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import Login from '../components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Sparkles, Zap, Shield, Globe, Menu, X, ArrowRight, TrendingUp, Clock, Lock, Rocket, Code, Palette, Star, Quote } from 'lucide-react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const highlights = [
        'AI generated websites',
        'No coding required',
        'Fully customizable',
    ]

    const [openLogin, setOpenLogin] = useState(false);
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dispatch = useDispatch()
    
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const testimonials = [
        {
            name: "Aditya Kature",
            initials: "AK",
            role: "Founder at ReaDo",
            content: "WebX completely transformed how I build websites. The AI is incredibly intuitive and saved me weeks of development time. Best investment I've made for my business!",
            rating: 5,
            date: "March 2024"
        },
        {
            name: "Kedar Sutar",
            initials: "KS",
            role: "Product Designer",
            content: "The no-code approach combined with AI customization is game-changing. I've built 5 websites in 2 days that would normally take a month. Absolutely incredible!",
            rating: 5,
            date: "February 2024"
        },
        {
            name: "Harshad Shide",
            initials: "HS",
            role: "Freelance Developer",
            content: "WebX has become my go-to tool for client projects. The deployment speed and customization options are unmatched. My clients are always impressed!",
            rating: 5,
            date: "January 2024"
        }
    ]

    const bentoFeatures = [
        {
            icon: Sparkles,
            title: "Prompt to Reality",
            description: "Our AI engine understands your vision through natural language. Just describe it, and watch the structure emerge.",
            gradient: "from-white to-gray-400",
            span: "md:col-span-8",
            hasVisual: true
        },
        {
            icon: Zap,
            title: "Zero Latency",
            description: "Deployment happens instantly. Global CDN ensures your site is live in milliseconds.",
            gradient: "from-white to-gray-400",
            span: "md:col-span-4",
            tags: ["Vercel Edge", "Cloudflare"]
        },
        {
            icon: Shield,
            title: "Safe & Scalable",
            description: "Enterprise-grade security and auto-scaling built into every page created with WebX.",
            gradient: "from-white to-gray-400",
            span: "md:col-span-4"
        },
        {
            icon: Code,
            title: "No Coding. No Limits.",
            description: "Experience the freedom of our advanced AI interface. Every pixel is under your control.",
            gradient: "from-white to-gray-400",
            span: "md:col-span-8",
            hasButton: true
        }
    ]

    const stats = [
        { value: "10K+", label: "Websites Created", color: "text-white" },
        { value: "99.9%", label: "Uptime Guarantee", color: "text-gray-400" },
        { value: "< 1s", label: "Generation Speed", color: "text-white" },
        { value: "24/7", label: "AI Support", color: "text-gray-400" }
    ]

    return (
        <div>
            <div className='relative min-h-screen bg-black text-white overflow-hidden'>
                
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-gray-600/5 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className='absolute inset-0 opacity-5'>
                    <div className='absolute inset-0' style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                        scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-black/40 backdrop-blur-xl'
                    }`}
                >
                    <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className='text-2xl font-bold tracking-tight cursor-pointer'
                            onClick={() => navigate('/')}
                        >
                            <span className='bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>
                                WebX
                            </span>
                        </motion.div>

                        <div className='hidden md:flex items-center gap-8'>
                            <button 
                                onClick={() => navigate("/pricing")}
                                className='text-sm text-gray-300 hover:text-white transition-colors relative group'
                            >
                                Pricing
                                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full' />
                            </button>

                            {userData && (
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className='flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:border-white/20 transition-all cursor-pointer'
                                    onClick={() => navigate("/pricing")}
                                >
                                    <div className='p-1 bg-linear-to-r from-white to-gray-400 rounded-full'>
                                        <Coins className='w-3.5 h-3.5 text-black' />
                                    </div>
                                    <div className='flex items-baseline gap-1'>
                                        <span className='text-xs text-gray-400'>Credits</span>
                                        <span className='text-sm font-bold text-white'>{userData.credit}</span>
                                    </div>
                                </motion.div>
                            )}

                            {!userData ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setOpenLogin(true)}
                                    className='px-6 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-100 transition-all font-medium shadow-lg shadow-white/20'
                                >
                                    Get Started
                                </motion.button>
                            ) : (
                                <div className='relative'>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setOpenProfile(!openProfile)}
                                        className='relative group focus:outline-none'>
                                        <div className='absolute inset-0 rounded-full bg-linear-to-r from-white to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm' />
                                        <img
                                            src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=ffffff&color=000000`}
                                            alt=""
                                            referrerPolicy='no-referrer'
                                            className='relative w-9 h-9 rounded-full border-2 border-white/20 object-cover transition-all duration-200 group-hover:border-white/40 group-hover:scale-105'
                                        />
                                    </motion.button>

                                    <AnimatePresence>
                                        {openProfile && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className='absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50'
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className='px-4 py-4 border-b border-white/10 bg-linear-to-r from-white/5 to-transparent'>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=ffffff&color=000000`}
                                                            alt=""
                                                            className='w-12 h-12 rounded-full border-2 border-white/20 object-cover'
                                                        />
                                                        <div className='flex-1 min-w-0'>
                                                            <p className='text-sm font-semibold text-white truncate'>
                                                                {userData.name}
                                                            </p>
                                                            <p className='text-xs text-gray-400 truncate'>
                                                                {userData.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='py-1'>
                                                    <button
                                                        onClick={() => {
                                                            navigate('/dashboard')
                                                            setOpenProfile(false)
                                                        }}
                                                        className='w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2'
                                                    >
                                                        <Globe className='w-4 h-4' />
                                                        Dashboard
                                                    </button>
                                                </div>

                                                <div className='border-t border-white/10 py-1'>
                                                    <button
                                                        onClick={handleLogout}
                                                        className='w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2'
                                                    >
                                                        <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        <button 
                            className='md:hidden text-white'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10'
                            >
                                <div className='px-6 py-4 flex flex-col gap-4'>
                                    <button 
                                        onClick={() => {
                                            navigate("/pricing")
                                            setMobileMenuOpen(false)
                                        }}
                                        className='text-gray-300 hover:text-white py-2'
                                    >
                                        Pricing
                                    </button>
                                    {!userData ? (
                                        <button
                                            onClick={() => {
                                                setOpenLogin(true)
                                                setMobileMenuOpen(false)
                                            }}
                                            className='px-6 py-2 bg-white text-black rounded-full font-medium'
                                        >
                                            Get Started
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigate('/dashboard')
                                                    setMobileMenuOpen(false)
                                                }}
                                                className='text-gray-300 hover:text-white py-2'
                                            >
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className='text-red-400 hover:text-red-300 py-2'
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>

                <section className='relative pt-40 pb-24 px-6 max-w-7xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className='text-center max-w-4xl mx-auto'
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className='inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10'
                        >
                            <Sparkles className='w-4 h-4 text-gray-400' />
                            <span className='text-xs font-medium text-gray-300'>AI-Powered Website Builder</span>
                        </motion.div>
                        
                        <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6'>
                            <span className='bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>
                                Build your own
                            </span>
                            <br />
                            <span className='bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                                website with WebX!
                            </span>
                        </h1>

                        <p className='text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed'>
                            Create stunning, AI-generated websites in minutes. No coding required. 
                            Fully customizable and ready to deploy.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (userData) {
                                        navigate('/dashboard');
                                    } else {
                                        setOpenLogin(true);
                                    }
                                }}
                                className='group px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg shadow-white/20 flex items-center justify-center gap-2'
                            >
                                {userData ? "Go to Dashboard" : "Generate Website"}
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/pricing")}
                                className='px-8 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all font-medium'
                            >
                                View Pricing
                            </motion.button>
                        </div>
                    </motion.div>
                </section>

                <div className='max-w-7xl mx-auto px-6 mt-20'>
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                        
                        <div className='md:col-span-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden group border border-white/10 hover:border-white/20 transition-all'>
                            <div className='absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                            <div className='relative z-10'>
                                <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4'>
                                    <Sparkles className='w-6 h-6 text-white' />
                                </div>
                                <h3 className='text-2xl font-bold text-white mb-3'>Prompt to Reality</h3>
                                <p className='text-gray-400 max-w-md'>Our AI engine understands your vision through natural language. Just describe it, and watch the structure emerge.</p>
                            </div>
                            <div className='mt-6 rounded-xl overflow-hidden border border-white/5 bg-black/50 h-48 flex items-center justify-center'>
                                <div className='text-center'>
                                    <Code className='w-8 h-8 text-gray-500 mx-auto mb-2' />
                                    <p className='text-xs text-gray-500'>AI Visualization</p>
                                </div>
                            </div>
                        </div>

                        <div className='md:col-span-4 bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all'>
                            <div>
                                <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4'>
                                    <Zap className='w-6 h-6 text-white' />
                                </div>
                                <h3 className='text-2xl font-bold text-white mb-2'>Zero Latency</h3>
                                <p className='text-gray-400 text-sm'>Deployment happens instantly. Global CDN ensures your site is live in milliseconds.</p>
                            </div>
                            <div className='mt-6 pt-6 border-t border-white/10'>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium text-gray-300'>Vercel Edge</span>
                                    <span className='px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium text-gray-300'>Cloudflare</span>
                                </div>
                            </div>
                        </div>

                        <div className='md:col-span-4 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all text-center'>
                            <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 mx-auto'>
                                <Shield className='w-6 h-6 text-white' />
                            </div>
                            <h3 className='text-2xl font-bold text-white mb-2'>Safe & Scalable</h3>
                            <p className='text-gray-400 text-sm'>Enterprise-grade security and auto-scaling built into every page created with WebX.</p>
                        </div>

                        <div className='md:col-span-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-white/10 hover:border-white/20 transition-all'>
                            <div className='flex-1'>
                                <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4'>
                                    <Code className='w-6 h-6 text-white' />
                                </div>
                                <h3 className='text-2xl font-bold text-white mb-3'>No Coding. No Limits.</h3>
                                <p className='text-gray-400 mb-4'>Experience the freedom of our advanced AI interface. Every pixel is under your control.</p>
                                <button className='flex items-center gap-2 text-white font-medium hover:gap-3 transition-all group'>
                                    Explore features 
                                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                                </button>
                            </div>
                            <div className='w-full md:w-1/2 aspect-video rounded-xl overflow-hidden bg-white/5 flex items-center justify-center'>
                                <Palette className='w-12 h-12 text-gray-500' />
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className='max-w-7xl mx-auto px-6 mt-32'>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-center mb-12'
                    >
                        <div className='inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10'>
                            <Quote className='w-4 h-4 text-gray-400' />
                            <span className='text-xs font-medium text-gray-300'>Testimonials</span>
                        </div>
                        <h2 className='text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                            Loved by creators worldwide
                        </h2>
                        <p className='text-gray-400 max-w-2xl mx-auto'>
                            Join thousands of satisfied users who have transformed their web development workflow with WebX
                        </p>
                    </motion.div>

                    <div className='grid md:grid-cols-3 gap-8'>
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all'
                            >
                                
                                <div className='flex gap-1 mb-4'>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className='w-4 h-4 fill-white text-white' />
                                    ))}
                                </div>

                                
                                <p className='text-gray-300 mb-6 leading-relaxed'>
                                    "{testimonial.content}"
                                </p>

                                
                                <div className='flex items-center gap-3 pt-4 border-t border-white/10'>
                                    <div className='w-10 h-10 rounded-full bg-linear-to-r from-white/20 to-white/5 flex items-center justify-center'>
                                        <span className='text-sm font-medium text-white'>{testimonial.initials}</span>
                                    </div>
                                    <div className='flex-1'>
                                        <h4 className='text-sm font-semibold text-white'>{testimonial.name}</h4>
                                        <p className='text-xs text-gray-500'>{testimonial.role}</p>
                                    </div>
                                    <p className='text-xs text-gray-600'>{testimonial.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className='mt-12 text-center'
                    >
                        <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10'>
                            <div className='flex -space-x-2'>
                                {testimonials.map((t, i) => (
                                    <div key={i} className='w-6 h-6 rounded-full bg-linear-to-r from-white/20 to-white/5 border border-white/10 flex items-center justify-center'>
                                        <span className='text-[10px] font-medium text-white'>{t.initials}</span>
                                    </div>
                                ))}
                            </div>
                            <span className='text-xs text-gray-400'>Join 10,000+ happy creators</span>
                        </div>
                    </motion.div>
                </div>

                
                <div className='max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-white/10'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                        {stats.map((stat, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className='space-y-2'
                            >
                                <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className='text-xs text-gray-500 uppercase tracking-wider'>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                
                <div className='max-w-7xl mx-auto px-6 mt-20 mb-20'>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className='relative bg-linear-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center overflow-hidden'
                    >
                        <div className='absolute inset-0 bg-linear-to-r from-white/5 to-transparent' />
                        <Rocket className='w-12 h-12 text-white mx-auto mb-4' />
                        <h2 className='text-2xl md:text-3xl font-bold mb-4'>Ready to build your website?</h2>
                        <p className='text-gray-400 mb-6 max-w-md mx-auto'>
                            Join thousands of creators who are already using WebX
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (userData) {
                                    navigate('/generate');
                                } else {
                                    setOpenLogin(true);
                                }
                            }}
                            className='px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg shadow-white/20 inline-flex items-center gap-2'
                        >
                            Start Building Now
                            <ArrowRight className='w-4 h-4' />
                        </motion.button>
                    </motion.div>
                </div>

                
                <footer className='py-12 px-6 text-center border-t border-white/10'>
                    <div className='max-w-7xl mx-auto'>
                        <p className='text-sm text-gray-500 mb-4'>
                            &copy; 2026 WebX. All rights reserved.
                        </p>
                        <div className='flex justify-center gap-6'>
                            <a
                                href='https://www.linkedin.com/in/your-profile'
                                className='text-sm text-gray-500 hover:text-white transition-colors'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                            <a
                                href='https://www.twitter.com/your-profile'
                                className='text-sm text-gray-500 hover:text-white transition-colors'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </a>
                            <a
                                href='https://www.facebook.com/your-profile'
                                className='text-sm text-gray-500 hover:text-white transition-colors'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {openLogin && <Login open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home