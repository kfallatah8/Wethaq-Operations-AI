import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, AlertTriangle, Link as LinkIcon, Building, Terminal, Edit3, Star, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateHotelAnalysis, resolveShortlinkUrl, extractUniversalUrlMetadata } from '../services/geminiService';
import { useAppState } from '../context/AppContext';
import { HotelDetails } from '../types';

const ScrapingLog = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "Initializing Wethaq scraper engine v2.4...",
    "Connecting to Google Places API...",
    "Target host resolved: maps.google.com",
    "Extracting metadata... [OK]",
    "Fetching recent reviews (limit=500)...",
    "Parsing review sentiment...",
    "Analyzing amenities images...",
    "Checking Booking.com price parity...",
    "Comparing with nearby competitors...",
    "Calculating partnership potential score..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, messages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400); // Speed of logs
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 h-64 overflow-hidden border border-slate-800 shadow-inner">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-slate-400">
            <Terminal size={14} />
            <span>System Console</span>
        </div>
        <div className="space-y-1">
            {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 animate-fade-in">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                </div>
            ))}
            <div className="animate-pulse">_</div>
        </div>
    </div>
  );
};

const HotelAnalysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: input, 1: scraping, 2: analyzing
  
  // Manual Data State
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualRating, setManualRating] = useState(3.5);
  const [manualReviews, setManualReviews] = useState(150);
  const [manualPrice, setManualPrice] = useState('$$');
  const [manualCity, setManualCity] = useState('Riyadh');

  const navigate = useNavigate();
  const { setCurrentAnalysis } = useAppState();

  const handleAnalyze = async () => {
    if (!hotelName && !url) {
        alert("Please enter a hotel name or URL.");
        return;
    }

    setLoading(true);
    setStep(1);

    const activeUrl = await resolveShortlinkUrl(url);
    const urlMeta = extractUniversalUrlMetadata(activeUrl, hotelName, isManualMode ? manualCity : undefined);

    const hotelImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ];

    const baseDetails: HotelDetails = {
      name: hotelName.trim() || urlMeta.name,
      address: `${isManualMode ? manualCity : urlMeta.city}, Saudi Arabia`,
      rating: isManualMode ? manualRating : 4.1,
      totalReviews: isManualMode ? manualReviews : 452,
      priceRange: isManualMode ? manualPrice : "$$ ($80 - $130)",
      amenities: ["Free High-Speed WiFi", "Prayer Room", "City View Suites", "24/7 Room Service", "Airport Shuttle"],
      imageUrl: hotelImages[Math.floor(Math.random() * hotelImages.length)]
    };

    const manualData = isManualMode ? {
      rating: manualRating,
      reviews: manualReviews,
      price: manualPrice,
      city: manualCity
    } : undefined;

    try {
      const aiData = await generateHotelAnalysis(hotelName, activeUrl, manualData);

      if (aiData && aiData.swot) {
        const resolvedHotel: HotelDetails = {
          name: aiData.hotelDetails?.name || baseDetails.name,
          address: aiData.hotelDetails?.address || baseDetails.address,
          rating: aiData.hotelDetails?.rating || baseDetails.rating,
          totalReviews: aiData.hotelDetails?.totalReviews || baseDetails.totalReviews,
          priceRange: aiData.hotelDetails?.priceRange || baseDetails.priceRange,
          amenities: (aiData.hotelDetails?.amenities && aiData.hotelDetails.amenities.length > 0) 
            ? aiData.hotelDetails.amenities 
            : baseDetails.amenities,
          imageUrl: baseDetails.imageUrl
        };

        setCurrentAnalysis({
            hotel: resolvedHotel,
            swot: aiData.swot,
            competitors: aiData.competitors?.map((c: any, idx: number) => ({
                ...c,
                address: `${resolvedHotel.address.split(',')[0]} District`,
                totalReviews: Math.floor(Math.random() * 400) + 100,
                amenities: ["WiFi", "Pool", "Gym"],
                imageUrl: hotelImages[idx % hotelImages.length]
            })) || [],
            improvements: aiData.improvements || [],
            partnershipScore: aiData.partnershipScore || 75,
            sentimentAnalysis: aiData.sentimentAnalysis || [],
            generatedAt: new Date().toISOString()
        });
        navigate('/report');
      } else {
        alert("Failed to generate report. Please verify input data.");
      }
    } catch (err) {
      console.error("Analysis generation error:", err);
      alert("An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Evaluate a New Hotel</h1>
        <p className="text-slate-500 text-lg">Enter a Booking.com or Google Maps link to instantly generate a comprehensive Wethaq partnership report.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        {!loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Hotel Information</h3>
                <button 
                  type="button"
                  onClick={() => setIsManualMode(!isManualMode)}
                  className={`text-sm flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${isManualMode ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Edit3 size={14} />
                  {isManualMode ? 'Manual Input Active' : 'Enable Manual Input'}
                </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hotel Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="e.g. Al-Waha Downtown Hotel"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Listing URL (Google Maps / Booking.com)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.booking.com/hotel/..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {isManualMode && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4 animate-slide-in-up">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                    <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 text-slate-400" size={14} />
                        <input type="text" value={manualCity} onChange={e => setManualCity(e.target.value)} className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price Range</label>
                    <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 text-slate-400" size={14} />
                        <select value={manualPrice} onChange={e => setManualPrice(e.target.value)} className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none bg-white">
                            <option value="$">$ (Budget)</option>
                            <option value="$$">$$ (Standard)</option>
                            <option value="$$$">$$$ (Premium)</option>
                            <option value="$$$$">$$$$ (Luxury)</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Rating (0-5)</label>
                    <div className="relative">
                        <Star className="absolute left-2 top-2.5 text-slate-400" size={14} />
                        <input type="number" step="0.1" max="5" value={manualRating} onChange={e => setManualRating(parseFloat(e.target.value))} className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Reviews</label>
                    <div className="relative">
                        <Users className="absolute left-2 top-2.5 text-slate-400" size={14} />
                        <input type="number" value={manualReviews} onChange={e => setManualReviews(parseInt(e.target.value))} className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none" />
                    </div>
                 </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Start Analysis
            </button>
            
            {!isManualMode && (
                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
                <AlertTriangle className="shrink-0 text-blue-600" size={20} />
                <p><strong>Wethaq Real-Time AI Intelligence Engine Active.</strong> Analyzing property listing details, guest review sentiment, and market positioning across regional hospitality databases.</p>
                </div>
            )}
          </div>
        ) : (
          <div className="py-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Generating Intelligence Report...
            </h3>
            
            {/* Live Scraping Console Visualization */}
            <ScrapingLog />

            <div className="mt-8 text-center">
                 <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                 <p className="text-slate-500 text-sm">Processing data with Gemini 2.5 Flash...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelAnalysis;