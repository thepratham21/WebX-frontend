import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../utils/constants'
import { CreditCard, Shield, Zap, Check, Loader2 } from 'lucide-react'

const Pricing = () => {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [loadingPlan, setLoadingPlan] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const plans = [
        {
            key: "free",
            name: "Free",
            price: "₹0",
            credits: 100,
            description: "Ideal for individuals and small projects",
            features: [
                "AI website generator",
                "Responsive design",
                "Basic templates",
                "1 website",
            ],
            popular: false,
            button: "Get Started",
            icon: Shield
        },
        {
            key: "pro",
            name: "Pro",
            price: "₹499",
            credits: 500,
            description: "Perfect for freelancers",
            features: [
                "Everything in free",
                "Faster generation",
                "Edit and regenerate",
                "5 websites",
                "Priority support",
            ],
            popular: true,
            button: "Upgrade to Pro",
            icon: Zap
        },
        {
            key: "enterprise",
            name: "Enterprise",
            price: "₹1499",
            credits: 1000,
            description: "Tailored for teams and power users",
            features: [
                "Everything in Pro",
                "Dedicated support",
                "Custom branding",
                "Unlimited websites",
                "API access",
            ],
            popular: false,
            button: "Contact Sales",
            icon: CreditCard
        }
    ]

    // Load Razorpay script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    const handlePayment = async (plan) => {
        if (plan.key === "free") {
            navigate('/generate')
            return
        }

        if (plan.key === "enterprise") {
            window.location.href = "mailto:sales@webx.com"
            return
        }

        setLoadingPlan(plan.key)
        setError(null)

        try {
            // 1. Create order
            const orderResponse = await axios.post(
                `${serverUrl}/api/payment/create-order`,
                { plan: plan.key },
                { withCredentials: true }
            )

            const { order, amount } = orderResponse.data

            if (!order || !order.id) {
                throw new Error("Failed to create order")
            }

            // 2. Load Razorpay script
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) {
                throw new Error("Failed to load Razorpay. Please check your internet connection.")
            }

            // 3. Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "WebX",
                description: `Upgrade to ${plan.name} Plan`,
                image: "/logo.png", // Add your logo path
                order_id: order.id,
                handler: async (response) => {
                    // 4. Verify payment
                    try {
                        const verifyResponse = await axios.post(
                            `${serverUrl}/api/payment/verify-payment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan: plan.key,
                            },
                            { withCredentials: true }
                        )

                        if (verifyResponse.data.success) {
                            setSuccess(`Successfully upgraded to ${plan.name} plan! Credits added to your account.`)
                            setLoadingPlan(null)
                            
                            // Refresh user data after successful payment
                            setTimeout(() => {
                                window.location.reload()
                            }, 2000)
                        } else {
                            throw new Error("Payment verification failed")
                        }
                    } catch (err) {
                        console.error("Verification error:", err)
                        setError("Payment verification failed. Please contact support.")
                        setLoadingPlan(null)
                    }
                },
                prefill: {
                    name: userData?.name || "",
                    email: userData?.email || "",
                },
                theme: {
                    color: "#000000",
                },
                modal: {
                    ondismiss: () => {
                        setLoadingPlan(null)
                        setError("Payment cancelled")
                    }
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()

        } catch (err) {
            console.error("Payment error:", err)
            setError(err.response?.data?.message || err.message || "Payment failed. Please try again.")
            setLoadingPlan(null)
        }
    }

    return (
        <div className='min-h-screen bg-black'>
            {/* Header with Back Button */}
            <div className='border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-10'>
                <div className='max-w-7xl mx-auto px-6 py-4'>
                    <button
                        onClick={() => navigate("/")}
                        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
                    >
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className='text-sm'>Back to Home</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center max-w-3xl mx-auto px-6 py-16'
            >
                <h1 className='text-5xl md:text-6xl font-bold tracking-tight text-white mb-4'>
                    Simple, transparent pricing
                </h1>
                <p className='text-lg text-gray-400'>
                    Select the perfect plan for your requirements and start building amazing websites with WebX.
                </p>
            </motion.div>

            {/* Success/Error Messages */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='max-w-7xl mx-auto px-6 mb-8'
                    >
                        <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center'>
                            <p className='text-green-400 text-sm'>{success}</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='max-w-7xl mx-auto px-6 mb-8'
                    >
                        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center'>
                            <p className='text-red-400 text-sm'>{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pricing Cards Grid */}
            <div className='max-w-7xl mx-auto px-6 pb-20'>
                <div className='grid md:grid-cols-3 gap-8 items-stretch'>
                    {plans.map((plan, i) => {
                        const Icon = plan.icon
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className={`
                                    relative bg-white/5 backdrop-blur-sm rounded-2xl border transition-all duration-300
                                    ${plan.popular 
                                        ? 'border-white/30 shadow-2xl shadow-white/5' 
                                        : 'border-white/10 hover:border-white/20'
                                    }
                                `}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                                        <span className='px-3 py-1 bg-white text-black text-xs rounded-full font-medium'>
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className='p-6'>
                                    {/* Icon */}
                                    <div className={`inline-flex p-3 rounded-xl bg-linear-to-r from-white/10 to-white/5 mb-4`}>
                                        <Icon className='w-6 h-6 text-white' />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className='text-xl font-bold text-white mb-2'>
                                        {plan.name}
                                    </h3>
                                    <p className='text-sm text-gray-400 mb-6'>
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className='mb-6 pb-6 border-b border-white/10'>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-4xl font-bold text-white'>{plan.price}</span>
                                            {plan.price !== "₹0" && (
                                                <span className='text-sm text-gray-500'>/month</span>
                                            )}
                                        </div>
                                        <p className='text-sm text-gray-500 mt-2'>
                                            {plan.credits} credits included
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <ul className='space-y-3 mb-8'>
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className='flex items-start gap-2'>
                                                <Check className='w-5 h-5 text-white shrink-0 mt-0.5' />
                                                <span className='text-sm text-gray-300'>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handlePayment(plan)}
                                        disabled={loadingPlan === plan.key}
                                        className={`
                                            w-full py-2.5 rounded-lg font-medium transition-all relative
                                            ${loadingPlan === plan.key ? 'opacity-70 cursor-not-allowed' : ''}
                                            ${plan.popular
                                                ? 'bg-white text-black hover:bg-gray-100'
                                                : plan.key === "free"
                                                    ? 'border border-white/20 text-white hover:bg-white/5'
                                                    : 'border border-white/20 text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {loadingPlan === plan.key ? (
                                            <div className='flex items-center justify-center gap-2'>
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            plan.button
                                        )}
                                    </button>

                                    {/* Additional Info for Pro Plan */}
                                    {plan.key === "pro" && (
                                        <p className='text-xs text-gray-500 text-center mt-3'>
                                            One-time payment. No recurring charges.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* FAQ Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='border-t border-white/10 bg-black/30'
            >
                <div className='max-w-4xl mx-auto px-6 py-16'>
                    <h2 className='text-2xl font-bold tracking-tight text-white text-center mb-12'>
                        Frequently Asked Questions
                    </h2>
                    <div className='space-y-6'>
                        <div className='bg-white/5 rounded-lg p-6 border border-white/10'>
                            <h3 className='font-semibold text-white mb-2'>How does the credit system work?</h3>
                            <p className='text-gray-400 text-sm'>Each website generation uses 25 credit. You can generate multiple versions of your website until you're satisfied.</p>
                        </div>
                        <div className='bg-white/5 rounded-lg p-6 border border-white/10'>
                            <h3 className='font-semibold text-white mb-2'>Can I upgrade my plan later?</h3>
                            <p className='text-gray-400 text-sm'>Yes! You can upgrade from Free to Pro or Enterprise at any time. The credits will be added to your account instantly.</p>
                        </div>
                        <div className='bg-white/5 rounded-lg p-6 border border-white/10'>
                            <h3 className='font-semibold text-white mb-2'>What payment methods do you accept?</h3>
                            <p className='text-gray-400 text-sm'>We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.</p>
                        </div>
                        <div className='bg-white/5 rounded-lg p-6 border border-white/10'>
                            <h3 className='font-semibold text-white mb-2'>Is there a refund policy?</h3>
                            <p className='text-gray-400 text-sm'>We offer a 7-day money-back guarantee for Pro and Enterprise plans. Contact support for assistance.</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Custom Plan Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='border-t border-white/10'
            >
                <div className='max-w-4xl mx-auto px-6 py-16 text-center'>
                    <h2 className='text-2xl font-bold tracking-tight text-white mb-4'>
                        Need a custom plan?
                    </h2>
                    <p className='text-gray-400 mb-6'>
                        Contact us for enterprise solutions with custom pricing and dedicated support.
                    </p>
                    <button
                        onClick={() => window.location.href = "mailto:sales@webx.com"}
                        className='px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors'
                    >
                        Contact Sales
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Pricing