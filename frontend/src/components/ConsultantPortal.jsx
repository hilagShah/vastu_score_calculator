import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, Clock, RefreshCw, CheckCircle2, AlertCircle, Trash2, Video, UserCheck, PhoneCall, Filter, Sparkles, Building2 } from 'lucide-react';

const ConsultantPortal = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All, Pending, Contacted, Completed

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const hostname = window.location.hostname || 'localhost';
      const API_URL = window.location.port ? `${window.location.protocol}//${hostname}:5001` : '';
      const res = await axios.get(`${API_URL}/api/consultations`);
      if (res.data?.success) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      console.error('Fetch Consultations Error:', err);
      setError('Failed to fetch consultation requests. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const hostname = window.location.hostname || 'localhost';
      const API_URL = window.location.port ? `${window.location.protocol}//${hostname}:5001` : '';
      await axios.patch(`${API_URL}/api/consultations/${id}`, { status: newStatus });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this consultation request?')) return;
    try {
      const hostname = window.location.hostname || 'localhost';
      const API_URL = window.location.port ? `${window.location.protocol}//${hostname}:5001` : '';
      await axios.delete(`${API_URL}/api/consultations/${id}`);
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete request.');
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'All') return true;
    return r.status === activeTab;
  });

  const countPending = requests.filter(r => r.status === 'Pending').length;
  const countContacted = requests.filter(r => r.status === 'Contacted').length;
  const countCompleted = requests.filter(r => r.status === 'Completed').length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Consultant Administration
          </div>
          <h2 className="text-2xl font-extrabold font-display">
            Vastu Expert Lead Dashboard
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Manage incoming client consultation requests, callbacks, and site visits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={fetchRequests}
            className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-primary py-2.5 px-4 text-xs font-bold"
            >
              Exit Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
          <span className="text-2xl font-extrabold text-slate-900 font-display mt-1">{requests.length}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Pending Callbacks</span>
          <span className="text-2xl font-extrabold text-rose-700 font-display mt-1">{countPending}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Contacted</span>
          <span className="text-2xl font-extrabold text-indigo-700 font-display mt-1">{countContacted}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-display mt-1">{countCompleted}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Pending', 'Contacted', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-indigo-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <span className="ml-3 text-xs font-bold text-slate-600">Loading client call requests...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">No {activeTab} Call Requests</h4>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
            All client consultation calls have been attended to or no submissions found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredRequests.map(req => {
            const dateStr = req.createdAt ? new Date(req.createdAt).toLocaleString() : 'Recent';
            return (
              <div 
                key={req._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md"
              >
                {/* Top Row: Client Name & Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {req.fullName ? req.fullName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{req.fullName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Submitted {dateStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        req.status === 'Pending' 
                          ? 'bg-rose-50 border-rose-200 text-rose-700' 
                          : req.status === 'Contacted' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {req.status}
                    </span>

                    <button
                      onClick={() => handleDelete(req._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <a href={`tel:${req.phone}`} className="hover:underline font-bold text-slate-900">{req.phone}</a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                    <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <a href={`mailto:${req.email}`} className="hover:underline truncate">{req.email}</a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    {req.consultationType === 'video' ? (
                      <Video className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    ) : req.consultationType === 'phone' ? (
                      <PhoneCall className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    )}
                    <span className="capitalize font-semibold">{req.consultationType} Call</span>
                    <span className="text-slate-400">({req.timeSlot})</span>
                  </div>
                </div>

                {req.message && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                    <strong className="text-slate-900 block text-[10px] uppercase tracking-wider mb-0.5">Client Note:</strong>
                    "{req.message}"
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-auto">Set Status:</span>
                  
                  <button
                    onClick={() => handleUpdateStatus(req._id, 'Pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      req.status === 'Pending' ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(req._id, 'Contacted')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      req.status === 'Contacted' ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Contacted
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(req._id, 'Completed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      req.status === 'Completed' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ConsultantPortal;
