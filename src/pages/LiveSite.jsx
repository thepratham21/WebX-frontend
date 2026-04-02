import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'

const LiveSite = () => {
    const {id} = useParams()
    const [html, setHtml] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleGetWebsite = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`, { withCredentials: true })
                setHtml(result.data.latestCode)
                setError("")
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Website not found")
                setHtml("")
            } finally {
                setLoading(false)
            }
        }

        handleGetWebsite()
    }, [id])

    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex flex-col items-center gap-3'
                >
                    <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                    <p className='text-gray-400 text-sm'>Loading your website...</p>
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center p-4'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='max-w-md w-full'
                >
                    <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center'>
                        <div className='w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center'>
                            <svg className='w-8 h-8 text-red-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className='text-xl font-bold tracking-tight text-white mb-2'>
                            Website Not Found
                        </h2>
                        <p className='text-gray-400 text-sm mb-6'>
                            {error}
                        </p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className='px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium'
                        >
                            Go Home
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-black'>
            
            <div className='fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-10'>
                <div className='max-w-7xl mx-auto px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                            <span className='text-sm text-gray-400'>Live Preview</span>
                        </div>
                        <button 
                            onClick={() => window.history.back()}
                            className='text-xs text-gray-500 hover:text-white transition-colors'
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Iframe */}
            <iframe 
                srcDoc={html} 
                title="Live Site" 
                sandbox='allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox'
                className='w-full min-h-screen border-0 pt-12'
                style={{ height: '100vh' }}
            />
        </div>
    )
}

export default LiveSite