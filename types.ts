export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  MEETING = 'Meeting Scheduled',
  NEGOTIATION = 'Negotiation',
  WON = 'Won',
  LOST = 'Lost'
}

export interface HotelDetails {
  name: string;
  address: string;
  rating: number;
  totalReviews: number;
  priceRange: string;
  amenities: string[];
  imageUrl: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ImprovementPoint {
  category: 'Operational' | 'Revenue' | 'Guest Satisfaction' | 'Staff' | 'Tech';
  title: string;
  description: string;
  impactScore: number; // 1-10
  estimatedRevenue?: number; // Annual estimate
}

export interface AnalysisReport {
  hotel: HotelDetails;
  swot: SwotAnalysis;
  competitors: Partial<HotelDetails>[]; // Mocked or scraped nearby
  improvements: ImprovementPoint[];
  partnershipScore: number; // 0-100
  sentimentAnalysis: {
    theme: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    example: string;
  }[];
  generatedAt: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change';
  content: string;
  date: string;
}

export interface Lead {
  id: string;
  hotelName: string;
  ownerName: string;
  contactInfo: string;
  city: string;
  status: LeadStatus;
  partnershipScore: number;
  lastContact: string;
  notes: string[]; // Legacy simple notes
  activities: Activity[]; // Detailed timeline
  sourceUrl?: string;
  potentialRevenue: number;
}

export interface AppState {
  leads: Lead[];
  currentAnalysis: AnalysisReport | null;
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addActivity: (leadId: string, activity: Activity) => void;
  setCurrentAnalysis: (report: AnalysisReport) => void;
}