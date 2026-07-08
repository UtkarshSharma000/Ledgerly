import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, Search, IndianRupee, Phone, MapPin, FileText, Calendar, 
  Camera, Upload, Check, X, ShieldAlert, BadgeCheck, AlertTriangle, 
  ArrowUpRight, ArrowDownLeft, Plus, CheckCircle, Eye, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  profilePhotoUrl: string;
  notes: string;
  amountOwed: number;
  status: string;
  totalUdhaar: number;
  paidAmount: number;
  pendingAmount: number;
  createdAt: string;
  updatedAt: string;
  entriesCount?: number;
  paymentsCount?: number;
}

interface Transaction {
  id: string;
  type: 'udhaar' | 'payment';
  amount: number;
  description: string;
  date: string;
  dueDate?: string;
  photoVerified?: boolean;
  verificationPhotoUrl?: string;
  verifiedAt?: string;
  status?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUdhaarModalOpen, setIsUdhaarModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Selected Customer detail state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [profileHistory, setProfileHistory] = useState<Transaction[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  // Add Customer form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustPhoto, setNewCustPhoto] = useState(''); // Base64
  
  // Take Udhaar form state
  const [udhaarAmount, setUdhaarAmount] = useState('');
  const [udhaarReason, setUdhaarReason] = useState('');
  const [udhaarDueDate, setUdhaarDueDate] = useState('');
  const [udhaarPhoto, setUdhaarPhoto] = useState(''); // Base64
  
  // Record Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Camera states for Add Customer
  const [isCustCamActive, setIsCustCamActive] = useState(false);
  const custVideoRef = useRef<HTMLVideoElement | null>(null);
  const custCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera states for Udhaar Entry
  const [isUdhaarCamActive, setIsUdhaarCamActive] = useState(false);
  const udhaarVideoRef = useRef<HTMLVideoElement | null>(null);
  const udhaarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setLoading(false);
      });
  };

  const fetchCustomerProfile = (id: number) => {
    setProfileLoading(true);
    fetch(`/api/customers/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedCustomer(data.customer);
        setProfileHistory(data.history);
        setProfileLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer profile:', err);
        setProfileLoading(false);
      });
  };

  // --- Add Customer Camera Logic ---
  const startCustCamera = async () => {
    setIsCustCamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (custVideoRef.current) {
        custVideoRef.current.srcObject = stream;
        custVideoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please upload an image or check permissions.');
      setIsCustCamActive(false);
    }
  };

  const stopCustCamera = () => {
    if (custVideoRef.current && custVideoRef.current.srcObject) {
      const stream = custVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      custVideoRef.current.srcObject = null;
    }
    setIsCustCamActive(false);
  };

  const captureCustPhoto = () => {
    if (custVideoRef.current && custCanvasRef.current) {
      const context = custCanvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(custVideoRef.current, 0, 0, 320, 240);
        const base64 = custCanvasRef.current.toDataURL('image/jpeg');
        setNewCustPhoto(base64);
        stopCustCamera();
      }
    }
  };

  const handleCustPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCustPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Take Udhaar Camera Logic ---
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

  // --- Submit Handlers ---
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: newCustName,
      phone: newCustPhone,
      address: newCustAddress,
      notes: newCustNotes,
      profilePhotoUrl: newCustPhoto,
    };

    fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      fetchCustomers();
      setIsAddModalOpen(false);
      resetAddForm();
    })
    .catch(err => console.error('Error adding customer:', err));
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
      fetchCustomers();
      if (selectedCustomer) {
        fetchCustomerProfile(selectedCustomer.id);
      }
      setIsUdhaarModalOpen(false);
      resetUdhaarForm();
    })
    .catch(err => console.error('Error recording udhaar:', err));
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      customerId: selectedCustomer?.id,
      amount: parseFloat(paymentAmount),
      paymentMethod,
      notes: paymentNotes,
    };

    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      fetchCustomers();
      if (selectedCustomer) {
        fetchCustomerProfile(selectedCustomer.id);
      }
      setIsPaymentModalOpen(false);
      resetPaymentForm();
    })
    .catch(err => console.error('Error recording payment:', err));
  };

  // --- Reset Forms ---
  const resetAddForm = () => {
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustNotes('');
    setNewCustPhoto('');
    stopCustCamera();
  };

  const resetUdhaarForm = () => {
    setUdhaarAmount('');
    setUdhaarReason('');
    setUdhaarDueDate('');
    setUdhaarPhoto('');
    stopUdhaarCamera();
  };

  const resetPaymentForm = () => {
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setPaymentNotes('');
  };

  // Filter list
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Customers &amp; Proof System
          </h1>
          <p className="text-slate-500 text-sm">
            Maintain shopkeeper trust profiles, record credit entries with mandatory photo verifications.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers by name or mobile number..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
        />
      </div>

      {/* Grid of Customer Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <UsersIconPlaceholder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No customers found</p>
          <p className="text-slate-400 text-xs mt-1">Get started by clicking "Add Customer" to register your first ledger contact.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => {
            const hasPending = (customer.pendingAmount ?? 0) > 0;
            return (
              <div 
                key={customer.id} 
                className="bg-white rounded-[16px] border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {customer.profilePhotoUrl ? (
                      <img 
                        src={customer.profilePhotoUrl} 
                        alt={customer.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-semibold text-slate-900 text-base truncate">{customer.name}</h3>
                        <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase ${
                          customer.status === 'Good' || customer.status === 'Settled'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : customer.status === 'Warning'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 shrink-0" /> {customer.phone}
                      </p>
                      {customer.address && (
                        <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {customer.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                      <Check className="w-3 h-3 text-emerald-500" /> Phone Saved
                    </span>
                    {customer.address && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                        <Check className="w-3 h-3 text-emerald-500" /> Address Saved
                      </span>
                    )}
                    {customer.profilePhotoUrl && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                        <Check className="w-3 h-3 text-emerald-500" /> Photo Verified
                      </span>
                    )}
                    {((customer.entriesCount ?? 0) > 1) && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                        <BadgeCheck className="w-3 h-3 text-blue-500" /> Repeat Cust ({customer.entriesCount})
                      </span>
                    )}
                  </div>

                  {/* Pending warning */}
                  {hasPending && (
                    <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-lg p-2.5 flex items-start gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Unpaid Udhaar outstanding!</span> Please consider capturing photo verification for secondary entries.
                      </div>
                    </div>
                  )}

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center mb-4">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Total</p>
                      <p className="text-xs font-semibold text-slate-700 flex items-center justify-center">
                        ₹{(customer.totalUdhaar ?? 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Paid</p>
                      <p className="text-xs font-semibold text-emerald-600 flex items-center justify-center">
                        ₹{(customer.paidAmount ?? 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Pending</p>
                      <p className="text-sm font-extrabold text-slate-900 flex items-center justify-center">
                        ₹{(customer.pendingAmount ?? 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setUdhaarAmount('');
                        setUdhaarReason('');
                        setUdhaarPhoto('');
                        setIsUdhaarModalOpen(true);
                      }}
                      className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Take Udhaar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setPaymentAmount('');
                        setPaymentNotes('');
                        setIsPaymentModalOpen(true);
                      }}
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Pay Off
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      fetchCustomerProfile(customer.id);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> View Profile &amp; Audit Logs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODALS SECTION --- */}
      <AnimatePresence>
        {/* ADD CUSTOMER MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900 text-base">Register New Customer</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="p-5 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rakesh Kumar"
                    value={newCustName}
                    onChange={e => setNewCustName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={newCustPhone}
                    onChange={e => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality/Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Gali No. 4, Sector 15"
                    value={newCustAddress}
                    onChange={e => setNewCustAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo</label>
                  
                  {/* Photo selection interface */}
                  <div className="mt-2 space-y-3">
                    {newCustPhoto ? (
                      <div className="relative w-32 h-32 mx-auto border-2 border-primary-500 rounded-lg overflow-hidden group">
                        <img src={newCustPhoto} className="w-full h-full object-cover" alt="Captured" />
                        <button
                          type="button"
                          onClick={() => setNewCustPhoto('')}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : isCustCamActive ? (
                      <div className="space-y-2">
                        <video ref={custVideoRef} className="w-full max-h-48 bg-black rounded-lg" playsInline muted />
                        <button
                          type="button"
                          onClick={captureCustPhoto}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Camera className="w-4 h-4" /> Capture Snapshot
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={startCustCamera}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-slate-500" /> Use Camera
                        </button>
                        <label className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-slate-500" /> Upload Photo
                          <input type="file" accept="image/*" onChange={handleCustPhotoUpload} className="hidden" />
                        </label>
                      </div>
                    )}
                    <canvas ref={custCanvasRef} width={320} height={240} className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profile Notes</label>
                  <textarea
                    placeholder="Special credit limits, reference, etc."
                    rows={2}
                    value={newCustNotes}
                    onChange={e => setNewCustNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  Save Customer Details
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* TAKE UDHAAR ENTRY MODAL */}
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
                        <Check className="w-3.5 h-3.5" /> Photo Verified ✅
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
                  {!udhaarPhoto ? 'Capture Photo Verification First' : 'Authorize &amp; Save Udhaar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* RECORD PAYMENT MODAL */}
        {isPaymentModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900 text-base">Record Payment - {selectedCustomer.name}</h3>
                <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSavePayment} className="p-5 overflow-y-auto space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Pending Udhaar Balance:</span>
                  <span className="font-bold text-slate-900 text-base">
                    ₹{(selectedCustomer.pendingAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount Received (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      required
                      min="1"
                      max={selectedCustomer.pendingAmount || 9999999}
                      step="0.01"
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Cash">Cash 💵</option>
                    <option value="UPI">UPI / Paytm / GPay 📱</option>
                    <option value="Card">Card 💳</option>
                    <option value="Bank Transfer">Bank Transfer 🏦</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Notes / Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Handed cash at counter"
                    value={paymentNotes}
                    onChange={e => setPaymentNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Confirm &amp; Record Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* DETAILED CUSTOMER PROFILE & AUDIT LOGS MODAL */}
        {isProfileModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Customer Ledger Profile</h3>
                  <p className="text-[11px] text-slate-500">Security profile and historical financial logs</p>
                </div>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Visual Header */}
                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                    {selectedCustomer.profilePhotoUrl ? (
                      <img 
                        src={selectedCustomer.profilePhotoUrl} 
                        alt={selectedCustomer.name} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md shrink-0">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h4 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h4>
                        <span className={`inline-block self-center sm:self-auto px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase ${
                          selectedCustomer.status === 'Good' || selectedCustomer.status === 'Settled'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : selectedCustomer.status === 'Warning'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {selectedCustomer.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                        <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" /> {selectedCustomer.phone}
                        </p>
                        {selectedCustomer.address && (
                          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {selectedCustomer.address}
                          </p>
                        )}
                        <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" /> Registered:{' '}
                          {new Date(selectedCustomer.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {selectedCustomer.notes && (
                        <div className="mt-3 text-xs bg-white border border-slate-150 p-2.5 rounded-lg text-slate-600 flex gap-1.5 items-start">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="italic">"{selectedCustomer.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trust Rating Dashboard & Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Total Udhaar Advanced</span>
                      <span className="text-xl font-extrabold text-slate-800">
                        ₹{profileHistory.filter(h => h.type === 'udhaar').reduce((s, h) => s + h.amount, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                      <span className="text-[10px] uppercase text-emerald-500 font-bold block mb-1">Total Paid Amount</span>
                      <span className="text-xl font-extrabold text-emerald-600">
                        ₹{profileHistory.filter(h => h.type === 'payment').reduce((s, h) => s + h.amount, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-900 text-white rounded-xl p-4 text-center">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Net Pending Balance</span>
                      <span className="text-xl font-extrabold flex items-center justify-center text-primary-300">
                        <IndianRupee className="w-4 h-4 text-primary-300 mr-0.5" />
                        {(selectedCustomer.amountOwed ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Transactions Audit Trail */}
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm mb-3">Verification History &amp; Audit Trail</h5>
                    {profileHistory.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-250 rounded-xl">
                        No transactions registered in audit database.
                      </p>
                    ) : (
                      <div className="space-y-3.5">
                        {profileHistory.map(trx => (
                          <div 
                            key={trx.id}
                            className={`border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                              trx.type === 'udhaar' ? 'border-amber-100 bg-amber-50/20' : 'border-emerald-100 bg-emerald-50/20'
                            }`}
                          >
                            <div className="flex gap-3 items-start">
                              {trx.type === 'udhaar' ? (
                                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                                  <ArrowUpRight className="w-4.5 h-4.5" />
                                </div>
                              ) : (
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                  <ArrowDownLeft className="w-4.5 h-4.5" />
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-slate-800 text-sm block">
                                  {trx.description}
                                </span>
                                <span className="text-[11px] text-slate-500 block">
                                  {new Date(trx.date).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {trx.type === 'udhaar' && (
                                  <div className="mt-1.5 flex items-center gap-1.5">
                                    {trx.photoVerified ? (
                                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Photo Verified ✅
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                                        No Image Attached
                                      </span>
                                    )}
                                    {trx.dueDate && (
                                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                        Due: {new Date(trx.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Verification Snapshot Viewer (if available) */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              {trx.type === 'udhaar' && trx.verificationPhotoUrl && (
                                <div className="relative group">
                                  <img 
                                    src={trx.verificationPhotoUrl} 
                                    alt="Authorized Proof"
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity cursor-pointer">
                                    <Eye 
                                      className="w-4 h-4 text-white" 
                                      onClick={() => {
                                        // Simple modal-inside-modal zoom alert or let browser handle click
                                        const win = window.open();
                                        if (win && trx.verificationPhotoUrl) {
                                          win.document.write(`<img src="${trx.verificationPhotoUrl}" style="max-width:100%; height:auto; display:block; margin:auto;"/>`);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-right shrink-0">
                                <span className={`text-base font-extrabold block ${
                                  trx.type === 'udhaar' ? 'text-slate-800' : 'text-emerald-600'
                                }`}>
                                  {trx.type === 'udhaar' ? '+' : '-'} ₹{trx.amount.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple fallback user placeholder
function UsersIconPlaceholder({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A12.018 12.018 0 0 1 12 21c-2.224 0-4.26-.6-5.972-1.643v-.109m0-5.67c.184.29.39.566.614.828M4.875 19.128a9.337 9.337 0 0 1-.786-3.07V19a4.125 4.125 0 0 1-7.533-2.493m11.362-2.163c-.5-.91-.786-1.957-.786-3.07a3.375 3.375 0 0 1-6.75 0c0 1.113-.286 2.16-.786 3.07m12.018 3.513c-.495-.494-1.077-.893-1.725-1.185M2.25 12a10.125 10.125 0 0 1 20.25 0H2.25Z" />
    </svg>
  );
}
