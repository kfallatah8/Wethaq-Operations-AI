import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Lead, LeadStatus, Activity } from '../types';
import { generateEmailDraft } from '../services/geminiService';
import { Mail, Phone, Calendar, MoreHorizontal, FileText, Loader2, X, Zap, LayoutGrid, List, Search, Plus, User, MapPin } from 'lucide-react';

const CRMLeads: React.FC = () => {
  const { leads, updateLeadStatus, addActivity, addLead } = useAppState();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null); // For details
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null); // For email generation
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Add Lead Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    hotelName: '',
    ownerName: '',
    contactInfo: '',
    city: 'Riyadh',
    status: LeadStatus.NEW,
    partnershipScore: 80,
    potentialRevenue: 120000
  });

  const filteredLeads = leads.filter(l => 
    l.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateEmail = async (lead: Lead) => {
    setGeneratingEmail(true);
    setEmailDraft('');
    setEmailModalLead(lead);
    
    const draft = await generateEmailDraft(lead, lead.status === LeadStatus.NEW ? 'intro' : 'followup');
    setEmailDraft(draft);
    setGeneratingEmail(false);
  };

  const handleAddNote = () => {
      if (!selectedLead || !newNote.trim()) return;
      
      const activity: Activity = {
          id: Math.random().toString(36).substring(2, 11),
          type: 'note',
          content: newNote,
          date: new Date().toISOString()
      };
      
      addActivity(selectedLead.id, activity);
      setSelectedLead(prev => prev ? ({...prev, activities: [activity, ...(prev.activities || [])]}) : null);
      setNewNote('');
  };

  const handleLogCall = () => {
      if (!selectedLead) return;
      const callContent = prompt("Enter call summary/notes:", "Spoke with owner regarding revenue sharing terms.");
      if (!callContent) return;

      const activity: Activity = {
          id: Math.random().toString(36).substring(2, 11),
          type: 'call',
          content: `Call Logged: ${callContent}`,
          date: new Date().toISOString()
      };

      addActivity(selectedLead.id, activity);
      setSelectedLead(prev => prev ? ({...prev, activities: [activity, ...(prev.activities || [])]}) : null);
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLeadData.hotelName.trim()) return;

      const created: Lead = {
          id: Math.random().toString(36).substring(2, 11),
          hotelName: newLeadData.hotelName,
          ownerName: newLeadData.ownerName || "Property Owner",
          contactInfo: newLeadData.contactInfo || "contact@hotel.com",
          city: newLeadData.city,
          status: newLeadData.status,
          partnershipScore: Number(newLeadData.partnershipScore) || 75,
          lastContact: new Date().toISOString(),
          notes: ["Manually created lead"],
          activities: [{
              id: Math.random().toString(36).substring(2, 11),
              type: 'note',
              content: 'Lead created in CRM.',
              date: new Date().toISOString()
          }],
          potentialRevenue: Number(newLeadData.potentialRevenue) || 100000
      };

      addLead(created);
      setShowAddModal(false);
      setNewLeadData({
        hotelName: '',
        ownerName: '',
        contactInfo: '',
        city: 'Riyadh',
        status: LeadStatus.NEW,
        partnershipScore: 80,
        potentialRevenue: 120000
      });
  };

  const statusColors = {
    [LeadStatus.NEW]: 'bg-blue-100 text-blue-800 border-blue-200',
    [LeadStatus.CONTACTED]: 'bg-purple-100 text-purple-800 border-purple-200',
    [LeadStatus.MEETING]: 'bg-orange-100 text-orange-800 border-orange-200',
    [LeadStatus.NEGOTIATION]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [LeadStatus.WON]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [LeadStatus.LOST]: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  // --- Render Functions ---

  const renderKanban = () => (
    <div className="flex overflow-x-auto pb-6 gap-6 h-full">
      {Object.values(LeadStatus).map(status => (
        <div key={status} className="flex-none w-80 bg-slate-100 rounded-xl p-4 flex flex-col h-full max-h-[calc(100vh-200px)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 text-sm uppercase">{status}</h3>
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded-full text-slate-500">
              {filteredLeads.filter(l => l.status === status).length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredLeads.filter(l => l.status === status).map(lead => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow group relative"
              >
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 truncate pr-2">{lead.hotelName}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${lead.partnershipScore > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {lead.partnershipScore}
                    </span>
                </div>
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin size={12} /> {lead.city}
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-400">${(lead.potentialRevenue/1000).toFixed(0)}k</span>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleGenerateEmail(lead); }} className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded">
                            <Mail size={14} />
                        </button>
                        <select 
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 outline-none"
                            value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        >
                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Est. Revenue</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {filteredLeads.map((lead) => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{lead.hotelName}</div>
                        <div className="text-xs text-slate-500">{lead.ownerName}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[lead.status]}`}>
                            {lead.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className={`font-bold ${lead.partnershipScore > 75 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {lead.partnershipScore}/100
                        </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        ${lead.potentialRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{lead.city}</td>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleGenerateEmail(lead)} className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors">
                            <Mail size={18} />
                        </button>
                    </div>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
            <p className="text-slate-500">Track and convert hotel partnerships.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search hotels..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                <button 
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                >
                    <List size={18} />
                </button>
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 px-4 rounded-lg flex items-center gap-2 font-medium shadow-sm shadow-blue-500/20 transition-colors"
            >
                <Plus size={18} /> <span className="hidden md:inline">Add Lead</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' ? renderKanban() : renderList()}
      </div>

      {/* --- Detail Modal --- */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end">
            <div className="bg-white w-full md:w-[600px] h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedLead.hotelName}</h2>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <MapPin size={16} /> {selectedLead.city}
                        </div>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-xs text-slate-500 uppercase font-bold">Status</span>
                        <select 
                            value={selectedLead.status}
                            onChange={(e) => {
                                updateLeadStatus(selectedLead.id, e.target.value as LeadStatus);
                                setSelectedLead({...selectedLead, status: e.target.value as LeadStatus});
                            }}
                            className="block w-full mt-1 bg-transparent font-medium text-slate-900 outline-none cursor-pointer"
                        >
                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-xs text-slate-500 uppercase font-bold">Potential Revenue</span>
                        <div className="text-lg font-bold text-slate-900 mt-1">${selectedLead.potentialRevenue.toLocaleString()}</div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User size={20} /> Contact Details
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Owner Name</span>
                            <span className="font-medium">{selectedLead.ownerName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Phone/Email</span>
                            <span className="font-medium">{selectedLead.contactInfo}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Partnership Score</span>
                            <span className="font-medium text-emerald-600">{selectedLead.partnershipScore}/100</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <FileText size={20} /> Activity & Notes
                        </h3>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a note..."
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        />
                        <button onClick={handleAddNote} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Add</button>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
                        {(selectedLead.activities || []).map((activity) => (
                            <div key={activity.id} className="relative pl-8">
                                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white ${
                                    activity.type === 'status_change' ? 'bg-orange-400' : 'bg-blue-400'
                                }`}></div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-sm text-slate-800">{activity.content}</p>
                                    <span className="text-xs text-slate-400 mt-1 block">
                                        {new Date(activity.date).toLocaleString()} • {activity.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                         {/* Fallback for legacy notes */}
                         {(selectedLead.notes || []).map((note, i) => (
                            <div key={i} className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white bg-slate-400"></div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-sm text-slate-800">{note}</p>
                                    <span className="text-xs text-slate-400 mt-1 block">Legacy Note</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => { setSelectedLead(null); handleGenerateEmail(selectedLead); }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2"
                    >
                        <Mail size={18} /> Draft Email
                    </button>
                    <button 
                        onClick={handleLogCall}
                        className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
                    >
                        <Phone size={18} /> Log Call
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- Email Modal --- */}
      {emailModalLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                  <h3 className="text-xl font-bold text-slate-900">AI Sales Assistant</h3>
                  <p className="text-sm text-slate-500">Drafting email for {emailModalLead.hotelName}</p>
              </div>
              <button onClick={() => setEmailModalLead(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {generatingEmail ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="text-slate-500">Generating personalized strategy & email draft...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
                        <Zap size={16} /> Strategy Insight
                    </h4>
                    <p className="text-sm text-blue-700">
                        High potential partner ({emailModalLead.partnershipScore}). Emphasize operational efficiency and Wethaq's track record in {emailModalLead.city}.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Generated Draft (Arabic)</label>
                    <textarea 
                        className="w-full h-64 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-right"
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        dir="rtl"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setEmailModalLead(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
               <button 
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                disabled={generatingEmail}
                onClick={() => {
                    alert("Email sent to mail client!");
                    if(emailModalLead) {
                        addActivity(emailModalLead.id, {
                            id: Math.random().toString(36).substring(2, 11),
                            type: 'email',
                            content: 'Sent AI generated intro email',
                            date: new Date().toISOString()
                        });
                    }
                    setEmailModalLead(null);
                }}
               >
                  Open in Mail App
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Lead Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Add New Hotel Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotel Name *</label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.hotelName}
                  onChange={e => setNewLeadData({...newLeadData, hotelName: e.target.value})}
                  placeholder="e.g. Al-Faisaliah Hotel"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Owner Name</label>
                  <input 
                    type="text" 
                    value={newLeadData.ownerName}
                    onChange={e => setNewLeadData({...newLeadData, ownerName: e.target.value})}
                    placeholder="e.g. Sheikh Salman"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                  <input 
                    type="text" 
                    value={newLeadData.city}
                    onChange={e => setNewLeadData({...newLeadData, city: e.target.value})}
                    placeholder="Riyadh, Jeddah..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Info</label>
                  <input 
                    type="text" 
                    value={newLeadData.contactInfo}
                    onChange={e => setNewLeadData({...newLeadData, contactInfo: e.target.value})}
                    placeholder="Phone or Email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pipeline Stage</label>
                  <select 
                    value={newLeadData.status}
                    onChange={e => setNewLeadData({...newLeadData, status: e.target.value as LeadStatus})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  >
                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partnership Score (0-100)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={newLeadData.partnershipScore}
                    onChange={e => setNewLeadData({...newLeadData, partnershipScore: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Est. Revenue ($)</label>
                  <input 
                    type="number" 
                    value={newLeadData.potentialRevenue}
                    onChange={e => setNewLeadData({...newLeadData, potentialRevenue: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMLeads;