import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logsService } from '../services/api';
import { UploadCloud, CheckCircle, AlertCircle, FileType } from 'lucide-react';

const UploadLogs = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccess(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const res = await logsService.upload(file);
            setSuccess(`Successfully parsed ${file.name}. Created ${res.data.incidents_created} incidents.`);
            setTimeout(() => {
                navigate('/incidents');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during upload and parsing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pt-10">
            <div>
                <h1 className="text-2xl font-bold">Upload Security Logs</h1>
                <p className="text-slate-500 mt-2">Upload CSV or JSON logs for AI-powered threat detection and correlation.</p>
            </div>

            <div className="glass-card p-8 text-center">
                <div className="border-2 border-dashed border-slate-300 dark:border-dark-600 rounded-xl p-12 transition hover:bg-slate-50 dark:hover:bg-dark-700/50">
                    <input
                        type="file"
                        id="log-upload"
                        className="hidden"
                        accept=".csv,.json,.log,.txt"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="log-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Drag and drop or click to browse</h3>
                        <p className="text-sm text-slate-500">Supports .CSV, .JSON, .LOG formats up to 50MB</p>
                    </label>
                </div>

                {file && (
                    <div className="mt-8 flex items-center justify-between p-4 bg-slate-100 dark:bg-dark-800 rounded-lg text-left">
                        <div className="flex items-center gap-3">
                            <FileType className="text-slate-500" />
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Analyzing..." : "Analyze Logs"}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-3 text-left border border-red-200 dark:border-red-900">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-start gap-3 text-left border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-medium">{success}</p>
                            <p className="text-xs mt-1">Redirecting to incidents panel...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadLogs;
