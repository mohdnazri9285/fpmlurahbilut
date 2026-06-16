'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [hasil2025, setHasil2025] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('hasil_2025')
        .select('*')
      
      if (!error && data) {
        setHasil2025(data)
      }
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  // Kira statistik
  const totalHasil = hasil2025.reduce((sum, row) => sum + (row.jumlah_hasil || 0), 0)
  const totalBlok = hasil2025.length
  const purataPencapaian = hasil2025.reduce((sum, row) => sum + (row.pencapaian || 0), 0) / totalBlok

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        🌴 Dashboard Operasi Ladang Lurah Bilut
      </h1>
      
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 font-medium">Jumlah Hasil 2025</h3>
          <p className="text-2xl font-bold text-green-700">
            {totalHasil.toFixed(2)} <span className="text-sm font-normal text-gray-500">MT</span>
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 font-medium">Jumlah Blok</h3>
          <p className="text-2xl font-bold text-blue-700">
            {totalBlok} <span className="text-sm font-normal text-gray-500">Blok</span>
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 font-medium">Purata Pencapaian</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {purataPencapaian.toFixed(2)} <span className="text-sm font-normal text-gray-500">Tan/Ha</span>
          </p>
        </div>
      </div>

      {/* Jadual Ringkas */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Peringkat</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Blok</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Luas (Ha)</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Jumlah Hasil (MT)</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Pencapaian (Tan/Ha)</th>
            </tr>
          </thead>
          <tbody>
            {hasil2025.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{row.peringkat}</td>
                <td className="px-4 py-2">{row.blok}</td>
                <td className="px-4 py-2 text-right">{row.luas?.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{row.jumlah_hasil?.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{row.pencapaian?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasil2025.length > 10 && (
          <div className="px-4 py-2 text-sm text-gray-500 border-t text-center">
            + {hasil2025.length - 10} blok lagi
          </div>
        )}
      </div>
    </div>
  )
}