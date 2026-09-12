import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Legend, LineChart, Line } from 'recharts';

interface Props {
  data: { theme: string; count: number; sentiment: string }[];
}

export const SentimentChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-64 w-full flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="theme" type="category" width={100} tick={{fontSize: 12}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            cursor={{fill: 'transparent'}}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.sentiment === 'negative' ? '#ef4444' : entry.sentiment === 'positive' ? '#22c55e' : '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PotentialRadar: React.FC = () => {
    const data = [
        { subject: 'Revenue', A: 60, B: 90, fullMark: 100 },
        { subject: 'Ops', A: 50, B: 85, fullMark: 100 },
        { subject: 'Tech', A: 40, B: 80, fullMark: 100 },
        { subject: 'Staff', A: 70, B: 80, fullMark: 100 },
        { subject: 'Guest Exp', A: 55, B: 95, fullMark: 100 },
    ];

    return (
        <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current" dataKey="A" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                <Radar name="With Wethaq" dataKey="B" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export const PipelinePieChart: React.FC<{data: any[]}> = ({data}) => {
    const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#eab308', '#22c55e', '#64748b'];

    if (!data || data.length === 0) return <div className="h-64 w-full flex items-center justify-center text-slate-400">No pipeline data</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export const RevenueForecastChart: React.FC<{data: any[]}> = ({data}) => {
    if (!data || data.length === 0) return <div className="h-64 w-full flex items-center justify-center text-slate-400">No forecast data</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export const TrendLineChart: React.FC<{data: any[]}> = ({data}) => {
    if (!data || data.length === 0) return <div className="h-64 w-full flex items-center justify-center text-slate-400">No trend data</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}