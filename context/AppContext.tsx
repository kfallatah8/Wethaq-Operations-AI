import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Lead, AnalysisReport, LeadStatus, Activity } from '../types';

const AppContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
};

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('wethaq_leads');
    if (saved) {
      // Migration for old data structure if needed
      const parsed = JSON.parse(saved);
      return parsed.map((l: any) => ({
        ...l,
        activities: l.activities || [],
        potentialRevenue: l.potentialRevenue || 0
      }));
    }
    return [
        {
            id: '1',
            hotelName: 'Al Hamra Palace',
            ownerName: 'Sheikh Abdullah',
            contactInfo: '+966 50 123 4567',
            city: 'Jeddah',
            status: LeadStatus.NEGOTIATION,
            partnershipScore: 82,
            lastContact: '2023-10-25',
            notes: ['Interested in restaurant renovation'],
            potentialRevenue: 150000,
            activities: [
              { id: 'a1', type: 'status_change', content: 'Moved to Negotiation', date: '2023-10-25T10:00:00Z' },
              { id: 'a2', type: 'call', content: 'Discussed revenue share model. He is positive.', date: '2023-10-24T14:30:00Z' }
            ]
        },
        {
            id: '2',
            hotelName: 'Desert Rose Inn',
            ownerName: 'Mr. Khalid',
            contactInfo: 'khalid@desertrose.com',
            city: 'Riyadh',
            status: LeadStatus.NEW,
            partnershipScore: 65,
            lastContact: '2023-10-20',
            notes: [],
            potentialRevenue: 80000,
            activities: [
               { id: 'b1', type: 'note', content: 'Lead created from manual entry', date: '2023-10-20T09:00:00Z' }
            ]
        },
        {
            id: '3',
            hotelName: 'Red Sea View',
            ownerName: 'Ahmed Al-Sayed',
            contactInfo: 'ahmed@rsv.com',
            city: 'Jeddah',
            status: LeadStatus.CONTACTED,
            partnershipScore: 78,
            lastContact: '2023-10-26',
            notes: [],
            potentialRevenue: 120000,
            activities: []
        },
        {
            id: '4',
            hotelName: 'Oasis Downtown',
            ownerName: 'Fahad',
            contactInfo: 'fahad@oasis.com',
            city: 'Dammam',
            status: LeadStatus.MEETING,
            partnershipScore: 88,
            lastContact: '2023-10-27',
            notes: [],
            potentialRevenue: 200000,
            activities: []
        }
    ];
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisReport | null>(() => {
    const saved = localStorage.getItem('wethaq_current_analysis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('wethaq_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    if (currentAnalysis) {
      localStorage.setItem('wethaq_current_analysis', JSON.stringify(currentAnalysis));
    }
  }, [currentAnalysis]);

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => {
        if (l.id === id) {
            const newActivity: Activity = {
                id: Math.random().toString(36).substring(2, 11),
                type: 'status_change',
                content: `Status changed from ${l.status} to ${status}`,
                date: new Date().toISOString()
            };
            return { ...l, status, activities: [newActivity, ...(l.activities || [])] };
        }
        return l;
    }));
  };

  const addActivity = (leadId: string, activity: Activity) => {
      setLeads(prev => prev.map(l => {
          if (l.id === leadId) {
              return { ...l, activities: [activity, ...l.activities] };
          }
          return l;
      }));
  };

  const value: AppState = {
    leads,
    currentAnalysis,
    addLead,
    updateLeadStatus,
    addActivity,
    setCurrentAnalysis
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};