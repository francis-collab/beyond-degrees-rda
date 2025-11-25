// src/components/PaymentModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
  Loader2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/lib/api';
import { Project } from '@/lib/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  defaultMethod?: 'momo' | 'stripe' | null;
}

type PaymentMethod = 'momo' | 'card' | 'bank';

function PaymentModalContent({ 
  project, 
  onClose, 
  defaultMethod 
}: { 
  project: Project; 
  onClose: () => void;
  defaultMethod?: 'momo' | 'stripe' | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [method, setMethod] = useState<PaymentMethod>('momo');
  const [amount, setAmount] = useState(25000);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto-select method when defaultMethod changes
  useEffect(() => {
    if (defaultMethod === 'momo') setMethod('momo');
    if (defaultMethod === 'stripe') setMethod('card');
  }, [defaultMethod]);

  const handleSubmit = async () => {
    if (amount < 1000) return setError('Minimum is RWF 1,000');
    setIsSubmitting(true);
    setError('');

    try {
      if (method === 'momo') {
        const cleanPhone = phone.replace(/\s/g, '');
        if (!/^\+2507[238]0\d{7}$/.test(cleanPhone)) {
          setError('Valid Rwanda number required (+25078..., +25073..., +25072...)');
          setIsSubmitting(false);
          return;
        }
        await api.post('/api/v1/transactions/', {
          project_id: project.id,
          amount,
          payment_method: 'momo',
          phone: cleanPhone,
        });
      }
      else if (method === 'card') {
        if (!stripe || !elements) return;
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error: stripeError, paymentMethod: stripePm } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (stripeError) {
          setError(stripeError.message || 'Card declined');
          setIsSubmitting(false);
          return;
        }

        await api.post('/api/v1/transactions/', {
          project_id: project.id,
          amount,
          payment_method: 'card',
          stripe_payment_method_id: stripePm?.id,
        });
      }
      else if (method === 'bank') {
        await api.post('/api/v1/transactions/', {
          project_id: project.id,
          amount,
          payment_method: 'bank',
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setAmount(25000);
        setPhone('');
      }, 4000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'momo', name: 'MTN MoMo', icon: Smartphone, color: 'bg-[#FCD116]', desc: 'Instant via phone' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-[#00A1D6]', desc: 'Visa • Mastercard • Amex' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, color: 'bg-[#00A651]', desc: 'Large amounts' },
  ] as const;

  return (
    <AnimatePresence>
      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-[#00A1D6] to-[#00A651] z-50 flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-16 text-center shadow-3xl"
          >
            <CheckCircle className="w-32 h-32 text-green-600 mx-auto mb-8" />
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Murakoze Cyane!</h2>
            <p className="text-2xl text-gray-700">
              {method === 'momo' && 'Check your phone to confirm MoMo payment'}
              {method === 'card' && 'Your card payment was successful!'}
              {method === 'bank' && 'Bank transfer instructions sent to your email'}
            </p>
            <p className="text-xl text-[#00A1D6] font-bold mt-6">
              You just created hope in Rwanda.
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">
                    Support <span className="text-[#00A1D6]">{project.title}</span>
                  </h2>
                  <p className="text-gray-600 mt-3 text-lg">
                    Every <strong>RWF 200,000 = 1 job</strong> for Rwandan youth
                  </p>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition">
                  <X className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* Payment Methods */}
              <div>
                <h3 className="font-bold text-xl mb-5">Choose Payment Method</h3>
                <div className="grid gap-4">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = (pm.id === 'momo' && method === 'momo') || 
                                      (pm.id === 'card' && method === 'card') || 
                                      (pm.id === 'bank' && method === 'bank');
                    return (
                      <motion.button
                        key={pm.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMethod(pm.id === 'card' ? 'card' : pm.id as PaymentMethod)}
                        className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-[#00A1D6] bg-[#00A1D6]/5 shadow-xl'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 ${pm.color} rounded-2xl flex items-center justify-center`}>
                            <Icon className="w-9 h-9 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-lg">{pm.name}</p>
                            <p className="text-gray-600 text-sm">{pm.desc}</p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-8 h-8 text-[#00A1D6]" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div>
                <h3 className="font-bold text-xl mb-5">Amount (RWF)</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[10000, 50000, 100000].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`py-4 rounded-2xl font-bold transition-all ${
                        amount === a ? 'bg-[#00A1D6] text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:border-[#00A1D6] outline-none transition"
                  placeholder="Enter custom amount"
                />
              </div>

              {/* MoMo Phone */}
              {method === 'momo' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block font-bold text-xl mb-3">MTN MoMo Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 780 000 000"
                    className="w-full px-6 py-5 border-2 border-[#FCD116] rounded-2xl text-xl focus:outline-none focus:border-orange-600 transition"
                    autoFocus
                  />
                </motion.div>
              )}

              {/* Stripe Card */}
              {method === 'card' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <label className="block font-bold text-xl">Card Details</label>
                  <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '18px',
                            color: '#1f2937',
                            '::placeholder': { color: '#9ca3af' },
                          },
                        },
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Bank Info */}
              {method === 'bank' && (
                <motion.div className="bg-gradient-to-r from-[#00A651]/10 to-[#004C99]/10 rounded-3xl p-10 text-center">
                  <Building className="w-20 h-20 text-[#00A651] mx-auto mb-6" />
                  <p className="text-2xl font-bold text-gray-800">Bank Transfer</p>
                  <p className="text-lg text-gray-700 mt-3">Instructions will be sent to your email</p>
                  <p className="text-sm text-gray-600 mt-4">Reference: <strong>BDR-{project.id}</strong></p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="p-5 bg-red-50 border-2 border-red-300 rounded-2xl flex gap-3 items-start">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (method === 'momo' && !phone.trim())}
                className="w-full py-7 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white text-3xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay RWF {amount.toLocaleString()}
                    <ChevronRight className="w-10 h-10" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PaymentModal({ project, isOpen, onClose, defaultMethod }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <PaymentModalContent 
        project={project} 
        onClose={onClose} 
        defaultMethod={defaultMethod || undefined}
      />
    </Elements>
  );
}