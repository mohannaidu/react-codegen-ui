import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
    const [problem, setProblem] = useState('');
    const [pattern, setPattern] = useState('Strategy');
    const [language, setLanguage] = useState('Java');
    const [code, setCode] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : '';
    }, [darkMode]);

    const generateCode = async () => {
        try {
            const res = await axios.post('/api/generate', { problem, pattern, language });
            setCode(res.data);
            setHistory([{ problem, pattern, language, code: res.data, timestamp: new Date().toISOString() }, ...history]);
        } catch {
            setCode('// Error generating code.');
        }
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `generated-code.${language.toLowerCase()}`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">⚙️ Design Pattern Generator</h1>
                </div>

                <textarea
                    placeholder="Describe the problem..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full p-4 border rounded-md text-base"
                />

                <div className="flex gap-4 flex-wrap">
                    <select value={pattern} onChange={(e) => setPattern(e.target.value)} className="p-2 rounded border">
                        <option>Strategy</option>
                        <option>Factory</option>
                        <option>Singleton</option>
                    </select>

                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 rounded border">
                        <option>Java</option>
                        <option>Python</option>
                        <option>TypeScript</option>
                    </select>

                    <button onClick={generateCode} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                        Generate Code
                    </button>

                    <button onClick={() => setDarkMode(!darkMode)} className="border px-4 py-2 rounded">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>

                {code && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                        <h2 className="font-semibold mb-2">Generated Code</h2>
                        <pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{code}</pre>
                        <button onClick={downloadCode} className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                            Download
                        </button>
                    </div>
                )}

                {history.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                        <h2 className="font-semibold mb-3">History</h2>
                        <ul className="text-sm space-y-1">
                            {history.map((item, i) => (
                                <li key={i} className="border-b border-gray-300 dark:border-gray-700 pb-1">
                                    <strong>{item.language}</strong> using <em>{item.pattern}</em> — {new Date(item.timestamp).toLocaleString()}
                                    <div className="text-xs mt-1">{item.problem}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
