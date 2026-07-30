import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const BookingPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk menyimpan file bukti transfer yang dipilih user
  const [fileBukti, setFileBukti] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('booking_transaksi')
          .select('*')
          .eq('id_booking', id)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (error) {
        console.error("Gagal memuat pesanan:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  const handleUploadBukti = async (e) => {
    e.preventDefault();
    if (!fileBukti) {
      alert("Pilih file bukti transfer terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload file ke storage Supabase (Buat bucket bernama 'bukti_pembayaran' di Supabase)
      const fileName = `BUKTI_${id}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('bukti_pembayaran')
        .upload(fileName, fileBukti);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL publik dari file yang diupload
      const { data: publicUrlData } = supabase.storage
        .from('bukti_pembayaran')
        .getPublicUrl(fileName);
      
      const buktiUrl = publicUrlData.publicUrl;

      // 3. Update tabel booking_transaksi
      // Ubah status dan simpan link bukti transfernya
      const { error: updateError } = await supabase
        .from('booking_transaksi')
        .update({ 
          status_pembayaran: 'Menunggu Verifikasi',
          bukti_pembayaran: buktiUrl 
        })
        .eq('id_booking', id);

      if (updateError) throw updateError;

      alert("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.");
      navigate('/bookings'); // Arahkan kembali ke daftar pemesanan

    } catch (error) {
      console.error("Gagal mengunggah bukti:", error.message);
      alert("Gagal mengunggah bukti pembayaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat data pembayaran...</div>;
  if (!booking) return <div className="text-center py-20 text-red-500">Data pemesanan tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in font-sans">
      
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0f291e]">Selesaikan Pembayaran</h1>
          <p className="text-gray-500 text-sm">Kode Booking: <span className="font-bold text-gray-700">{booking.id_booking}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Info Tagihan & Rekening */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Tagihan</h3>
            <p className="text-3xl font-extrabold text-emerald-700 mb-6">
              Rp{booking.total_biaya ? booking.total_biaya.toLocaleString('id-ID') : '0'}
            </p>
            
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-4">Transfer ke salah satu rekening berikut:</h4>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="w-12 h-8 bg-blue-600 text-white font-bold text-xs flex items-center justify-center rounded mr-4">BCA</div>
                  <div>
                    <p className="font-bold text-gray-900">0123 4567 89</p>
                    <p className="text-xs text-gray-500">a.n. Basecamp Gunung Prau</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="w-12 h-8 bg-orange-500 text-white font-bold text-xs flex items-center justify-center rounded mr-4">BNI</div>
                  <div>
                    <p className="font-bold text-gray-900">9876 5432 10</p>
                    <p className="text-xs text-gray-500">a.n. Basecamp Gunung Prau</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Upload Bukti */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-[#0f291e] mb-2">Unggah Bukti Transfer</h3>
          <p className="text-gray-500 text-sm mb-6">Pastikan tanggal dan nominal transfer terlihat jelas pada foto/screenshot.</p>

          <form onSubmit={handleUploadBukti} className="flex-grow flex flex-col">
            <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-emerald-500 transition-colors flex-grow mb-6">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              <span className="font-semibold text-gray-700 text-center mb-1">
                {fileBukti ? fileBukti.name : "Klik untuk memilih foto"}
              </span>
              <span className="text-xs text-gray-500 text-center">Format JPG, PNG (Maks 2MB)</span>
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                className="hidden" 
                onChange={(e) => setFileBukti(e.target.files[0])} 
              />
            </label>

            <button 
              type="submit" 
              disabled={isSubmitting || !fileBukti}
              className={`w-full py-3 rounded-xl font-bold transition-colors shadow-md ${
                isSubmitting || !fileBukti 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSubmitting ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BookingPayment;