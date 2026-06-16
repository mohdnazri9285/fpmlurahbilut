'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wrench, Truck, Tractor, Sprout, Scissors, SprayCan } from 'lucide-react';

const iconMap: Record<string, any> = {
  'KOMODO C700': Truck,
  'CARABAO G350': Truck,
  '3-WHEELER': Truck,
  'TIGER G1500': Truck,
  'PALM CUTTER': Scissors,
  'TRACTOR MOUNTED SPREADER': Tractor,
  'MISTBLOWER': SprayCan,
  'TRACTOR MOUNTED GRASSCUTTER': Sprout,
};

export default function MekanisasiPage() {
  const [jentera, setJentera] = useState<any[]>([]);
  const [ratio, setRatio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: jenteraData } = await supabase
        .from('mekanisasi')
        .select('*');
      
      const { data: ratioData } = await supabase
        .from('mekanisasi_ratio')
        .select('*');
      
      if (jenteraData) setJentera(jenteraData);
      if (ratioData) setRatio(ratioData);
      setLoading(false);
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mekanisasi</h1>
        <p className="text-gray-500">Senarai jentera dan peralatan ladang</p>
      </div>

      {/* Jentera Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {jentera.map((item, index) => {
          const Icon = iconMap[item.jentera] || Wrench;
          return (
            <div key={index} className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.aplikasi}</p>
                <p className="font-semibold text-gray-900">{item.jentera}</p>
                <p className="text-sm text-gray-600">{item.jumlah} unit</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ratio Table */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Nisbah Jentera Penuaian</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Peringkat</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Bil. Jentera</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Ratio (Ha/Jentera)</th>
              </tr>
            </thead>
            <tbody>
              {ratio.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.peringkat}</td>
                  <td className="px-4 py-3 text-right">{row.luas?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{row.bil_jentera}</td>
                  <td className="px-4 py-3 text-right">{row.ratio?.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
