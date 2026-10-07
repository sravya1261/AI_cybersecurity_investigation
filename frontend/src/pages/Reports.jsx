import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/api';
import { FileText, Download, Eye, FileDown } from 'lucide-react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        reportsService.getAll()
            .then(res => {
                setReports(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load reports", err);
                setLoading(false);
            });
    }, []);

    const fetchReportContent = async (id) => {
        try {
            const res = await reportsService.getById(id);
            setSelectedReport(res.data);
        } catch (e) {
            console.error("Failed to fetch report text", e);
        }
    }

    const downloadMarkdown = () => {
        if (!selectedReport) return;
        const blob = new Blob([selectedReport.content_markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Incident_${selectedReport.incident_id}_Report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><FileText /> Investigation Reports</h1>
                <p className="text-slate-500 mt-1">Generated markdown reports for finalized investigations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="glass-card flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 font-semibold">
                        Generated Reports
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        {loading ? (
                            <p className="text-center p-4 text-slate-500">Loading...</p>
                        ) : reports.length === 0 ? (
                            <p className="text-center p-4 text-slate-500">No reports generated yet.</p>
                        ) : (
                            reports.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => fetchReportContent(r.id)}
                                    className={`w-full text-left p-3 rounded-lg mb-1 transition flex items-center justify-between ${selectedReport?.id === r.id ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-dark-700'}`}
                                >
                                    <div className="truncate pr-4">
                                        <p className="font-medium text-sm truncate">{r.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <Eye size={16} className="shrink-0 opacity-50" />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card md:col-span-2 flex flex-col overflow-hidden">
                    {selectedReport ? (
                        <>
                            <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{selectedReport.title}</h3>
                                    <p className="text-xs text-slate-500">Generated {new Date(selectedReport.created_at).toLocaleString()}</p>
                                </div>
                                <button className="btn-primary py-1.5 px-3 text-sm" onClick={downloadMarkdown}>
                                    <FileDown size={16} /> Export MD
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-dark-900 border border-transparent dark:border-dark-700 m-4 rounded-xl shadow-inner">
                                {selectedReport.content_markdown}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>Select a report to preview.</p>
                            <p className="text-sm mt-2 opacity-70">Reports are generated from the Incident Details page after an AI investigation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
