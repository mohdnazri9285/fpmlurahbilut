export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🌴 FPMSB Lurah Bilut</h1>
          <div className="text-sm">
            <span className="opacity-75">Dashboard Operasi</span>
          </div>
        </div>
      </nav>
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  )
}