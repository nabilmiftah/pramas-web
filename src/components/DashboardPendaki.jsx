import React from 'react';

const DashboardPendaki = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700 mb-1">Pendaki Aktif</p>
          <h2 className="text-3xl font-bold text-[#0f291e]">Selamat Datang, Budi!</h2>
        </div>
        <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100 font-medium text-sm">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Status: Siap Mendaki
        </div>
      </div>

      {/* GRID KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === KOLOM KIRI (LEBAR) - Span 2 === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KARTU 1: TIKET MENDATANG */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            {/* Latar belakang aksen tipis */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="bg-[#b8f2c3] text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">Mendatang</span>
              <div className="flex items-center text-sm font-semibold text-gray-600">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                24 Okt 2024
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0f291e] mb-1">Gunung Prau</h3>
                <div className="flex items-center text-gray-500 text-sm font-medium mb-8">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Jalur Patak Banteng
                </div>

                <div className="border-t border-gray-100 pt-6 flex gap-12">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Anggota</p>
                    <p className="font-bold text-[#0f291e]">4 Orang</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Kode Booking</p>
                    <p className="font-bold text-emerald-700">PRU-892A-X1</p>
                  </div>
                </div>
              </div>

              {/* Area QR Code */}
              <div className="bg-[#f0f4f8] p-4 rounded-xl flex flex-col items-center justify-center w-40 flex-shrink-0">
                <div className="bg-white p-2 rounded-lg mb-3 shadow-sm w-full aspect-square flex items-center justify-center border border-gray-100">
                  {/* Ilustrasi QR Code sederhana */}
                  <svg className="w-16 h-16 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h-2v2h2v-2zm-2 2h-2v2h2v-2zm2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z"/>
                  </svg>
                </div>
                <p className="text-[10px] text-center font-semibold text-gray-500 leading-tight">Tunjukkan QR ini di Basecamp</p>
              </div>
            </div>
          </div>

          {/* KARTU 2: PERSIAPAN PENDAKIAN */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <h3 className="text-xl font-bold text-[#0f291e]">Persiapan Pendakian</h3>
              </div>
              <span className="bg-[#b8f2c3] text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">2/3 Selesai</span>
            </div>

            <div className="space-y-4">
              {/* Checklist 1 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-emerald-600 text-white rounded-full p-1 mr-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Dokumen Identitas (KTP)</p>
                    <p className="text-xs text-gray-500 mt-0.5">Terverifikasi oleh sistem</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-sm">Valid</span>
              </div>

              {/* Checklist 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-emerald-600 text-white rounded-full p-1 mr-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Surat Keterangan Sehat</p>
                    <p className="text-xs text-gray-500 mt-0.5">Berlaku hingga 30 Okt 2024</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-sm">Valid</span>
              </div>

              {/* Checklist 3 (Belum Selesai) */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-red-200 shadow-sm">
                <div className="flex items-center">
                  <div className="border-2 border-red-400 rounded-full w-6 h-6 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Pengecekan Perlengkapan</p>
                    <p className="text-xs text-gray-500 mt-0.5">Wajib dilakukan di Basecamp</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 font-bold text-xs px-3 py-1 rounded-md">Belum</span>
              </div>
            </div>
          </div>

        </div>

        {/* === KOLOM KANAN (SEMPIT) - Span 1 === */}
        <div className="space-y-6">
          
          {/* KARTU 3: KONDISI TERKINI */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center text-sm font-bold text-[#0f291e]">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                Kondisi Terkini
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center mb-6">
              <h2 className="text-6xl font-bold text-emerald-800 tracking-tighter mb-2">12°C</h2>
              <p className="text-gray-700 font-semibold mb-1">Cerah Berawan</p>
              <p className="text-xs text-gray-400">Gunung Prau, Basecamp</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="text-center">
                <svg className="w-4 h-4 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Angin</p>
                <p className="text-sm font-bold text-[#0f291e]">15 km/j</p>
              </div>
              <div className="text-center">
                <svg className="w-4 h-4 mx-auto mb-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Status</p>
                <p className="text-sm font-bold text-emerald-700">Normal</p>
              </div>
            </div>
          </div>

          {/* KARTU 4: RIWAYAT PENDAKIAN */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center text-sm font-bold text-[#0f291e]">
                <svg className="w-5 h-5 mr-2 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Riwayat Pendakian
              </div>
              <a href="#" className="text-xs font-bold text-emerald-700 hover:underline">Lihat Semua</a>
            </div>

            <div className="space-y-4">
              {/* Item Riwayat 1 */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-[#0f291e]">Gunung Merbabu</h4>
                  <p className="text-xs text-gray-500 mt-1">Jalur Selo • 12 Ags 2024</p>
                </div>
                <span className="bg-[#b8f2c3] text-emerald-900 text-[10px] font-bold px-2 py-1 rounded">Selesai</span>
              </div>

              {/* Item Riwayat 2 */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-[#0f291e]">Gunung Sindoro</h4>
                  <p className="text-xs text-gray-500 mt-1">Jalur Kledung • 05 Jun 2024</p>
                </div>
                <span className="bg-[#b8f2c3] text-emerald-900 text-[10px] font-bold px-2 py-1 rounded">Selesai</span>
              </div>

              {/* Item Riwayat 3 (Batal) */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 line-through decoration-gray-300">Gunung Lawu</h4>
                  <p className="text-xs text-gray-400 mt-1">Jalur Cemoro Sewu • 10 Jan 2024</p>
                </div>
                {/* Diberi warna abu-kemerahan agar kontras terbaca */}
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-100">Batal</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPendaki;