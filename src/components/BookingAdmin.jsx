import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const adminTabs = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

  // State untuk Modal (Pop-up)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('booking_transaksi')
        .select(`*, jalur_pendakian (nama_jalur)`)
        .order('tanggal_naik', { ascending: false });

      if (error) throw error;
      if (data) setBookings(data);
    } catch (error) {
      console.error("Gagal mengambil data admin:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Perbaikan Filter Admin
  const filteredBookings = bookings.filter(b => {
    const s = b.status_pembayaran?.toLowerCase() || 'pending';
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Menunggu') return s === 'pending' || s === 'menunggu verifikasi';
    if (activeTab === 'Disetujui') return s === 'lunas';
    if (activeTab === 'Ditolak') return s === 'dibatalkan';
    return true;
  });

  // Fungsi untuk membuka Modal
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // 2. Fungsi Aksi Setujui / Tolak
  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('booking_transaksi')
        .update({ status_pembayaran: newStatus })
        .eq('id_booking', selectedBooking.id_booking);

      if (error) throw error;

      // Update data di tabel secara real-time tanpa perlu refresh halaman
      setBookings(prev => 
        prev.map(b => b.id_booking === selectedBooking.id_booking ? { ...b, status_pembayaran: newStatus } : b)
      );
      
      setIsModalOpen(false);
      alert(`Pesanan ${selectedBooking.id_booking} berhasil ${newStatus === 'Lunas' ? 'disetujui' : 'dibatalkan'}!`);
      
    } catch (error) {
      console.error("Gagal update status:", error.message);
      alert("Terjadi kesalahan saat memperbarui status.");
    } finally {
      setIsUpdating(false);
    }
  };

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
                          b.status_pembayaran?.toLowerCase() === 'menunggu verifikasi' ? 'bg-blue-50 text-blue-700' :
                          b.status_pembayaran?.toLowerCase() === 'dibatalkan' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {b.status_pembayaran || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Tombol Tinjau memanggil openModal */}
                        <button 
                          onClick={() => openModal(b)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                        >
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

      {/* 3. MODAL POP-UP TINJAUAN */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Verifikasi Pembayaran</h3>
                <p className="text-xs text-gray-500">ID: {selectedBooking.id_booking}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Info Kiri */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Tagihan</p>
                  <p className="text-2xl font-extrabold text-emerald-700">
                    Rp{selectedBooking.total_biaya ? selectedBooking.total_biaya.toLocaleString('id-ID') : '0'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Jalur</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBooking.jalur_pendakian?.nama_jalur || selectedBooking.id_jalur}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Anggota</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBooking.jumlah_anggota} Orang</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Tgl Naik</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBooking.tanggal_naik}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                    <p className="text-sm font-semibold text-blue-600">{selectedBooking.status_pembayaran}</p>
                  </div>
                </div>
              </div>

              {/* Bukti Gambar Kanan */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col justify-center items-center bg-gray-50 relative min-h-[250px]">
                {selectedBooking.bukti_pembayaran ? (
                  <a href={selectedBooking.bukti_pembayaran} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                    <img 
                      src={selectedBooking.bukti_pembayaran} 
                      alt="Bukti Transfer" 
                      className="w-full h-full object-contain max-h-[250px] rounded hover:opacity-90 transition-opacity cursor-zoom-in"
                    />
                  </a>
                ) : (
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-sm">Belum ada bukti pembayaran</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => handleUpdateStatus('dibatalkan')}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors"
              >
                Tolak Pemesanan
              </button>
              <button 
                onClick={() => handleUpdateStatus('lunas')}
                disabled={isUpdating || !selectedBooking.bukti_pembayaran}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors shadow-sm ${
                  isUpdating || !selectedBooking.bukti_pembayaran ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isUpdating ? 'Memproses...' : 'Setujui & Terbitkan E-Tiket'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default BookingAdmin;