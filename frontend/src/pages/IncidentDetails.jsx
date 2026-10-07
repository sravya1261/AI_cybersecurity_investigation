import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentsService } from '../services/api';
import { AlertTriangle, Clock, Server, User, Crosshair, ArrowRight, Activity, Terminal } from 'lucide-react';
import clsx from 'clsx';

const SeverityBadge = ({ severity }) => {
    const colors = {
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-emerald-500 text-white'
    };
    return (
        <span className={clsx("px-3 py-1 text-sm font-bold uppercase rounded-md shadow-sm tracking-wide", colors[severity] || colors.Low)}>
            {severity} SEVERITY
        </span>
    );
};

const IncidentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        incidentsService.getById(id)
            .then(res => {
                setIncident(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch incident details", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading incident data...</div>;
    if (!incident) return <div className="text-center py-20 text-slate-500">Incident not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <AlertTriangle className={clsx("shrink-0", incident.severity === 'Critical' || incident.severity === 'High' ? 'text-red-500' : 'text-yellow-500')} size={32} />
                        INC-{incident.id.toString().padStart(4, '0')}: {incident.incident_type}
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2 font-mono text-sm">
                        <Clock size={14} /> Created {new Date(incident.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SeverityBadge severity={incident.severity} />
                    <button
                        onClick={() => navigate(`/incidents/${id}/investigate`)}
                        className="btn-primary"
                    >
                        <Terminal size={18} />
                        AI Investigator
                    </button>
                    <button
                        onClick={() => navigate(`/reports`)} // Ideally would trigger generation instantly
                        className="btn-secondary"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 md:col-span-1 space-y-6">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 border-b border-gray-100 dark:border-dark-700 pb-2">Overview</h3>

                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Server size={14} /> Source IP</p>
                        <p className="font-mono text-sm">{incident.source_ip || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><User size={14} /> Affected User</p>
                        <p className="font-mono text-sm">{incident.affected_user || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Crosshair size={14} /> Confidence Score</p>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5 mt-2">
                            <div className="bg-brand-500 h-2.5 rounded-full" style={{ width: `${(incident.confidence || 0) * 100}%` }}></div>
                        </div>
                        <p className="text-right text-xs mt-1 font-mono">{(incident.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Activity size={14} /> Status</p>
                        <p className="text-sm font-medium">{incident.status}</p>
                    </div>
                </div>

                <div className="glass-card p-6 md:col-span-3">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-brand-500" />
                        Incident Timeline
                    </h3>

                    <div className="relative border-l-2 border-gray-200 dark:border-dark-700 ml-3 space-y-8 pb-4">
                        {incident.timeline && incident.timeline.length > 0 ? (
                            incident.timeline.map((item, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className={clsx(
                                        "absolute -left-[5px] top-1.5 w-2 h-2 rounded-full",
                                        item.type === 'danger' ? 'bg-red-500 ring-4 ring-red-100 dark:ring-red-900/30' :
                                            item.type === 'success' ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/30' :
                                                'bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-900/30'
                                    )} />
                                    <p className="text-xs font-mono text-slate-500 mb-1">{new Date(item.time).toLocaleString()}</p>
                                    <p className="font-semibold">{item.content}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-dark-700 p-2 rounded border border-gray-100 dark:border-dark-600 font-mono inline-block">
                                        {item.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="pl-6 text-slate-500">No structured timeline generated.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Raw Associated Events ({incident.events?.length || 0})</h3>
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-left text-sm font-mono">
                        <thead className="bg-slate-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-xs text-slate-500">Time</th>
                                <th className="px-4 py-2 text-xs text-slate-500">Source IP</th>
                                <th className="px-4 py-2 text-xs text-slate-500">User</th>
                                <th className="px-4 py-2 text-xs text-slate-500">Action</th>
                                <th className="px-4 py-2 text-xs text-slate-500">Status</th>
                                <th className="px-4 py-2 text-xs text-slate-500">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-700 text-xs">
                            {incident.events?.slice(0, 100).map((ev, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-dark-700/50">
                                    <td className="px-4 py-2 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2">{ev.source_ip}</td>
                                    <td className="px-4 py-2">{ev.username}</td>
                                    <td className="px-4 py-2">{ev.action}</td>
                                    <td className={clsx("px-4 py-2 font-bold", ev.status === 'failed' ? 'text-red-500' : ev.status === 'success' ? 'text-emerald-500' : '')}>{ev.status}</td>
                                    <td className="px-4 py-2 max-w-xs truncate" title={ev.message}>{ev.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncidentDetails;
