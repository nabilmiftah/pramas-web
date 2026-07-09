import React from 'react';

const DashboardAdmin = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* HEADER DASHBOARD ADMIN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0f291e]">Ringkasan Operasional</h2>
          <p className="text-gray-500 mt-1 text-sm">Memantau aktivitas pendakian hari ini, 24 Oktober 2024.</p>
        </div>
        <button className="flex items-center bg-[#eef2f6] text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-200">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          Pos 1: Cerah Berawan, 18°C
        </button>
      </div>

      {/* GRID ATAS: 3 KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KARTU 1: Total Pendaki Aktif */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="bg-[#eaf8f1] p-2.5 rounded-lg">
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <span className="bg-[#b8f2c3] text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-md flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              12%
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Total Pendaki Aktif</p>
            <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">1,245</h3>
          </div>
        </div>

        {/* KARTU 2: Menunggu Verifikasi */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Menunggu Verifikasi</p>
            <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">34</h3>
          </div>
        </div>

        {/* KARTU 3: Sisa Kuota Hari Ini */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
          {/* Aksen Latar */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 pointer-events-none"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="bg-[#eaf8f1] p-2.5 rounded-lg">
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <span className="text-red-600 text-xs font-bold">Hampir Penuh</span>
          </div>
          <div className="relative z-10">
            <p className="text-xs text-gray-500 font-semibold mb-1">Sisa Kuota Hari Ini</p>
            <div className="flex items-baseline gap-1 mb-2">
              <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">85</h3>
              <span className="text-gray-400 font-medium">/ 500</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#0f291e] h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* GRID BAWAH: GRAFIK & AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (LEBAR): Tren Pendaki */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#0f291e]">Tren Pendaki Mingguan</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>

          {/* Area Wireframe Chart */}
          <div className="h-[300px] w-full flex flex-col justify-between relative pt-4">
            {/* Garis Horizontal */}
            <div className="border-t border-dashed border-gray-200 w-full"></div>
            <div className="border-t border-dashed border-gray-200 w-full"></div>
            <div className="border-t border-dashed border-gray-200 w-full"></div>
            <div className="border-t border-dashed border-gray-200 w-full"></div>
            
            {/* Label Hari di sumbu X */}
            <div className="flex justify-between text-xs font-semibold text-gray-400 px-2 mt-2">
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span className="text-[#0f291e] relative">
                Jum
                {/* Tooltip Dummy di hari Jumat */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a202c] text-white text-[10px] py-1 px-2 rounded">255</div>
              </span>
              <span>Sab</span>
              <span>Min</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SEMPIT): Aktivitas Terkini */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
              <h3 className="text-xl font-bold text-[#0f291e]">Aktivitas Terkini</h3>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Item 1: Verifikasi */}
            <div className="flex items-start">
              <div className="bg-[#eaf8f1] p-2 rounded-full mr-4 flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f291e]">Pemesanan #BK-1029 diverifikasi</p>
                <p className="text-xs text-gray-500 mt-1">Oleh Admin Rangga di Pos Masuk</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">2 menit yang lalu</p>
              </div>
            </div>

            {/* Item 2: Peringatan */}
            <div className="flex items-start bg-red-50 p-4 rounded-xl border border-red-100 -mx-2">
              <div className="bg-white p-2 rounded-full mr-4 flex-shrink-0 text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">Peringatan Cuaca Dikeluarkan</p>
                <p className="text-xs text-red-600 mt-1">Angin kencang terpantau di atas Pos 3. Pendakian ditahan sementara.</p>
                <p className="text-[10px] text-red-500 mt-2 font-medium">15 menit yang lalu</p>
              </div>
            </div>

            {/* Item 3: Grup Baru */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-full mr-4 flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f291e]">Pendaftaran Grup Baru</p>
                <p className="text-xs text-gray-500 mt-1">Grup 'Jejak Alam' (5 orang) mendaftar untuk besok.</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">45 menit yang lalu</p>
              </div>
            </div>

            {/* Item 4: Check-out */}
            <div className="flex items-start">
              <div className="bg-[#eaf8f1] p-2 rounded-full mr-4 flex-shrink-0 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f291e]">Pendaki Check-out</p>
                <p className="text-xs text-gray-500 mt-1">Rombongan #BK-0988 (12 orang) telah turun dengan selamat.</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">1 jam yang lalu</p>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-gray-50 text-center">
            <button className="text-sm font-bold text-emerald-700 hover:underline">Lihat Semua Log</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardAdmin;