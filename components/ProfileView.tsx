
import React, { useState } from 'react';
import { User, InfraReport, WithdrawalRequest } from '../types';

interface ProfileViewProps {
  user: User | null;
  reports: InfraReport[];
  onRedeem: (request: Omit<WithdrawalRequest, 'id' | 'userEmail' | 'status' | 'timestamp'>) => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, reports, onRedeem, onLogout }) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<number>(user?.credits || 0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !ifscCode || !accountNumber || amount <= 0) return;
    if (amount > (user?.credits || 0)) {
        alert("Insufficient balance!");
        return;
    }

    onRedeem({
      bankName,
      ifscCode,
      accountNumber,
      amount
    });

    setSuccessMessage(`Withdrawal of ₹${amount} requested.`);
    setShowRedeemModal(false);
    
    setBankName('');
    setIfscCode('');
    setAccountNumber('');
    
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="chat-container-max py-12 px-6">
        <header className="mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Rewards Portal</h2>
          <p className="text-zinc-500 text-sm">Monitor your campus contributions and redeem credits.</p>
        </header>

        {successMessage && (
          <div className="mb-8 p-4 bg-zinc-900 text-white rounded-xl text-sm font-medium animate-in slide-in-from-top duration-300">
            {successMessage}
          </div>
        )}

        {/* Credit Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 p-8 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Available Credits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-zinc-900">{user?.credits}</span>
                <span className="text-zinc-400 font-medium">PTS</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">Valued at ₹{user?.credits}.00</p>
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setShowRedeemModal(true)}
                disabled={!user || user.credits === 0}
                className="px-6 py-2.5 bg-somaiya-red text-white text-sm font-bold rounded-lg hover:bg-somaiya-red-hover transition-colors disabled:opacity-50"
              >
                Redeem to Bank
              </button>
            </div>
          </div>
          
          <div className="p-8 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center text-center">
            <img src={user?.avatar} alt="Profile" className="w-16 h-16 rounded-full bg-zinc-100 mb-4" />
            <h3 className="font-bold text-zinc-900 leading-tight">{user?.name}</h3>
            <p className="text-xs text-zinc-400 mt-1 truncate w-full">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <section>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Recent Reports</h3>
              <div className="space-y-4">
                 {reports.map(report => (
                   <div key={report.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <img src={report.imageUrl} alt="Damage" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-zinc-800 truncate">{report.description}</p>
                         <p className="text-[10px] text-green-600 font-bold uppercase mt-0.5">Verified</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-zinc-900">+10</p>
                        <p className="text-[8px] text-zinc-400 font-bold">PTS</p>
                      </div>
                   </div>
                 ))}
                 {reports.length === 0 && (
                   <p className="text-sm text-zinc-400 italic py-4">No reports found.</p>
                 )}
              </div>
           </section>

           <section>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Campus Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-2xl font-bold text-zinc-900">{reports.length}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Issues Resolved</p>
                </div>
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-2xl font-bold text-zinc-900">₹{reports.length * 10}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Total Earned</p>
                </div>
              </div>
              <div className="mt-6 p-5 bg-zinc-900 rounded-2xl">
                 <p className="text-white text-xs font-bold mb-1">Contributor Note</p>
                 <p className="text-zinc-400 text-[11px] leading-relaxed">Your reports help the maintenance department identify campus safety hazards faster. Thank you for your service.</p>
              </div>
           </section>
        </div>

        {showRedeemModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-zinc-900">Redeem Credits</h3>
                  <button type="button" onClick={() => setShowRedeemModal(false)} className="text-zinc-400 hover:text-zinc-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Bank Details</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-zinc-300 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required
                      type="text" 
                      placeholder="IFSC Code"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-zinc-300 focus:outline-none"
                    />
                    <input 
                      required
                      type="number" 
                      max={user?.credits}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-zinc-300 focus:outline-none"
                    />
                  </div>

                  <input 
                    required
                    type="password" 
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-zinc-300 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-zinc-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-black transition-colors"
                >
                  Initiate Transfer
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
