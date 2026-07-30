import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const BookingPendaki = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAktif, setFilterAktif] = useState('Semua');
  const userTabs = ['Semua', 'Menunggu Pembayaran', 'Disetujui'];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const storedUserId = localStorage.getItem('userId') || 1;
        const { data, error } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian (nama_jalur)`)
          .eq('id_user', storedUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setBookings(data);
      } catch (error) {
        console.error("Gagal mengambil data booking:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filterAktif === 'Semua') return true;
    if (filterAktif === 'Menunggu Pembayaran') {
      const s = booking.status_pembayaran?.toLowerCase();
      // Tampilkan tiket yang pending DAN yang sedang menunggu verifikasi di tab ini
      return s === 'pending' || s === 'menunggu verifikasi'; 
    }
    if (filterAktif === 'Disetujui') return booking.status_pembayaran?.toLowerCase() === 'lunas';
    return true;
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'lunas') return <span className="bg-[#eef8eb] text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-[#d1e6cc]">Disetujui</span>;
    
    // Tambahkan baris ini untuk status Menunggu Verifikasi (Warna Biru)
    if (s === 'menunggu verifikasi') return <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Menunggu Verifikasi</span>;
    
    if (s === 'dibatalkan') return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Dibatalkan</span>;
    return <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Menunggu Pembayaran</span>;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f291e] mb-1">Pemesanan Saya</h2>
          <p className="text-gray-500 text-sm">Kelola jadwal pendakian dan e-tiket Anda.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {userTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterAktif(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                filterAktif === tab ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Memuat data pemesanan...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pemesanan</h3>
          <p className="text-gray-500 text-sm">Anda belum memiliki riwayat pemesanan untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((b) => (
            <div key={b.id_booking} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>{getStatusBadge(b.status_pembayaran)}</div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Kode Booking</p>
                  <p className="text-sm font-bold text-[#0f291e]">{b.id_booking.substring(0, 9)}</p>
                </div>
              </div>
              <div className="mb-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gunung Prau</h3>
                <p className="text-gray-500 text-sm font-medium"> {b.jalur_pendakian?.nama_jalur || b.id_jalur}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal</p>
                  <p className="text-sm font-bold text-gray-900">{b.tanggal_naik}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Anggota</p>
                  <p className="text-sm font-bold text-gray-900">{b.jumlah_anggota} Orang</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-3">
                {b.status_pembayaran?.toLowerCase() === 'lunas' ? (
                  <button
                  onClick={() => navigate(`/e-tiket/${b.id_booking}`)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    E-Tiket
                  </button>
                ) : b.status_pembayaran?.toLowerCase() === 'pending' ? (
                  <button 
                    onClick={() => navigate(`/pembayaran/${b.id_booking}`)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-white-900 text-sm font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Bayar
                  </button>
                ) : (
                  <button className="w-full bg-gray-100 text-gray-400 text-sm font-bold py-2.5 rounded-xl cursor-not-allowed">
                    Selesai
                  </button>
                )}
                
                <button 
                  onClick={() => navigate(`/booking-detail/${b.id_booking}`)}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BookingPendaki;