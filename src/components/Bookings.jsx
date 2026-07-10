import React, { useState, useEffect } from 'react';
import BookingService from '../services/BookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const role = localStorage.getItem('role') || 'pendaki';

  // Jalankan fetch saat halaman pertama kali dibuka
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mengambil data menggunakan method getAll() (atau nama fungsi serupa yang ada di Service Anda)
      const data = await BookingService.getAll();
      
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data booking:", error.message);
      // Data tetap berupa array kosong jika gagal, sehingga UI tidak crash (layar putih)
    }
  };

  const adminTabs = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];
  const userTabs = ['Semua', 'Menunggu Pembayaran', 'Disetujui'];

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      
      {role === 'admin' ? (
        /* ================= TAMPILAN ADMIN ================= */
        <>
          <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Manajemen Pemesanan</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex gap-4">
              {adminTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === tab ? 'bg-emerald-50 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ... (Kode tabel Admin dari sebelumnya tetap sama di sini) ... */}
                <thead className="bg-gray-50/50">
                  <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID Booking</th>
                    <th className="px-6 py-4">Ketua Rombongan</th>
                    <th className="px-6 py-4">Jalur Pendakian</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0f291e]">{b.id_booking}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{b.nama_ketua}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.jalur}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.tgl_pendakian}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                          b.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ================= TAMPILAN PENDAKI ================= */
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f291e]">Pemesanan Saya</h2>
              <p className="text-gray-500 mt-1 text-sm">Kelola jadwal pendakian dan e-tiket Anda.</p>
            </div>
            
            {/* Filter Tabs Pendaki */}
            <div className="flex gap-3">
              {userTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab 
                    ? 'bg-emerald-700 text-white shadow-md' 
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Kartu Pesanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                
                {/* Header Kartu: Status & Kode */}
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    b.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 
                    b.status === 'Menunggu Pembayaran' ? 'bg-red-50 text-red-600' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {b.status}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Kode Booking</p>
                    <p className="font-bold text-gray-800 text-sm">{b.id_booking}</p>
                  </div>
                </div>

                {/* Info Gunung & Jalur */}
                <h3 className="text-xl font-bold text-[#0f291e] mb-1">Gunung Prau</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Jalur {b.jalur}
                </p>

                {/* Detail Tanggal & Anggota */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tanggal Pendakian</p>
                    <p className="font-semibold text-gray-800 text-sm">{b.tanggal_naik}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Anggota</p>
                    <p className="font-semibold text-gray-800 text-sm">{b.jumlah_anggota} Orang</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                  {b.status_pembayaran === 'Disetujui' ? (
                    <button className="bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                      E-Tiket
                    </button>
                  ) : b.status_pembayaran === 'Menunggu Pembayaran' ? (
                    <button className="bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                      Bayar
                    </button>
                  ) : (
                    <button className="bg-gray-100 text-gray-400 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
                      Selesai
                    </button>
                  )}
                  
                  <button className="border-2 border-gray-200 text-gray-600 hover:border-emerald-700 hover:text-emerald-700 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    Detail
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;