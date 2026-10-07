import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings as SettingsIcon, ShieldCheck, Database, Key } from 'lucide-react';

const Settings = () => {
    const { theme, toggleTheme } = useAppContext();

    // In a real app, these would come from an API endpoint that checks server status
    const aiConfigured = false;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon /> Platform Settings</h1>
                <p className="text-slate-500 mt-1">Configure application preferences and view system status.</p>
            </div>

            <div className="glass-card">
                <div className="border-b border-gray-200 dark:border-dark-700 p-6 flex items-start gap-4">
                    <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500 text-center flex-shrink-0">
                        <Key size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-semibold text-lg">AI Provider Status</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">Connection status to external GenAI endpoints like OpenAI or local LLMs.</p>

                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${aiConfigured ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {aiConfigured ? (
                                <><span>Configured (External API)</span></>
                            ) : (
                                <><span>Not Configured — Local Fallback Active</span></>
                            )}
                        </div>
                        {!aiConfigured && (
                            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
                                The system is currently using deterministic local analysis for incident investigations. This allows the application to function fully for educational and demonstration purposes without requiring a paid API key.
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-dark-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                        <h3 className="font-semibold">User Interface</h3>
                        <p className="text-sm text-slate-500 mt-1">Toggle between SOC Dark Mode and regular Light Mode.</p>
                    </div>
                    <button onClick={toggleTheme} className="btn-secondary whitespace-nowrap">
                        Switch to {theme === 'dark' ? 'Light' : 'SOC Dark'} Mode
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700 flex items-center gap-4">
                        <Database className="text-slate-400" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Database</p>
                            <p className="font-medium">SQLite (Local)</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700 flex items-center gap-4">
                        <ShieldCheck className="text-emerald-500" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core Services</p>
                            <p className="font-medium text-emerald-600 dark:text-emerald-400">Running / Healthy</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12 text-slate-500 text-sm">
                <p>AI Cybersecurity Incident Investigator v1.0.0</p>
                <p>Academic Final Year Project</p>
            </div>
        </div>
    );
};

export default Settings;
