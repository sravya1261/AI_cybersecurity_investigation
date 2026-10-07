import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UploadCloud,
    AlertTriangle,
    Search,
    FileText,
    Database,
    Settings,
    Shield
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Upload Logs', path: '/upload', icon: UploadCloud },
        { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Sample Data', path: '/sample-data', icon: Database },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 h-screen shrink-0 glass-card rounded-none border-t-0 border-b-0 border-l-0 flex flex-col pt-4 pb-6 sticky top-0">
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight tracking-tight text-brand-500">CyberSec</h1>
                    <span className="text-xs text-slate-500 dark:text-dark-600 font-medium tracking-wide">INVESTIGATOR</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-brand-500/10 text-brand-500 dark:text-brand-400"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-dark-700/50"
                            )}
                        >
                            <Icon size={18} className={isActive ? "text-brand-500" : "opacity-70"} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="px-6 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700">
                    <p className="text-xs font-semibold text-slate-300 mb-1">System Status</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Backend Online
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
