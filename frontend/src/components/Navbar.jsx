import { useAppContext } from '../context/AppContext';
import { MoonIcon, SunIcon, BellIcon, UserCircle } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useAppContext();

    return (
        <header className="h-16 glass-card rounded-none border-t-0 border-l-0 border-r-0 flex items-center justify-between px-8 sticky top-0 z-10 w-full transition-colors">

            <div className="flex items-center">
                <h2 className="text-xl font-semibold opacity-90">AI Incident Analysis Platform</h2>
            </div>

            <div className="flex items-center gap-4">

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-dark-700 transition"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <SunIcon size={20} className="text-slate-300" /> : <MoonIcon size={20} className="text-slate-600" />}
                </button>

                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-dark-700 transition">
                    <BellIcon size={20} className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} />
                </button>

                <div className="h-8 w-[1px] bg-gray-300 dark:bg-dark-600 mx-2"></div>

                <button className="flex items-center gap-2 hover:opacity-80 transition">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center">
                        <UserCircle size={20} />
                    </div>
                    <span className="text-sm font-medium">Analyst</span>
                </button>
            </div>

        </header>
    );
};

export default Navbar;
