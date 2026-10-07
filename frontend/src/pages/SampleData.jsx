import React, { useState, useEffect } from 'react';
import { sampleDataService } from '../services/api';
import { Database, DownloadCloud, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SampleData = () => {
    const [datasets, setDatasets] = useState([]);
    const [loadingSet, setLoadingSet] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        sampleDataService.getAll().then(res => setDatasets(res.data)).catch(console.error);
    }, []);

    const handleLoad = async (id) => {
        setLoadingSet(id);
        setSuccess(null);
        try {
            await sampleDataService.load(id);
            setSuccess(`Successfully loaded and analyzed ${id}!`);
            setTimeout(() => {
                navigate('/incidents');
            }, 2000);
        } catch (e) {
            console.error("Failed to load dataset", e);
            alert("Error loading dataset.");
        } finally {
            setLoadingSet(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-10">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database size={32} />
                </div>
                <h1 className="text-2xl font-bold">Sample Datasets</h1>
                <p className="text-slate-500 mt-2 max-w-lg mx-auto">Load synthetic cybersecurity datasets to test the AI detection, correlation, and investigation capabilities of the platform.</p>
            </div>

            {success && (
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center gap-2 font-medium mb-6 animate-pulse">
                    <CheckCircle size={20} />
                    {success} Redirecting...
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {datasets.map(ds => (
                    <div key={ds.id} className="glass-card p-6 flex flex-col items-start hover:border-brand-500/50 transition-colors">
                        <h3 className="font-bold text-lg">{ds.name}</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6 flex-1">{ds.description}</p>
                        <button
                            onClick={() => handleLoad(ds.id)}
                            disabled={loadingSet !== null}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 w-full justify-center transition-colors disabled:opacity-50"
                        >
                            {loadingSet === ds.id ? <><div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> Parsing...</> : <><DownloadCloud size={16} /> Load & Analyze</>}
                        </button>
                    </div>
                ))}

                {datasets.length === 0 && (
                    <div className="col-span-2 text-center text-slate-500 py-10">
                        Unable to load datasets from backend.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SampleData;
