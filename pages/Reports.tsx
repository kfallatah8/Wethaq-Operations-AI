import React from 'react';
import { Download, Calendar, TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';
import { TrendLineChart, PipelinePieChart } from '../components/AnalysisCharts';

const Reports: React.FC = () => {
  // Mock Data for Reports
  const performanceData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 75000 },
  ];

  const sourceData = [
    { name: 'Google Maps', value: 45 },
    { name: 'Booking.com', value: 30 },
    { name: 'Referrals', value: 15 },
    { name: 'Direct', value: 10 },
  ];

  const salesTeam = [
    { id: 1, name: 'Omar Khaled', role: 'Senior Sales', deals: 12, revenue: 150000, conversion: '18%' },
    { id: 2, name: 'Sarah Ahmed', role: 'Sales Executive', deals: 8, revenue: 85000, conversion: '12%' },
    { id: 3, name: 'Fahad Al-Otaibi', role: 'Account Manager', deals: 15, revenue: 210000, conversion: '22%' },
    { id: 4, name: 'Layla Mahmoud', role: 'Sales Executive', deals: 6, revenue: 60000, conversion: '10%' },
  ];

  return (
    <div className="pb-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Reports</h1>
          <p className="text-slate-500">Executive overview of sales, revenue, and team performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Revenue YTD</p>
              <h3 className="text-2xl font-bold text-slate-900">$505,000</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +24% vs last year
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Avg Deal Size</p>
              <h3 className="text-2xl font-bold text-slate-900">$12,450</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +5% vs last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-slate-900">14.2%</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
             Target: 15%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Avg Sales Cycle</p>
              <h3 className="text-2xl font-bold text-slate-900">24 Days</h3>
            </div>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium">
             -2 days faster than avg
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Monthly Revenue Growth</h3>
            <select className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-600 bg-slate-50 p-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <TrendLineChart data={performanceData} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6">Leads by Source</h3>
          <PipelinePieChart data={sourceData} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Award className="text-yellow-500" /> Top Performers
            </h3>
            <span className="text-sm text-slate-500">June 2024</span>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deals Closed</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {salesTeam.map((agent, index) => (
                    <tr key={agent.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                    index === 1 ? 'bg-slate-200 text-slate-600' :
                                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{agent.name}</div>
                                    <div className="text-xs text-slate-500">{agent.role}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{agent.deals}</td>
                        <td className="px-6 py-4 text-emerald-600 font-medium">${agent.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: agent.conversion }}></div>
                                </div>
                                <span className="text-xs text-slate-600">{agent.conversion}</span>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;