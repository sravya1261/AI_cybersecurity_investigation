import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadLogs from './pages/UploadLogs';
import Incidents from './pages/Incidents';
import IncidentDetails from './pages/IncidentDetails';
import Investigation from './pages/Investigation';
import Reports from './pages/Reports';
import SampleData from './pages/SampleData';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full relative">
          <Navbar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadLogs />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/incidents/:id" element={<IncidentDetails />} />
              <Route path="/incidents/:id/investigate" element={<Investigation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sample-data" element={<SampleData />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div className="text-center py-20">Page not found</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
