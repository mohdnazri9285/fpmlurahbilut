'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  SprayCan,
  Trees,
  Wrench,
  Users,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Hasil', href: '/hasil', icon: FileSpreadsheet },
  { name: 'Pembajaan', href: '/pembajaan', icon: SprayCan },
  { name: 'Merumput', href: '/merumput', icon: Trees },
  { name: 'Mekanisasi', href: '/mekanisasi', icon: Wrench },
  { name: 'Users', href: '/users', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-green-800 text-white h-screen p-4 fixed flex flex-col">
      <div className="text-xl font-bold mb-8 px-4 py-2 border-b border-green-700">
        🌴 FPMSB Lurah Bilut
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'hover:bg-green-700/50 text-green-100'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-green-700 pt-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-green-700/50 text-green-100 transition">
          <LogOut size={20} />
          Log Keluar
        </button>
      </div>
    </aside>
  );
}
