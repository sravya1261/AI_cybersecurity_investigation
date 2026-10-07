import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentsService } from '../services/api';
import { Shield, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Badge = ({ severity }) => {
    const colors = {
        Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    };

    return (
        <span className={clsx("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[severity] || colors.Low)}>
            {severity}
        </span>
    );
};

const Incidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        incidentsService.getAll()
            .then(res => {
                setIncidents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch incidents", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Detected Incidents</h1>
                <p className="text-slate-500 mt-1">Correlated security events requiring investigation.</p>
            </div>

            <div className="glass-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-dark-800/80 border-b border-gray-200 dark:border-dark-700">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">ID</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Severity</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Type</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Source IP</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Date/Time</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Loading...</td></tr>
                            ) : incidents.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No incidents detected. Upload logs or load sample data.</td></tr>
                            ) : (
                                incidents.map(inc => (
                                    <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono">INC-{inc.id.toString().padStart(4, '0')}</td>
                                        <td className="px-6 py-4"><Badge severity={inc.severity} /></td>
                                        <td className="px-6 py-4 font-medium">{inc.incident_type}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{inc.source_ip || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(inc.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/incidents/${inc.id}`)}
                                                className="flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium"
                                            >
                                                Investigate
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Incidents;
