import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, TrendingUp, AlertTriangle, ShieldCheck, Zap, MapPin, CheckSquare, Square, FileText, X, Printer, CheckCircle2, Search } from 'lucide-react';
import { SentimentChart } from '../components/AnalysisCharts';
import { LeadStatus } from '../types';

const ProposalModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    data: any; 
    selectedImprovements: number[];
    calculatedRevenue: number;
}> = ({ isOpen, onClose, data, selectedImprovements, calculatedRevenue }) => {
    if (!isOpen) return null;

    const { hotel, swot, improvements } = data;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white w-full max-w-4xl min-h-[80vh] rounded-xl shadow-2xl flex flex-col my-8 animate-slide-in-up">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl sticky top-0 z-10">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-blue-600" /> Wethaq Partnership Proposal
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                            <Printer size={16} /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Proposal Content - Printable Area */}
                <div className="p-8 md:p-12 overflow-y-auto print:p-0" id="proposal-content">
                    {/* Page 1: Cover */}
                    <div className="mb-12 border-b-2 border-slate-900 pb-8">
                        <div className="flex justify-between items-start mb-16">
                            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl">W</div>
                            <div className="text-right">
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">Partnership Proposal</h1>
                                <p className="text-slate-500 text-lg">Prepared for {hotel.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 text-sm text-slate-600">
                            <div>
                                <p className="font-bold text-slate-900 uppercase tracking-wide mb-1">Prepared By</p>
                                <p>Wethaq Operations Team</p>
                                <p>Riyadh, Saudi Arabia</p>
                                <p>contact@wethaq.sa</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900 uppercase tracking-wide mb-1">Date</p>
                                <p>{date}</p>
                                <p className="mt-2 text-blue-600 font-medium">Confidential</p>
                            </div>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Executive Summary</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Wethaq Operations has conducted a comprehensive analysis of <strong>{hotel.name}</strong> based on public data, guest sentiment, and market positioning. 
                            Our assessment indicates a strong potential for revenue growth and operational optimization.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                            <p className="font-medium text-blue-900">
                                We project an estimated annual revenue increase of <span className="font-bold text-emerald-600">${calculatedRevenue.toLocaleString()}</span> through targeted operational improvements and technology integration.
                            </p>
                        </div>
                    </div>

                    {/* Current Analysis (SWOT) */}
                    <div className="mb-12 break-inside-avoid">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">2. Strategic Analysis</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="border border-slate-200 rounded-lg p-5">
                                <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Key Strengths
                                </h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    {swot.strengths.slice(0, 4).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className="border border-slate-200 rounded-lg p-5">
                                <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Critical Weaknesses
                                </h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    {swot.weaknesses.slice(0, 4).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Proposed Solution */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Proposed Roadmap</h2>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="py-3 font-semibold text-slate-900">Improvement Initiative</th>
                                    <th className="py-3 font-semibold text-slate-900">Category</th>
                                    <th className="py-3 font-semibold text-slate-900 text-right">Est. Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedImprovements.length > 0 ? selectedImprovements.map(idx => {
                                    const imp = improvements[idx];
                                    return (
                                        <tr key={idx}>
                                            <td className="py-4 pr-4">
                                                <div className="font-medium text-slate-800">{imp.title}</div>
                                                <div className="text-sm text-slate-500">{imp.description}</div>
                                            </td>
                                            <td className="py-4">
                                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{imp.category}</span>
                                            </td>
                                            <td className="py-4 text-right font-medium text-emerald-600">
                                                +${(imp.estimatedRevenue || 50000).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-500 italic">No specific improvements selected for proposal.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50">
                                <tr>
                                    <td className="py-4 font-bold text-slate-900">Total Projected Impact</td>
                                    <td></td>
                                    <td className="py-4 text-right font-bold text-emerald-600 text-lg">${calculatedRevenue.toLocaleString()} / year</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Next Steps */}
                    <div className="break-inside-avoid">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Next Steps</h2>
                        <p className="text-slate-700 mb-6">
                            To proceed with this partnership, we propose an initial discovery meeting to validate these findings and discuss the revenue-share model suited for {hotel.name}.
                        </p>
                        <div className="flex gap-8 mt-12 pt-8 border-t border-slate-200">
                            <div className="flex-1">
                                <div className="h-12 border-b border-slate-300 mb-2"></div>
                                <p className="text-sm text-slate-500">For Wethaq Operations</p>
                            </div>
                            <div className="flex-1">
                                <div className="h-12 border-b border-slate-300 mb-2"></div>
                                <p className="text-sm text-slate-500">For {hotel.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportView: React.FC = () => {
  const { currentAnalysis, addLead, leads } = useAppState();
  const navigate = useNavigate();
  const [selectedImprovements, setSelectedImprovements] = useState<number[]>([]);
  const [showProposal, setShowProposal] = useState(false);

  // Initialize selected improvements
  React.useEffect(() => {
    if (currentAnalysis?.improvements) {
        setSelectedImprovements(currentAnalysis.improvements.map((_, i) => i));
    }
  }, [currentAnalysis]);

  if (!currentAnalysis) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="bg-blue-50 p-6 rounded-full mb-6">
                  <Search size={48} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Analysis Report Loaded</h2>
              <p className="text-slate-500 max-w-md mb-8">
                  It looks like you haven't generated a hotel analysis yet. Start a new analysis to see the report and insights.
              </p>
              <button 
                onClick={() => navigate('/analyze')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                  Start New Analysis
              </button>
          </div>
      );
  }

  const { hotel, swot, improvements, partnershipScore, sentimentAnalysis, competitors } = currentAnalysis;

  const toggleImprovement = (index: number) => {
      setSelectedImprovements(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
  };

  const calculatedRevenue = selectedImprovements.reduce((acc, idx) => acc + (improvements[idx].estimatedRevenue || 50000), 0);

  const handleSaveToCRM = () => {
    if (leads.find(l => l.hotelName === hotel.name)) {
      alert("Lead already exists in CRM!");
      return;
    }

    addLead({
      id: Math.random().toString(36).substring(2, 11),
      hotelName: hotel.name,
      ownerName: "Property Owner",
      contactInfo: "contact@" + hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '') + ".sa",
      city: hotel.address.split(',')[0]?.trim() || "Riyadh",
      status: LeadStatus.NEW,
      partnershipScore: partnershipScore,
      lastContact: new Date().toISOString(),
      notes: [`Auto-generated lead from analysis of ${hotel.name}`],
      activities: [{
          id: Math.random().toString(36).substring(2, 11),
          type: 'note',
          content: 'Analysis report generated and lead created.',
          date: new Date().toISOString()
      }],
      potentialRevenue: calculatedRevenue
    });
    navigate('/leads');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500';
    if (score >= 60) return 'text-blue-500 border-blue-500';
    return 'text-orange-500 border-orange-500';
  };

  return (
    <div className="pb-12 space-y-8 animate-fade-in">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Analysis
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowProposal(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors">
            <FileText size={18} /> Generate Proposal
          </button>
          <button onClick={handleSaveToCRM} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 font-medium transition-colors">
            <Save size={18} /> Save Lead to CRM
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full md:w-48 h-48 object-cover rounded-xl shadow-sm" />
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{hotel.name}</h1>
                <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                  <MapPin size={16} /> {hotel.address}
                </p>
              </div>
              <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-700">
                  {hotel.rating} ★ ({hotel.totalReviews} reviews)
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {hotel.amenities.map(am => (
                    <span key={am} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">{am}</span>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Price Range</span>
                    <span className="font-medium text-slate-800">{hotel.priceRange}</span>
                </div>
                <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Last Audit</span>
                    <span className="font-medium text-slate-800">Just Now</span>
                </div>
            </div>
          </div>
        </div>

        {/* Partnership Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-500 font-medium mb-4">Wethaq Partnership Score</h3>
            <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(partnershipScore)} bg-opacity-5`}>
                <span className={`text-4xl font-bold ${getScoreColor(partnershipScore).replace('border-', '')}`}>{partnershipScore}</span>
            </div>
            <p className="text-sm text-slate-400">
                {partnershipScore > 75 ? "Excellent Candidate. High improvement potential." : "Moderate potential. Selective approach recommended."}
            </p>
        </div>
      </div>

      {/* SWOT & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SWOT Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" />
                SWOT Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">Strengths</span>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="space-y-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded">Weaknesses</span>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">Opportunities</span>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="space-y-2">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">Threats</span>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {swot.threats.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-600" />
                Sentiment Analysis
            </h3>
            <div className="mb-4">
                <SentimentChart data={sentimentAnalysis} />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Customer Complaints</p>
                <div className="space-y-2">
                    {sentimentAnalysis.filter(s => s.sentiment === 'negative').slice(0, 2).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start text-sm">
                            <span className="text-red-500 font-medium shrink-0">{item.theme}:</span>
                            <span className="text-slate-600 italic">"{item.example}"</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Improvement Plan & ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Strategic Improvement Plan
            </h3>
            <p className="text-sm text-slate-500 mb-4">Select items to calculate projected revenue impact.</p>
            <div className="space-y-3">
                {improvements.map((imp, idx) => (
                    <div key={idx} 
                        onClick={() => toggleImprovement(idx)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedImprovements.includes(idx) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`text-blue-600 ${selectedImprovements.includes(idx) ? 'opacity-100' : 'opacity-30'}`}>
                                {selectedImprovements.includes(idx) ? <CheckSquare size={24} /> : <Square size={24} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">{imp.title}</h4>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        imp.category === 'Revenue' ? 'bg-emerald-100 text-emerald-700' :
                                        imp.category === 'Operational' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>{imp.category}</span>
                                </div>
                                <p className="text-sm text-slate-600">{imp.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* ROI Card */}
          <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
              <div>
                  <h3 className="font-bold text-lg mb-2">Projected Annual ROI</h3>
                  <p className="text-slate-400 text-sm mb-8">Estimated additional revenue if selected improvements are implemented.</p>
                  
                  <div className="mb-8">
                      <span className="text-5xl font-bold text-emerald-400">${calculatedRevenue.toLocaleString()}</span>
                      <span className="text-slate-400 ml-2">/ year</span>
                  </div>

                  <div className="space-y-4">
                      <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Selected Items</span>
                          <span>{selectedImprovements.length}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Base Revenue Impact</span>
                          <span>+15%</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Wethaq Fee (Est.)</span>
                          <span className="text-red-300">-${(calculatedRevenue * 0.1).toLocaleString()}</span>
                      </div>
                  </div>
              </div>
              
              <button onClick={() => setShowProposal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg mt-8 transition-colors flex items-center justify-center gap-2">
                  <FileText size={20} /> Preview Proposal
              </button>
          </div>
      </div>

      {/* Competitors */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Competitor Landscape
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="pb-3 pl-4">Hotel</th>
                        <th className="pb-3">Rating</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Amenities Score</th>
                        <th className="pb-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {/* Current Hotel */}
                    <tr className="bg-blue-50/50">
                        <td className="py-4 pl-4 font-bold text-slate-900 flex items-center gap-2">
                            {hotel.name} <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">Target</span>
                        </td>
                        <td className="py-4 text-slate-600">{hotel.rating} ★</td>
                        <td className="py-4 text-slate-600">{hotel.priceRange}</td>
                        <td className="py-4">
                            <div className="flex gap-1">
                                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500"></div>)}
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                        </td>
                        <td className="py-4"><span className="text-orange-600 text-sm font-medium">Needs Optimization</span></td>
                    </tr>
                    {/* Competitors */}
                    {competitors.map((comp, i) => (
                         <tr key={i} className="hover:bg-slate-50">
                            <td className="py-4 pl-4 font-medium text-slate-700">{comp.name}</td>
                            <td className="py-4 text-slate-600">{comp.rating} ★</td>
                            <td className="py-4 text-slate-600">{comp.priceRange}</td>
                            <td className="py-4">
                                <div className="flex gap-1">
                                    {[1,2,3,4].map(k => <div key={k} className="w-2 h-2 rounded-full bg-slate-400"></div>)}
                                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                </div>
                            </td>
                            <td className="py-4"><span className="text-slate-400 text-sm">Competitor</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

      <ProposalModal 
        isOpen={showProposal} 
        onClose={() => setShowProposal(false)}
        data={currentAnalysis}
        selectedImprovements={selectedImprovements}
        calculatedRevenue={calculatedRevenue}
      />
    </div>
  );
};

export default ReportView;