import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../utils/constants'
import axios from 'axios'

const Dashboard = () => {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)

    const handleDeploy = async (id) => {
        try {
            const result = await axios.post(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, '_blank')
            setWebsites((prev) => prev.map((w) => w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/all`, { withCredentials: true })
                setWebsites(result.data || [])
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Failed to load websites")
                setLoading(false)
            }
        }
        handleGetAllWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className='min-h-screen bg-black'>
            {/* Header */}
            <div className='border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-10'>
                <div className='max-w-7xl mx-auto px-6 py-4'>
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
                            <h2 className='text-xl font-bold tracking-tight text-white'>Dashboard</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/generate')}
                            className='px-5 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-100 transition-colors font-medium'
                        >
                            + Create New Website
                        </button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-8'>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-10 pb-6 border-b border-white/10'
                >
                    <p className='text-sm text-gray-400 mb-1'>Welcome Back</p>
                    <h1 className='text-3xl font-bold tracking-tight text-white'>{userData?.name}</h1>
                </motion.div>

                <AnimatePresence>
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='flex justify-center items-center py-20'
                        >
                            <div className='flex flex-col items-center gap-3'>
                                <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                                <p className='text-gray-400 text-sm'>Loading your websites...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6'
                    >
                        <p className='text-red-400 text-sm text-center'>{error}</p>
                    </motion.div>
                )}

                {websites?.length === 0 && !loading && !error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center py-20'
                    >
                        <div className='max-w-md mx-auto'>
                            <div className='w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center'>
                                <svg className='w-8 h-8 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className='text-lg font-semibold text-white mb-2'>No websites yet</h3>
                            <p className='text-gray-400 text-sm mb-6'>Create your first website to get started</p>
                            <button 
                                onClick={() => navigate('/generate')}
                                className='px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium'
                            >
                                Create Website
                            </button>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && websites?.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        {websites.map((website, i) => {
                            const copied = copiedId === website._id
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className='group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer'
                                    onClick={() => navigate(`/editor/${website._id}`)}
                                >
                                    <div className='h-48 bg-black/50 overflow-hidden'>
                                        <iframe 
                                            srcDoc={website.latestCode} 
                                            title={website.name}
                                            className='w-full h-full scale-75 origin-top-left pointer-events-none'
                                            sandbox="allow-same-origin allow-scripts"
                                        />
                                    </div>

                                    <div className='p-5'>
                                        <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors'>
                                            {website.name}
                                        </h3>
                                        
                                        <div className='space-y-1 mb-4'>
                                            <p className='text-xs text-gray-500'>
                                                Created: {formatDate(website.createdAt)}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                Last Updated: {formatDate(website.updatedAt)}
                                            </p>
                                        </div>

                                        {!website.deployed ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeploy(website._id)
                                                }}
                                                className='w-full px-4 py-2 bg-white text-black text-sm rounded-lg hover:bg-gray-100 transition-colors font-medium'
                                            >
                                                Deploy Website
                                            </button>
                                        ) : (
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCopy(website)
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                className='relative w-full px-4 py-2 border border-white/20 text-gray-300 text-sm rounded-lg hover:bg-white/5 transition-colors overflow-hidden'
                                            >
                                                <AnimatePresence mode="wait">
                                                    {copied ? (
                                                        <motion.span
                                                            key="copied"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className='flex items-center justify-center gap-2'
                                                        >
                                                            <svg className='w-4 h-4 text-green-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Copied!
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="share"
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className='flex items-center justify-center gap-2'
                                                        >
                                                            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                            </svg>
                                                            Share Link
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Dashboard