'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import FilterBulan from '@/components/FilterBulan';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const bulanMap: Record<string, string> = {
  'jan': 'Jan',
  'feb': 'Feb', 
  'mar': 'Mac',
  'apr': 'Apr',
  'may': 'Mei',
  'jun': 'Jun',
  'jul': 'Jul',
  'aug': 'Ogo',
  'sep': 'Sep',
  'oct': 'Okt',
  'nov': 'Nov',
  'dec': 'Dis'
};

const bulanColumnMap: Record<string, string> = {
  'jan': 'hasil_jan',
  'feb': 'hasil_feb',
  'mar': 'hasil_mar',
  'apr': 'hasil_apr',
  'may': 'hasil_may',
  'jun': 'hasil_jun',
  'jul': 'hasil_jul',
  'aug': 'hasil_aug',
  'sep': 'hasil_sep',
  'oct': 'hasil_oct',
  'nov': 'hasil_nov',
  'dec': 'hasil_dec'
};

export default function HasilPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState('all');
  const [tahun, setTahun] = useState('2025');
  const [tandanData, setTandanData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const tableName = tahun === '2025' ? 'hasil_2025' : 'hasil_2026';
      let query = supabase.from(tableName).select('*');
      
      const { data, error } = await query;
      
      if (!error && data) {
        setData(data);
      }
      
      // Fetch tandan data
      const { data: tandan, error: tandanError } = await supabase
        .from('laporan_tandan')
        .select('*');
      
      if (!tandanError && tandan) {
        setTandanData(tandan);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [tahun]);

  // Process data for chart
  const getChartData = () => {
    if (bulan === 'all') {
      return data.map(row => ({
        name: row.blok,
        hasil: row.jumlah_hasil || 0,
        luas: row.luas || 0,
      }));
    }
    
    const column = bulanColumnMap[bulan];
    if (!column) return data;
    
    return data.map(row => ({
      name: row.blok,
      hasil: row[column] || 0,
      luas: row.luas || 0,
    }));
  };

  // Process monthly comparison data
  const getMonthlyData = () => {
    if (data.length === 0) return [];
    
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    return months.map(month => {
      const total = data.reduce((sum, row) => {
        const col = bulanColumnMap[month];
        return sum + (row[col] || 0);
      }, 0);
      
      return {
        name: bulanMap[month],
        hasil: total,
      };
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const chartData = getChartData();
  const monthlyData = getMonthlyData();
  const totalHasil = data.reduce((sum, row) => sum + (row.jumlah_hasil || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Hasil</h1>
          <p className="text-gray-500">Data hasil pengeluaran sawit mengikut bulan</p>
        </div>
        <FilterBulan 
          selected={bulan}
          onChange={setBulan}
          tahun={tahun}
          onTahunChange={setTahun}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="card-title">Jumlah Hasil {tahun}</p>
          <p className="card-value">{totalHasil.toFixed(2)} MT</p>
        </div>
        <div className="card">
          <p className="card-title">Bilangan Blok</p>
          <p className="card-value">{data.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Purata / Blok</p>
          <p className="card-value">{(totalHasil / data.length).toFixed(2)} MT</p>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Trend Bulanan {tahun}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hasil" stroke="#22c55e" name="Hasil (MT)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart by Block */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Hasil Mengikut Blok {bulan !== 'all' ? `- ${bulanMap[bulan]}` : '- Keseluruhan'}
        </h3>
        <div className="h-80">
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

      {/* Tandan Data Table */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Laporan Tandan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Blok</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Jumlah Tandan</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Tandan Muda</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Purata Berat (kg)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
              </tr>
            </thead>
            <tbody>
              {tandanData.slice(0, 10).map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.blok}</td>
                  <td className="px-4 py-3 text-right">{row.jumlah_tandan || 0}</td>
                  <td className="px-4 py-3 text-right">{row.jumlah_tm || 0}</td>
                  <td className="px-4 py-3 text-right">{row.purata_berat?.toFixed(2) || 0}</td>
                  <td className="px-4 py-3 text-right">{row.luas?.toFixed(2) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
