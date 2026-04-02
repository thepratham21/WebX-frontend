import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import Editor from '@monaco-editor/react';

const WebsiteEditor = () => {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const iframeRef = useRef(null)

    const thinkingSteps = [
        "Understanding your request...",
        "Planning for changes...",
        "Improving responsiveness...",
        "Applying changes...",
        "Reviewing code...",
        "Modifying code...",
        "Verifying changes...",
        "Finalizing updates..."
    ]

    const handleUpdate = async () => {
        if (!prompt) return
        setUpdateLoading(true)
        const text = prompt;
        setPrompt("")
        setMessages((m) => [...m, { role: 'user', content: prompt }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true })
            console.log(result)
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
            setUpdateLoading(false)
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
            window.open(`${result.data.url}`, '_blank')
            console.log(result.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!updateLoading) return;
        const i = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/id/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Failed to load website")
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url;
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4'>
                    <p className='text-red-400 text-sm'>{error}</p>
                </div>
            </div>
        )
    }

    if (!website) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                    <p className='text-gray-400 text-sm'>Loading website...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex h-screen bg-black overflow-hidden'>
            {/* Sidebar - Chat Section */}
            <aside className='w-96 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-sm'>
                {/* Header */}
                <div className='p-4 border-b border-white/10'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-bold tracking-tight text-white'>
                            {website.title}
                        </h2>
                        <button 
                            onClick={() => window.history.back()}
                            className='text-gray-500 hover:text-white transition-colors'
                        >
                            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>AI Assistant</p>
                </div>

                {/* Messages Container */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {messages?.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`
                                    max-w-[85%] rounded-lg px-4 py-2 text-sm
                                    ${m.role === "user" 
                                        ? 'bg-white text-black' 
                                        : 'bg-white/5 border border-white/10 text-gray-300'
                                    }
                                `}
                            >
                                {m.content}
                            </div>
                        </motion.div>
                    ))}

                    {updateLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='flex justify-start'
                        >
                            <div className='max-w-[85%] bg-white/5 border border-white/10 rounded-lg px-4 py-2'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                                    <span className='text-sm text-gray-400'>{thinkingSteps[thinkingIndex]}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className='p-4 border-t border-white/10'>
                    <div className='flex gap-2'>
                        <textarea
                            rows="2"
                            placeholder="Describe changes you want to make..."
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            className='flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none text-white placeholder-gray-500 text-sm'
                        />
                        <button
                            onClick={handleUpdate}
                            disabled={!prompt.trim() || updateLoading}
                            className={`
                                px-4 py-2 rounded-lg transition-colors self-end
                                ${!prompt.trim() || updateLoading
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-gray-100'
                                }
                            `}
                        >
                            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Preview Section */}
            <div className='flex-1 flex flex-col'>
                {/* Toolbar */}
                <div className='border-b border-white/10 bg-black/50 backdrop-blur-sm px-4 py-2 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-300'>Live Preview</span>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex gap-2'>
                        {website.deployed ? (
                            <span className='px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/20'>
                                Deployed
                            </span>
                        ) : (
                            <button
                                onClick={handleDeploy}
                                className='px-3 py-1 text-xs bg-white text-black rounded-full hover:bg-gray-100 transition-colors'
                            >
                                Deploy
                            </button>
                        )}
                        <button
                            onClick={() => setShowCode(true)}
                            className='px-3 py-1 text-xs border border-white/20 text-gray-300 rounded-full hover:bg-white/5 transition-colors'
                        >
                            Code
                        </button>
                        <button
                            onClick={() => setShowFullPreview(true)}
                            className='px-3 py-1 text-xs border border-white/20 text-gray-300 rounded-full hover:bg-white/5 transition-colors'
                        >
                            Full Screen
                        </button>
                    </div>
                </div>

                {/* Iframe Preview */}
                <iframe
                    ref={iframeRef}
                    className="flex-1 w-full bg-white"
                    sandbox='allow-scripts allow-same-origin allow-forms'
                    title="Website Preview"
                />
            </div>

            {/* Code Editor Modal */}
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4'
                        onClick={() => setShowCode(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className='w-full max-w-5xl h-[90vh] bg-black rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='flex justify-between items-center p-4 border-b border-white/10'>
                                <div>
                                    <h3 className='text-lg font-bold tracking-tight text-white'>index.html</h3>
                                    <p className='text-xs text-gray-500'>Edit your website code</p>
                                </div>
                                <button
                                    onClick={() => setShowCode(false)}
                                    className='text-gray-500 hover:text-white transition-colors'
                                >
                                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className='flex-1'>
                                <Editor
                                    height="100%"
                                    defaultLanguage="html"
                                    value={code}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        automaticLayout: true,
                                    }}
                                    onChange={(v) => setCode(v || "")}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Preview Modal */}
            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 bg-black flex flex-col'
                    >
                        <div className='bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center'>
                            <h3 className='text-lg font-bold tracking-tight text-white'>Full Screen Preview</h3>
                            <button
                                onClick={() => setShowFullPreview(false)}
                                className='px-4 py-2 bg-white text-black text-sm rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                Close Preview
                            </button>
                        </div>
                        <iframe
                            srcDoc={code}
                            className='flex-1 w-full'
                            sandbox='allow-scripts allow-same-origin allow-forms'
                            title="Full Screen Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default WebsiteEditor