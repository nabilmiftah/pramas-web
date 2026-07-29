import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const BookingDetail = () => {
  const { id } = useParams(); // Mengambil ID Booking dari URL (contoh: PRU-7LW0L)
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [anggota, setAnggota] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailPemesanan = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil data Header Booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian (nama_jalur)`)
          .eq('id_booking', id)
          .single();

        if (bookingError) throw bookingError;
        setBooking(bookingData);

        // 2. Ambil data Anggota Rombongan
        // Asumsi nama tabel Anda adalah 'anggota_rombongan'
        const { data: anggotaData, error: anggotaError } = await supabase
          .from('anggota_rombongan')
          .select('*')
          .eq('id_booking', id);

        if (!anggotaError && anggotaData) {
          setAnggota(anggotaData);
        }

      } catch (error) {
        console.error("Gagal memuat detail:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetailPemesanan();
  }, [id]);

  // Helper untuk warna badge status
  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'lunas') return <span className="bg-[#eef8eb] text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-[#d1e6cc]">Disetujui / Lunas</span>;
    if (s === 'dibatalkan') return <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold border border-red-100">Dibatalkan</span>;
    return <span className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold border border-yellow-200">Menunggu Pembayaran</span>;
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Memuat detail pesanan...</div>;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Pemesanan dengan kode {id} tidak ada di sistem.</p>
        <button onClick={() => navigate(-1)} className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in font-sans">
      
      {/* 1. Header & Navigasi */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0f291e]">Detail Pemesanan</h1>
          <p className="text-gray-500 text-sm">Kode: <span className="font-bold text-gray-700">{booking.id_booking}</span></p>
        </div>
        <div className="ml-auto">
          {renderStatusBadge(booking.status_pembayaran)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Kolom Kiri: Informasi Utama & Rombongan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Kartu Info Pendakian */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Informasi Pendakian
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gunung</p>
                <p className="text-sm font-semibold text-gray-900">Prau</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jalur</p>
                <p className="text-sm font-semibold text-gray-900">{booking.jalur_pendakian?.nama_jalur || booking.id_jalur}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jumlah Anggota</p>
                <p className="text-sm font-semibold text-gray-900">{booking.jumlah_anggota} Orang</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Naik</p>
                <p className="text-sm font-semibold text-gray-900">{booking.tanggal_naik}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Turun</p>
                <p className="text-sm font-semibold text-gray-900">{booking.tanggal_turun}</p>
              </div>
            </div>
          </div>

          {/* Kartu Daftar Anggota */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Daftar Rombongan
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">NIK</th>
                    <th className="px-6 py-3">Gender</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {anggota.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-6 text-center text-gray-500 text-sm">Sedang memuat data anggota...</td>
                    </tr>
                  ) : (
                    anggota.map((person, index) => (
                      <tr key={person.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm">{person.nama_anggota}</div>
                          <div className="text-xs text-gray-500">{person.role || (index === 0 ? 'Ketua Rombongan' : 'Anggota')}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{person.nik_identitas}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{person.jenis_kelamin}</td>
                        <td className="px-6 py-4">
                          {person.file_ktp && person.file_surat_sehat ? (
                            <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Berkas Lengkap</span>
                          ) : (
                            <span className="text-yellow-700 text-xs font-bold bg-yellow-50 px-2 py-1 rounded">Berkas Kurang</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Kolom Kanan: Rincian Biaya & Aksi */}
        <div className="space-y-6">
          <div className="bg-[#f0f4f8] border border-blue-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0f291e] mb-6 border-b border-blue-200/50 pb-4">Rincian Biaya</h3>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>Tiket Simaksi ({booking.jumlah_anggota} Orang)</span>
                <span className="font-semibold text-gray-900">Rp{booking.jumlah_anggota * 25000}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Biaya Fasilitas / Asuransi</span>
                <span className="font-semibold text-gray-900">Rp40000</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Biaya Admin Sistem</span>
                <span className="font-semibold text-gray-900">Rp5000</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-blue-200/50 pt-4 mb-8">
              <span className="font-bold text-gray-900 text-base">Total Pembayaran</span>
              <span className="text-2xl font-extrabold text-emerald-700">Rp{booking.total_biaya || ((booking.jumlah_anggota * 25000) + 45000)}</span>
            </div>

            {/* Aksi Berdasarkan Status */}
            {booking.status_pembayaran?.toLowerCase() === 'pending' ? (
              <button 
                onClick={() => navigate(`/pembayaran/${booking.id_booking}`)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-sm"
              >
                Lanjutkan Pembayaran
              </button>
            ) : booking.status_pembayaran?.toLowerCase() === 'lunas' ? (
              <button className="w-full bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-xl transition-colors text-sm flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Unduh E-Tiket PDF
              </button>
            ) : (
              <button className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm">
                Transaksi Dibatalkan
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetail;