import React from 'react'
import Dashboard from './components/Dashboard'
import { FilterProvider } from './context/FilterContext'
import DashboardGrid from './components/DashboardGrid'
import { login } from './api/auth';

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    login()
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Auto-login failed:", err);
        setError(err.message || "Failed to connect to Odoo");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="text-xl">Connecting to Odoo at {import.meta.env.VITE_API_BASE}...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-600">
      <div className="text-xl px-10 text-center">
        Authentication Error: {error}<br />
        Please check your Odoo URL and credentials.
      </div>
    </div>;
  }

  return (
    <FilterProvider>
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-4">📊 Business Dashboard</h1>
        {/* <Dashboard /> */}
        <DashboardGrid />
      </div>
    </FilterProvider>
  )
}
