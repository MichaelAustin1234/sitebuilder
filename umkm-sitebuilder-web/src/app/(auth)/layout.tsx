export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">UMKM Sitebuilder</h1>
          <p className="text-gray-500 mt-1 text-sm">Buat website bisnis kamu dalam menit</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

