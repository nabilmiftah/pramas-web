import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const ETicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null); // Referensi untuk area yang akan di-PDF-kan

  const [booking, setBooking] = useState(null);
  const [anggota, setAnggota] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);
      try {
        // Ambil data transaksi
        const { data: bookingData, error: bookingError } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian (nama_jalur)`)
          .eq('id_booking', id)
          .single();

        if (bookingError) throw bookingError;
        setBooking(bookingData);

        // Ambil data anggota (sesuaikan nama tabel jika berbeda)
        const { data: anggotaData, error: anggotaError } = await supabase
          .from('anggota_rombongan')
          .select('*')
          .eq('id_booking', id);

        if (!anggotaError && anggotaData) {
          setAnggota(anggotaData);
        }
      } catch (error) {
        console.error("Gagal memuat tiket:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTicketData();
  }, [id]);

  // Fungsi Sakti untuk Download PDF
  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      // Potret elemen menggunakan html-to-image
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // Skala resolusi tinggi agar tidak pecah
      });
      
      // Hitung dimensi gambar untuk dimasukkan ke PDF
      const img = new window.Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      // Buat dokumen PDF baru (Format A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      // Tempel gambar potretan ke dalam PDF
      pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, pdfHeight);
      
      // Simpan dan unduh
      pdf.save(`E-Tiket_Gunung_Prau_${id}.pdf`);
    } catch (error) {
      console.error("Gagal men-generate PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat E-Tiket...</div>;
  if (!booking || booking.status_pembayaran?.toLowerCase() !== 'lunas') {
    return <div className="text-center py-20 text-red-500 font-bold">Tiket tidak valid atau belum lunas.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 font-sans animate-fade-in">
      
      {/* Tombol Navigasi & Download */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="hidden sm:inline font-semibold">Kembali</span>
        </button>

        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-colors shadow-md ${
            isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {isDownloading ? 'Menyiapkan PDF...' : 'Unduh PDF'}
        </button>
      </div>

      {/* AREA YANG AKAN DICETAK KE PDF */}
      <div ref={ticketRef} className="bg-white border-2 border-emerald-900 rounded-2xl overflow-hidden shadow-sm relative">
        
        {/* Header Tiket */}
        <div className="bg-emerald-900 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider">PRAMAS</h1>
            <p className="text-emerald-200 text-sm">Mountain Management System</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-200 uppercase tracking-widest mb-1">Boarding Pass</p>
            <p className="font-bold text-xl">{id}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Info Pendakian (Kiri) */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-8 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Tujuan</p>
                <p className="text-2xl font-extrabold text-gray-900">Gunung Prau</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Jalur Masuk</p>
                <p className="text-xl font-bold text-emerald-700">{booking.jalur_pendakian?.nama_jalur || booking.id_jalur}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Tanggal Naik</p>
                <p className="text-sm font-bold text-gray-900">{booking.tanggal_naik}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Tanggal Turun</p>
                <p className="text-sm font-bold text-gray-900">{booking.tanggal_turun}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Jumlah</p>
                <p className="text-sm font-bold text-gray-900">{booking.jumlah_anggota} Orang</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">LUNAS</span>
              </div>
            </div>

            {/* Tabel Anggota */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Daftar Rombongan</p>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-2 px-3 font-semibold text-gray-600">Nama</th>
                    <th className="py-2 px-3 font-semibold text-gray-600">NIK</th>
                    <th className="py-2 px-3 font-semibold text-gray-600">Gender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {anggota.map((person, index) => (
                    <tr key={index}>
                      {/* Pastikan nama properti di bawah ini sesuai dengan tabel Anda (misal: nama_lengkap) */}
                      <td className="py-2 px-3 font-medium">{person.nama_anggota || person.nama}</td>
                      <td className="py-2 px-3 text-gray-600">{person.nik_identitas}</td>
                      <td className="py-2 px-3 text-gray-600">{person.jenis_kelamin || person.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Code (Kanan) */}
          <div className="flex flex-col items-center justify-center border-l-0 md:border-l-2 border-dashed border-gray-200 pl-0 md:pl-8">
            <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-sm mb-4">
              <QRCode 
                value={id} // QR Code berisi ID Booking
                size={120}
                bgColor="#ffffff"
                fgColor="#0f291e"
              />
            </div>
            <p className="text-xs text-gray-400 text-center uppercase tracking-widest">Pindai di Basecamp</p>
          </div>
          
        </div>
        
        {/* Footer Tiket */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
          *Tiket ini wajib ditunjukkan kepada petugas basecamp. Harap bawa kartu identitas (KTP) asli dan surat sehat yang masih berlaku.
        </div>
      </div>

    </div>
  );
};

export default ETicket;