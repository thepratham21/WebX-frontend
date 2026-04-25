import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'   
import { serverUrl } from '../utils/constants';

const PHASES = [
    "Analyzing your idea...",
    "Designing layout and structure...",
    "Writing code...",
    "Adding animations and interactivity",
    "Verifying code",
    "Preparing for final results",
];

const Generate = () => {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")

    const handleGenerate = async () => {
        setLoading(true)
        setError("")
        try {
            const result = await axios.post(`${serverUrl}/api/website/genrate`, {prompt}, {withCredentials: true})
            console.log(result)
            setProgress(100)
            setLoading(false)   
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error.response?.data?.message || "Something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        if(!loading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0;
        let phase = 0;

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                ? Math.random() * 1.2
                : Math.random() * 0.6;
        
            value += increment;

            if(value >= 93) value = 93;

            phase = Math.min(
                Math.floor((value/100)*PHASES.length), PHASES.length-1   
            )

            setProgress(value)
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='min-h-screen bg-black'>
            
            <div className='border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-10'>
                <div className='max-w-4xl mx-auto px-6 py-4'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <button 
                                onClick={() => navigate('/')}
                                className='text-gray-400 hover:text-white transition-colors'
                            >
                                <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h2 className='text-xl font-bold tracking-tight text-white'>
                                WebX<span className='text-gray-500'>.ai</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-6 py-12'>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-5xl md:text-6xl font-bold tracking-tight text-white mb-4'>
                        Generate websites with
                        <span className='block bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent mt-2'>AI Power</span>
                    </h1>
                    <p className='text-gray-400 text-sm'>
                        Describe your vision, and watch AI bring it to life
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='mb-8'
                >
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Describe your website
                    </label>
                    <div className='relative'>
                        <textarea 
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            rows="6"
                            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none text-white placeholder-gray-500'
                            placeholder='Describe your website in detail. For example: "A modern portfolio website for a photographer with a gallery section, about me page, and contact form. Use a minimalist design with light colors and smooth animations."'
                        />
                        <div className='absolute bottom-3 right-3 text-xs text-gray-500'>
                            {prompt.length} characters
                        </div>
                    </div>

                    
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className='mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3'
                            >
                                <p className='text-red-400 text-sm text-center'>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='flex justify-center mb-12'
                >
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || loading}
                        className={`
                            px-8 py-3 rounded-full text-black font-medium transition-all
                            ${!prompt.trim() || loading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-white hover:bg-gray-100 transform hover:scale-105'
                            }
                        `}
                    >
                        {loading ? 'Generating...' : 'Generate Website'}
                    </button>
                </motion.div>

                
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className='bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6'
                        >
                            <div className='flex justify-between items-center mb-4'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                                    <span className='text-sm font-medium text-gray-300'>
                                        {PHASES[phaseIndex]}
                                    </span>
                                </div>
                                <span className='text-sm font-semibold text-white'>
                                    {Math.floor(progress)}%
                                </span>
                            </div>

                            <div className='relative h-1.5 bg-white/10 rounded-full overflow-hidden mb-4'>
                                <motion.div
                                    className='absolute top-0 left-0 h-full bg-white rounded-full'
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.8 }}
                                />
                            </div>

                            <div className='text-center'>
                                <p className='text-xs text-gray-500'>
                                    Estimated time remaining: {' '}
                                    <span className='font-medium text-gray-400'>~8-12 minutes</span>
                                </p>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className='mt-6 pt-4 border-t border-white/10'
                            >
                                <p className='text-xs text-gray-500 text-center'>
                                    💡 Tip: More detailed descriptions lead to better results
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!loading && !prompt && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mt-8 text-center'
                    >
                        <div className='inline-block bg-white/5 rounded-lg px-4 py-3 border border-white/10'>
                            <p className='text-xs text-gray-500'>
                                ✨ Try: "A modern blog about technology with dark mode, comment section, and newsletter signup"
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Generate