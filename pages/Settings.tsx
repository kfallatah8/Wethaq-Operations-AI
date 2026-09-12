import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Database, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    newLeads: true,
    weeklyReport: false,
    securityAlerts: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-500 mb-8">Manage your account preferences and system configurations.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
            <nav className="space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id 
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
            {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input type="email" defaultValue="admin@wethaq.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                            <input type="text" defaultValue="System Administrator" disabled className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                            <input type="tel" defaultValue="+966 50 000 0000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                <div>
                                    <h3 className="font-medium text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                    <p className="text-sm text-slate-500">Receive notifications via email for this category.</p>
                                </div>
                                <button 
                                    onClick={() => toggleNotification(key as keyof typeof notifications)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {activeTab === 'integrations' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">System Integrations</h2>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-start gap-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-emerald-800">Google Gemini AI</h3>
                            <p className="text-sm text-emerald-600 mb-2">Connected and Operational. Model: gemini-2.5-flash</p>
                            <span className="text-xs bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono">Status: Active</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-800">Booking.com Scraper</h3>
                            <p className="text-sm text-blue-600 mb-2">Running scheduled tasks daily at 00:00 UTC.</p>
                            <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200 font-mono">Latency: 45ms</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                        <div className="p-2 bg-slate-200 text-slate-600 rounded-lg">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Database Connection</h3>
                            <p className="text-sm text-slate-600 mb-2">PostgreSQL on Cloud Region us-east-1.</p>
                            <span className="text-xs bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 font-mono">Version: 15.2</span>
                        </div>
                    </div>
                 </div>
            )}

            {activeTab === 'security' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h2>
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                        <button className="text-blue-600 font-medium hover:underline">Enable</button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-t border-slate-100">
                        <div>
                            <h3 className="font-medium text-slate-900">Change Password</h3>
                            <p className="text-sm text-slate-500">Last changed 3 months ago.</p>
                        </div>
                        <button className="text-blue-600 font-medium hover:underline">Update</button>
                    </div>
                     <div className="flex items-center justify-between py-4 border-t border-slate-100">
                        <div>
                            <h3 className="font-medium text-red-600">Delete Account</h3>
                            <p className="text-sm text-slate-500">Permanently remove your account and all data.</p>
                        </div>
                        <button className="text-red-600 font-medium hover:underline border border-red-200 px-3 py-1 rounded hover:bg-red-50">Delete</button>
                    </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;