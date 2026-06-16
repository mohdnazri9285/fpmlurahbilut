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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6'];

export default function PembajaanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pusingan, setPusingan] = useState('1');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('pembajaan')
        .select('*')
        .eq('pusingan', parseInt(pusingan));
      
      if (!error && data) {
        setData(data);
      }
      setLoading(false);
    }
    
    fetchData();
  }, [pusingan]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const totalKeperluan = data.reduce((sum, row) => sum + (row.keperluan || 0), 0);
  const totalSiap = data.reduce((sum, row) => sum + (row.siap || 0), 0);
  const totalSpreader = data.reduce((sum, row) => sum + (row.spreader || 0), 0);
  const totalManual = data.reduce((sum, row) => sum + (row.manual || 0), 0);
  const peratusSiap = totalKeperluan > 0 ? (totalSiap / totalKeperluan) * 100 : 0;

  // Data for pie chart
  const pieData = [
    { name: 'Spreader', value: totalSpreader },
    { name: 'Manual', value: totalManual },
  ];

  // Data for bar chart
  const barData = data.map(row => ({
    name: row.peringkat,
    keperluan: row.keperluan || 0,
    siap: row.siap || 0,
    peratus: row.peratus_siap || 0,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pembajaan</h1>
          <p className="text-gray-500">Data pembajaan mengikut pusingan</p>
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
            <option value="4">Pusingan 4</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Keperluan (Beg)</p>
          <p className="text-2xl font-bold text-gray-900">{totalKeperluan}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Siap (Beg)</p>
          <p className="text-2xl font-bold text-gray-900">{totalSiap}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">% Siap</p>
          <p className="text-2xl font-bold text-gray-900">{peratusSiap.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Kaedah</p>
          <p className="text-lg font-semibold text-gray-900">
            Spreader: {totalSpreader} | Manual: {totalManual}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Keperluan vs Siap (Beg)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="keperluan" fill="#eab308" name="Keperluan" />
                <Bar dataKey="siap" fill="#22c55e" name="Siap" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Kaedah Pembajaan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) => {
                    const percentage = percent ? (percent * 100).toFixed(0) : '0';
                    return `${name} ${percentage}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Butiran Pembajaan Pusingan {pusingan}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Peringkat</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Kadar (kg/pokok)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Keperluan (Beg)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Spreader</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Manual</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Siap</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">% Siap</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.peringkat}</td>
                  <td className="px-4 py-3 text-right">{row.luas?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{row.kadar?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{row.keperluan}</td>
                  <td className="px-4 py-3 text-right">{row.spreader}</td>
                  <td className="px-4 py-3 text-right">{row.manual}</td>
                  <td className="px-4 py-3 text-right">{row.siap}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.peratus_siap >= 80 ? 'bg-green-100 text-green-800' :
                      row.peratus_siap >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {row.peratus_siap}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
