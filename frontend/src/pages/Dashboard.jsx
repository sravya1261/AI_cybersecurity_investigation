import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { ShieldAlert, ShieldCheck, Activity, Search, Server } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e'
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="glass-card p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-20`}>
                <Icon size={24} className="text-brand-500" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardService.getStats()
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load stats", err);
                // Fallback demo data to make UI look good if backend isn't up
                setStats({
                    "Total Incidents": 0,
                    "Critical Incidents": 0,
                    "High Risk Incidents": 0,
                    "Logs Analyzed": 0,
                    "severity_data": [],
                    "top_ips": []
                });
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse flex flex-col items-center"><Search size={40} className="text-brand-500 mb-4 animate-bounce" /><p>Scanning network telemetry...</p></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Security Posture Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time incident analysis and metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Incidents" value={stats["Total Incidents"]} icon={ShieldAlert} />
                <StatCard title="Critical Priority" value={stats["Critical Incidents"]} icon={Activity} />
                <StatCard title="High Risk Events" value={stats["High Risk Incidents"]} icon={ShieldCheck} />
                <StatCard title="Logs Parsed" value={stats["Logs Analyzed"]} icon={Server} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="glass-card p-6 lg:col-span-2 shadow-sm">
                    <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200">Incident Distribution by Severity</h3>
                    {stats.severity_data && stats.severity_data.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.severity_data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="name" stroke="#8884d8" />
                                    <YAxis stroke="#8884d8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {stats.severity_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#60a5fa'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center opacity-50 bg-slate-100 dark:bg-dark-800 rounded-lg">
                            <p>No data available</p>
                        </div>
                    )}
                </div>

                <div className="glass-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200">Top Suspicious IPs</h3>
                    <div className="space-y-4 mt-6">
                        {stats.top_ips && stats.top_ips.length > 0 ? (
                            stats.top_ips.map((ip, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-700 rounded-lg border border-slate-200 dark:border-dark-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center font-mono text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <span className="font-mono text-sm dark:text-slate-300">{ip.ip}</span>
                                    </div>
                                    <span className="font-semibold text-brand-500">{ip.count} events</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-10">No threat sources identified</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
