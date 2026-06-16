'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  Package, 
  Target,
  Leaf,
  Calendar,
  ArrowUp,
} from 'lucide-react';
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
  Cell,
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];

export default function DashboardPage() {
  const [hasil2025, setHasil2025] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('hasil_2025')
        .select('*');
      
      if (!error && data) {
        setHasil2025(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  // ===== STATISTIK =====
  const totalHasil = hasil2025.reduce((sum, row) => sum + (row.jumlah_hasil || 0), 0);
  const totalBlok = hasil2025.length;
  const totalLuas = hasil2025.reduce((sum, row) => sum + (row.luas || 0), 0);
  const purataPencapaian = hasil2025.reduce((sum, row) => sum + (row.pencapaian || 0), 0) / totalBlok;

  // ===== DATA UNTUK CHART =====
  const chartData = hasil2025.map(row => ({
    name: row.blok,
    hasil: row.jumlah_hasil || 0,
    luas: row.luas || 0,
  })).slice(0, 12);

  // ===== PIE CHART DATA =====
  const peringkatData = hasil2025.reduce((acc: any, row) => {
    const key = row.peringkat || 'Lain';
    if (!acc[key]) acc[key] = 0;
    acc[key] += row.jumlah_hasil || 0;
    return acc;
  }, {});

  const pieData = Object.entries(peringkatData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Ringkasan operasi ladang Lurah Bilut</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="border rounded-lg px-4 py-2 text-sm bg-white">
            <option>2025</option>
            <option>2026</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            {new Date().toLocaleDateString('ms-MY', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Jumlah Hasil</p>
              <p className="text-2xl font-bold text-gray-900">{totalHasil.toFixed(2)} <span className="text-sm font-normal text-gray-500">MT</span></p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <ArrowUp size={14} />
            +12.5% dari tahun lepas
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Jumlah Blok</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlok}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {totalLuas.toFixed(2)} Hektar
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Purata Pencapaian</p>
              <p className="text-2xl font-bold text-gray-900">{purataPencapaian.toFixed(2)} <span className="text-sm font-normal text-gray-500">Tan/Ha</span></p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Target className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <ArrowUp size={14} />
            +8.3% dari target
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Peringkat Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(peringkatData).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Leaf className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Sawit: ML161
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Hasil Mengikut Blok</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hasil" fill="#22c55e" name="Hasil (MT)" />
                <Bar dataKey="luas" fill="#3b82f6" name="Luas (Ha)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Hasil Mengikut Peringkat</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Data Hasil 2025</h3>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Cari blok..." 
              className="border rounded-lg px-3 py-1 text-sm"
            />
            <select className="border rounded-lg px-3 py-1 text-sm bg-white">
              <option>Semua Peringkat</option>
              <option>1G</option>
              <option>1A</option>
              <option>1D</option>
              <option>2G</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Peringkat</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Blok</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Jumlah Hasil (MT)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Pencapaian (Tan/Ha)</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {hasil2025.map((row, index) => {
                const status = row.pencapaian >= 17 ? 'Excellent' : 
                              row.pencapaian >= 15 ? 'Good' : 
                              row.pencapaian >= 12 ? 'Average' : 'Below';
                const statusColor = status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                   status === 'Good' ? 'bg-blue-100 text-blue-800' :
                                   status === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800';
                
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{row.peringkat}</td>
                    <td className="px-4 py-3 font-medium">{row.blok}</td>
                    <td className="px-4 py-3 text-right">{row.luas?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{row.jumlah_hasil?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{row.pencapaian?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Menunjukkan {hasil2025.length} blok
        </div>
      </div>
    </div>
  );
}
