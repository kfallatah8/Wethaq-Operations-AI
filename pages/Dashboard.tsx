import React from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { LeadStatus } from '../types';
import { PipelinePieChart, RevenueForecastChart } from '../components/AnalysisCharts';

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
        <span className="text-emerald-500 font-medium">↑</span>
        {subtext}
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const { leads } = useAppState();

  const totalLeads = leads.length;
  const highPotential = leads.filter(l => l.partnershipScore > 75).length;
  const activeDeals = leads.filter(l => [LeadStatus.NEGOTIATION, LeadStatus.MEETING, LeadStatus.CONTACTED].includes(l.status)).length;
  const wonDeals = leads.filter(l => l.status === LeadStatus.WON).length;
  const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.potentialRevenue || 0), 0);

  // Prepare Chart Data
  const statusData = Object.values(LeadStatus).map(status => ({
      name: status,
      value: leads.filter(l => l.status === status).length
  })).filter(d => d.value > 0);

  const forecastData = [
      { name: 'Q1', value: 120000 },
      { name: 'Q2', value: 250000 },
      { name: 'Q3', value: totalPipelineValue * 0.4 }, // projected
      { name: 'Q4', value: totalPipelineValue * 0.8 }, // projected
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Operations Dashboard</h1>
            <p className="text-slate-500">Real-time overview of partnership opportunities.</p>
        </div>
        <Link to="/analyze" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-2">
            New Hotel Analysis <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Active Leads" 
          value={totalLeads} 
          subtext="12% from last month" 
          icon={Users} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="High Potential" 
          value={highPotential} 
          subtext="Score > 75/100" 
          icon={TrendingUp} 
          color="bg-purple-500 text-purple-500" 
        />
        <StatCard 
          title="Active Deals" 
          value={activeDeals} 
          subtext="In pipeline" 
          icon={AlertCircle} 
          color="bg-orange-500 text-orange-500" 
        />
        <StatCard 
          title="Pipeline Value" 
          value={`$${(totalPipelineValue / 1000000).toFixed(1)}M`} 
          subtext="Projected Revenue" 
          icon={DollarSign} 
          color="bg-emerald-500 text-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-6">Lead Distribution</h3>
            <PipelinePieChart data={statusData} />
        </div>

        {/* Revenue Forecast */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-6">Revenue Forecast (2025)</h3>
            <RevenueForecastChart data={forecastData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent High Potential Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">High Priority Leads</h3>
            <Link to="/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {leads.filter(l => l.partnershipScore > 70).slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${lead.partnershipScore > 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {lead.partnershipScore}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{lead.hotelName}</h4>
                    <p className="text-sm text-slate-500">{lead.city} • Val: ${(lead.potentialRevenue/1000).toFixed(0)}k</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-600' : 
                    lead.status === LeadStatus.NEGOTIATION ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/analyze" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors">
              Analyze New Hotel
            </Link>
            <Link to="/leads" className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-lg text-center transition-colors">
              Manage Active Deals
            </Link>
            <button className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-lg text-center transition-colors">
              Download Weekly Report
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="flex items-center gap-3 text-slate-400 text-sm">
                <CheckCircle2 size={16} />
                <span>System Operational</span>
             </div>
             <div className="flex items-center gap-3 text-slate-400 text-sm mt-2">
                <CheckCircle2 size={16} />
                <span>AI Models Ready</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;