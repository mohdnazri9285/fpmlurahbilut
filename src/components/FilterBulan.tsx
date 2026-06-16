'use client';

const months = [
  { value: 'all', label: 'Semua Bulan' },
  { value: 'jan', label: 'Januari' },
  { value: 'feb', label: 'Februari' },
  { value: 'mar', label: 'Mac' },
  { value: 'apr', label: 'April' },
  { value: 'may', label: 'Mei' },
  { value: 'jun', label: 'Jun' },
  { value: 'jul', label: 'Julai' },
  { value: 'aug', label: 'Ogos' },
  { value: 'sep', label: 'September' },
  { value: 'oct', label: 'Oktober' },
  { value: 'nov', label: 'November' },
  { value: 'dec', label: 'Disember' },
];

interface FilterBulanProps {
  selected: string;
  onChange: (value: string) => void;
  tahun?: string;
  onTahunChange?: (value: string) => void;
}

export default function FilterBulan({ 
  selected, 
  onChange, 
  tahun = '2025', 
  onTahunChange 
}: FilterBulanProps) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      
      {onTahunChange && (
        <select
          value={tahun}
          onChange={(e) => onTahunChange(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      )}
    </div>
  );
}
