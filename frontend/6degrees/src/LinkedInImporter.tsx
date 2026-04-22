import React, { useState } from 'react';
import { Upload, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface ImportStats {
  total: number;
  imported: number;
  duplicates: number;
}

interface ConnectionStats {
  total_connections: string;
  unique_companies: string;
  unique_industries: string;
}

export const LinkedInImporter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportStats | null>(null);
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file from LinkedIn');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      
      // Parse CSV client-side
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const connections = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const record: any = {};
        headers.forEach((header, idx) => {
          record[header] = values[idx] || '';
        });
        
        return {
          name: `${record['First Name'] || ''} ${record['Last Name'] || ''}`.trim(),
          email: record['Email Address'] || '',
          company: record['Company'] || '',
          position: record['Position'] || '',
          linkedin_url: '',
          connection_degree: '1st'
        };
      }).filter(conn => conn.name);

      // Send to backend
      const res = await axios.post(
        'http://localhost:3001/api/linkedin/import',
        { connections },
        { headers: { 'x-tenant-id': TENANT_ID } }
      );

      setImportResult(res.data);
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.details || 'Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/linkedin/stats', {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Connections</p>
            </div>
            <p className="text-2xl font-black text-white">{stats.total_connections}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unique Companies</p>
            </div>
            <p className="text-2xl font-black text-white">{stats.unique_companies}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-amber-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Industries</p>
            </div>
            <p className="text-2xl font-black text-white">{stats.unique_industries}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-800 bg-slate-900/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
          id="csv-upload"
        />
        
        <Upload size={48} className="mx-auto mb-4 text-slate-600" />
        <h3 className="text-lg font-bold text-white mb-2">Import LinkedIn Connections</h3>
        <p className="text-sm text-slate-400 mb-4">
          Export your connections from LinkedIn and upload the CSV here
        </p>
        
        <label
          htmlFor="csv-upload"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
        >
          <Upload size={16} />
          {importing ? 'Importing...' : 'Choose CSV File'}
        </label>

        <p className="text-[10px] text-slate-500 mt-4">
          Drag & drop or click to browse
        </p>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={20} className="text-emerald-400" />
            <h4 className="font-bold text-white">Import Complete</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Total</p>
              <p className="font-bold text-white">{importResult.total}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Imported</p>
              <p className="font-bold text-emerald-400">{importResult.imported}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Duplicates</p>
              <p className="font-bold text-amber-400">{importResult.duplicates}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-rose-400" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">How to export from LinkedIn:</h4>
        <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
          <li>Go to LinkedIn Settings & Privacy</li>
          <li>Click "Data privacy" → "Get a copy of your data"</li>
          <li>Select "Connections" and request archive</li>
          <li>Download the CSV when ready (usually takes 10-15 minutes)</li>
        </ol>
      </div>
    </div>
  );
};
