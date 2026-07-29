import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const adminTabs = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoading(true);
      try {
        // Admin mengambil SEMUA data tanpa filter .eq('id_user')
        const { data, error } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian (nama_jalur)`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setBookings(data);
      } catch (error) {
        console.error("Gagal mengambil data admin:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Menunggu') return b.status_pembayaran?.toLowerCase() === 'pending';
    if (activeTab === 'Disetujui') return b.status_pembayaran?.toLowerCase() === 'lunas';
    if (activeTab === 'Ditolak') return b.status_pembayaran?.toLowerCase() === 'dibatalkan';
    return true;
  });

  return (
    <>
      <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Manajemen Pemesanan (Admin)</h2>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-4 overflow-x-auto">
          {adminTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab ? 'bg-emerald-50 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500">Memuat semua data pemesanan...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID Booking</th>
                  <th className="px-6 py-4">Jml Anggota</th>
                  <th className="px-6 py-4">Jalur Pendakian</th>
                  <th className="px-6 py-4">Tanggal Naik</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada pemesanan ditemukan.</td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id_booking} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0f291e]">{b.id_booking.substring(0, 9)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{b.jumlah_anggota} Orang</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.jalur_pendakian?.nama_jalur || b.id_jalur}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.tanggal_naik}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                          b.status_pembayaran?.toLowerCase() === 'lunas' ? 'bg-emerald-50 text-emerald-700' : 
                          b.status_pembayaran?.toLowerCase() === 'dibatalkan' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {b.status_pembayaran || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingAdmin;