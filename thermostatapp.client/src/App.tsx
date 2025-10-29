import { useState } from 'react';
import ReadingForm from './components/ReadingForm';
import ReadingList from './components/ReadingList';


export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold">Thermostat Readings</h1>
                    <p className="text-gray-600">Add a reading and see the latest 20, newest first.</p>
                </header>
                <ReadingForm onCreated={() => setRefreshKey(k => k + 1)} />
                <ReadingList refreshKey={refreshKey} />
            </div>
        </div>
    );
}