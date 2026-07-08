import React, { useState, useEffect, useRef } from 'react';
import { Search, IndianRupee, BellRing, UserPlus, X, CheckCircle, AlertCircle, PhoneCall, Camera, Upload, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Udhaar() {
  const [udhaar, setUdhaar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', amountOwed: '' });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Take Udhaar form state
  const [isUdhaarModalOpen, setIsUdhaarModalOpen] = useState(false);
  const [udhaarAmount, setUdhaarAmount] = useState('');
  const [udhaarReason, setUdhaarReason] = useState('');
  const [udhaarDueDate, setUdhaarDueDate] = useState('');
  const [udhaarPhoto, setUdhaarPhoto] = useState(''); // Base64
  
  // Camera states
  const [isUdhaarCamActive, setIsUdhaarCamActive] = useState(false);
  const udhaarVideoRef = useRef<HTMLVideoElement | null>(null);
  const udhaarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mobile number verification states
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const fetchUdhaar = () => {
    fetch('/api/udhaar')
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(d => {
        if (Array.isArray(d)) {
          setUdhaar(d);
        } else {
          setUdhaar([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setUdhaar([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUdhaar();
  }, []);

  const openCustomerModal = () => {
    setIsPhoneVerified(false);
    setIsSendingOtp(false);
    setShowOtpInput(false);
    setOtpCode('');
    setOtpError('');
    setOtpSentMessage('');
    setIsCustomerModalOpen(true);
  };

  const handleSendOtp = () => {
    if (!newCustomer.phone || newCustomer.phone.trim().length < 10) {
      setOtpError('Please enter a valid mobile number (at least 10 digits)');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    setOtpSentMessage('');
    
    setTimeout(() => {
      setIsSendingOtp(false);
      setShowOtpInput(true);
      setOtpSentMessage(`Verification OTP "1234" sent to ${newCustomer.phone}!`);
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234') {
      setIsPhoneVerified(true);
      setShowOtpInput(false);
      setOtpError('');
      setOtpSentMessage('');
    } else {
      setOtpError('Invalid OTP! Please enter "1234" for simulation.');
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      setOtpError('Mobile number verification is required to add a customer!');
      return;
    }
    fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newCustomer.name, 
        phone: newCustomer.phone, 
        amountOwed: parseFloat(newCustomer.amountOwed) || 0, 
        status: 'Unpaid', 
        lastPurchase: new Date().toISOString(),
        lastPayment: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => {
      setUdhaar([...udhaar, data]);
      setIsCustomerModalOpen(false);
      setNewCustomer({ name: '', phone: '', amountOwed: '' });
    });
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/udhaar/${selectedCustomer.id}/payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentAmount: parseFloat(paymentAmount) })
    })
    .then(res => res.json())
    .then(() => {
      fetchUdhaar();
      setIsPaymentModalOpen(false);
      setSelectedCustomer(null);
      setPaymentAmount('');
    });
  };

  const startUdhaarCamera = async () => {
    setIsUdhaarCamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (udhaarVideoRef.current) {
        udhaarVideoRef.current.srcObject = stream;
        udhaarVideoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please upload an image or check permissions.');
      setIsUdhaarCamActive(false);
    }
  };

  const stopUdhaarCamera = () => {
    if (udhaarVideoRef.current && udhaarVideoRef.current.srcObject) {
      const stream = udhaarVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      udhaarVideoRef.current.srcObject = null;
    }
    setIsUdhaarCamActive(false);
  };

  const captureUdhaarPhoto = () => {
    if (udhaarVideoRef.current && udhaarCanvasRef.current) {
      const context = udhaarCanvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(udhaarVideoRef.current, 0, 0, 320, 240);
        const base64 = udhaarCanvasRef.current.toDataURL('image/jpeg');
        setUdhaarPhoto(base64);
        stopUdhaarCamera();
      }
    }
  };

  const handleUdhaarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUdhaarPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUdhaar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!udhaarPhoto) {
      alert('Mandatory Requirement: You must capture or upload customer verification photo for every new Udhaar entry!');
      return;
    }

    const payload = {
      customerId: selectedCustomer?.id,
      amount: parseFloat(udhaarAmount),
      reason: udhaarReason,
      dueDate: udhaarDueDate || null,
      verificationPhotoUrl: udhaarPhoto,
    };

    fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      fetchUdhaar();
      setIsUdhaarModalOpen(false);
      resetUdhaarForm();
    })
    .catch(err => console.error('Error recording udhaar:', err));
  };

  const resetUdhaarForm = () => {
    setUdhaarAmount('');
    setUdhaarReason('');
    setUdhaarDueDate('');
    setUdhaarPhoto('');
    stopUdhaarCamera();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unpaid': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Good': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">New Customer</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name</label>
                  <input required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <div className="flex gap-2">
                    <input 
                      required 
                      disabled={isPhoneVerified}
                      value={newCustomer.phone} 
                      onChange={e => {
                        setNewCustomer({...newCustomer, phone: e.target.value});
                        if (isPhoneVerified) setIsPhoneVerified(false);
                      }} 
                      type="tel" 
                      placeholder="e.g. 9876543210"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500" 
                    />
                    {!isPhoneVerified ? (
                      <button
                        type="button"
                        disabled={isSendingOtp || !newCustomer.phone || newCustomer.phone.trim().length < 10}
                        onClick={handleSendOtp}
                        className="px-3 py-2 bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        {isSendingOtp ? 'Sending...' : 'Send OTP'}
                      </button>
                    ) : (
                      <span className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {otpSentMessage && (
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 p-2.5 rounded-lg text-xs flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p>{otpSentMessage}</p>
                  </div>
                )}

                {showOtpInput && !isPhoneVerified && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
                    <label className="block text-xs font-semibold text-slate-700">Enter Verification OTP (Type 1234)</label>
                    <div className="flex gap-2">
                      <input 
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="XXXX"
                        maxLength={4}
                        type="text"
                        className="w-24 px-3 py-1.5 text-center border border-slate-200 rounded-lg text-sm font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}

                {otpError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2.5 rounded-lg text-xs flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p>{otpError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Initial Udhaar Amount (₹)</label>
                  <input required min="0" step="0.01" value={newCustomer.amountOwed} onChange={e => setNewCustomer({...newCustomer, amountOwed: e.target.value})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={!isPhoneVerified}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {!isPhoneVerified ? 'Verify Mobile Number First' : 'Add Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isPaymentModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">Record Payment - {selectedCustomer.name}</h3>
                <button onClick={() => { setIsPaymentModalOpen(false); setSelectedCustomer(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
                <div>
                   <p className="text-sm text-slate-600 mb-4">Pending Udhaar: <strong className="text-slate-900 font-semibold text-lg">₹{(selectedCustomer?.amountOwed ?? 0).toLocaleString('en-IN')}</strong></p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Amount (₹)</label>
                  <input required min="0" max={selectedCustomer.amountOwed} step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Save Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isUdhaarModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Record Udhaar for {selectedCustomer.name}</h3>
                  <p className="text-[11px] text-slate-500">MANDATORY photo verification ledger event</p>
                </div>
                <button onClick={() => { setIsUdhaarModalOpen(false); stopUdhaarCamera(); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveUdhaar} className="p-5 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Udhaar Amount (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      placeholder="0.00"
                      value={udhaarAmount}
                      onChange={e => setUdhaarAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Purchase Items *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Flour bag, sugar 2kg, oil"
                    value={udhaarReason}
                    onChange={e => setUdhaarReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={udhaarDueDate}
                    onChange={e => setUdhaarDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {/* Proof Snapshot Requirement */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="block text-xs font-bold text-slate-800 mb-1">
                    Customer Verification Snapshot *
                  </span>
                  <span className="block text-[11px] text-slate-400 mb-3">
                    A fresh photo is required to authorize this unique credit transaction.
                  </span>

                  {udhaarPhoto ? (
                    <div className="relative w-full max-h-48 border-2 border-emerald-500 rounded-lg overflow-hidden">
                      <img src={udhaarPhoto} className="w-full h-48 object-cover" alt="Verification proof" />
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> Photo Verified ✅
                      </div>
                      <button
                        type="button"
                        onClick={() => setUdhaarPhoto('')}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-take Photo
                      </button>
                    </div>
                  ) : isUdhaarCamActive ? (
                    <div className="space-y-2">
                      <video ref={udhaarVideoRef} className="w-full h-48 bg-black rounded-lg object-cover" playsInline muted />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={captureUdhaarPhoto}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Camera className="w-4 h-4" /> Take Snap
                        </button>
                        <button
                          type="button"
                          onClick={stopUdhaarCamera}
                          className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded-lg font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={startUdhaarCamera}
                        className="px-3 py-3 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-1.5 justify-center transition-colors"
                      >
                        <Camera className="w-5 h-5 text-slate-500" />
                        Use Camera
                      </button>
                      <label className="px-3 py-3 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex flex-col items-center gap-1.5 justify-center cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 text-slate-500" />
                        Upload Verification File
                        <input type="file" accept="image/*" onChange={handleUdhaarPhotoUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                  <canvas ref={udhaarCanvasRef} width={320} height={240} className="hidden" />
                </div>

                <button
                  type="submit"
                  disabled={!udhaarPhoto}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  {!udhaarPhoto ? 'Capture Photo Verification First' : 'Authorize & Save Udhaar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Udhaar (Customer Credit)</h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage outstanding balances and send reminders.</p>
        </div>
        <motion.button 
          onClick={openCustomerModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-[13px]"
        >
          <UserPlus className="w-4 h-4" /> New Customer
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers by name or phone..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : udhaar.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.phone && c.phone.includes(searchQuery))
        ).map(customer => (
          <div key={customer.id} className="bg-white p-4 rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-[14px]">{customer.name}</h3>
                  <p className="text-[12px] text-slate-500">{customer.phone}</p>
                </div>
                <span className={`px-2 py-0.5 border rounded-[4px] text-[10px] font-semibold tracking-wider uppercase ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Outstanding Balance</p>
                <div className="text-[24px] font-bold text-slate-900 flex items-center">
                  <IndianRupee className="w-5 h-5 text-slate-400 mr-1" />
                  {(customer.amountOwed ?? 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Last Purchase</p>
                  <p className="font-medium text-slate-900">{customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Last Payment</p>
                  <p className="font-medium text-slate-900">{customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-5 pt-5 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { 
                    setSelectedCustomer(customer); 
                    setUdhaarAmount('');
                    setUdhaarReason('');
                    setUdhaarPhoto('');
                    setIsUdhaarModalOpen(true); 
                  }} 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Take Udhaar
                </button>
                <button onClick={() => { setSelectedCustomer(customer); setIsPaymentModalOpen(true); }} className="bg-white border border-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-xs">
                  Record Payment
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-semibold py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-xs">
                <BellRing className="w-3.5 h-3.5 text-blue-500" /> Send Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
