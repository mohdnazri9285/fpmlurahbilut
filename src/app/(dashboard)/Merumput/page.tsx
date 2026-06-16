'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function MerumputPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pusingan, setPusingan] = useState('1');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('merumput')
        .select('*');
      
      if (!error && data) {
        setData(data);
      }
      setLoading(false);
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const pusinganMap: Record<string, string> = {
    '1': 'pusingan_1',
    '2': 'pusingan_2',
    '3': 'pusingan_3',
  };

  const column = pusinganMap[pusingan] || 'pusingan_1';
  
  const totalLuas = data.reduce((sum, row) => sum + (row.luas || 0), 0);
  const totalSiap = data.reduce((sum, row) => sum + (row[column] || 0), 0);
  const peratusSiap = totalLuas > 0 ? (totalSiap / totalLuas) * 100 : 0;

  const chartData = data.map(row => ({
    name: row.peringkat,
    luas: row.luas || 0,
    siap: row[column] || 0,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merumput</h1>
          <p className="text-gray-500">Data aktiviti merumput mengikut pusingan</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Pusingan:</label>
          <select
            value={pusingan}
            onChange={(e) => setPusingan(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500"
          >
            <option value="1">Pusingan 1</option>
            <option value="2">Pusingan 2</option>
            <option value="3">Pusingan 3</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="card-title">Jumlah Luas</p>
          <p className="card-value">{totalLuas.toFixed(2)} Ha</p>
        </div>
        <div className="card">
          <p className="card-title">Siap (Pusingan {pusingan})</p>
          <p className="card-value">{totalSiap.toFixed(2)} Ha</p>
        </div>
        <div className="card">
          <p className="card-title">% Siap</p>
          <p className="card-value">{peratusSiap.toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Luas vs Siap (Pusingan {pusingan})</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="luas" fill="#3b82f6" name="Luas (Ha)" />
              <Bar dataKey="siap" fill="#22c55e" name="Siap (Ha)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Butiran Merumput</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Peringkat</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Pusingan 1</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Pusingan 2</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Pusingan 3</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.peringkat}</td>
                  <td className="px-4 py-3 text-right">{row.luas?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{row.pusingan_1?.toFixed(2) || 0}</td>
                  <td className="px-4 py-3 text-right">{row.pusingan_2?.toFixed(2) || 0}</td>
                  <td className="px-4 py-3 text-right">{row.pusingan_3?.toFixed(2) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
