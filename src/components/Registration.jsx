import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingService from '../services/BookingService';
import { supabase } from '../services/supabaseClient'; 

const Registration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { num: 1, title: 'Jalur & Tanggal' },
    { num: 2, title: 'Data Rombongan' },
    { num: 3, title: 'Unggah Dokumen' },
    { num: 4, title: 'Review & Bayar' }
  ];

  const namaJalurMap = {
    1: 'Patak Banteng',
    2: 'Dieng',
    3: 'Wates',
    4: 'Dwarawati'
  };

  const [bookingData, setBookingData] = useState({
    id_jalur: 1, 
    tanggal_naik: '', 
    tanggal_turun: '' 
  });

  // --- PERUBAHAN UTAMA ADA DI SINI ---
  // Mengambil nama user dari sistem penyimpanan lokal
  const namaUserAktif = localStorage.getItem('userNama') || '';

  // Form input akan langsung terisi dengan nama user yang login
  const [formAnggota, setFormAnggota] = useState({
    nama: namaUserAktif, nik: '', telepon: '', gender: ''
  });

  // Tabel daftar anggota dikosongkan secara default agar user bisa 
  // menginput data KTP dan No HP yang valid untuk dirinya sendiri.
  const [daftarAnggota, setDaftarAnggota] = useState([]);
  // -----------------------------------

  const nextStep = () => {
    if (currentStep === 1) {
      if (!bookingData.tanggal_naik || !bookingData.tanggal_turun) {
        alert("Mohon pilih Tanggal Naik dan Tanggal Turun terlebih dahulu.");
        return;
      }
    }
    
    if (currentStep === 2 && daftarAnggota.length === 0) {
      alert("Mohon isi minimal 1 anggota (Ketua Rombongan).");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputAnggotaChange = (e) => {
    const { name, value } = e.target;
    setFormAnggota({ ...formAnggota, [name]: value });
  };

  const handleAddAnggota = (e) => {
    e.preventDefault();
    if (daftarAnggota.length >= 8) {
      alert('Batas maksimal 8 anggota telah tercapai.');
      return;
    }
    if (!formAnggota.nama || !formAnggota.nik || !formAnggota.gender) {
      alert('Mohon lengkapi data anggota (Nama, NIK, dan Gender).');
      return;
    }

    const anggotaBaru = {
      id: Date.now(),
      ...formAnggota,
      // Orang pertama yang diinput otomatis menjadi Ketua Rombongan
      role: daftarAnggota.length === 0 ? 'Ketua Rombongan' : 'Anggota'
    };

    setDaftarAnggota([...daftarAnggota, anggotaBaru]);
    
    // Setelah ditambah, kosongkan semua form agar siap untuk anggota selanjutnya
    setFormAnggota({ nama: '', nik: '', telepon: '', gender: '' });
  };

  const handleHapusAnggota = (id) => {
    const filteredAnggota = daftarAnggota.filter(anggota => anggota.id !== id);
    setDaftarAnggota(filteredAnggota);
  };

  const handleFileChange = (idAnggota, jenisDokumen, file) => {
    if (file) {
      const updatedDaftar = daftarAnggota.map((anggota) => {
        if (anggota.id === idAnggota) {
          return { ...anggota, [jenisDokumen]: file };
        }
        return anggota;
      });
      setDaftarAnggota(updatedDaftar);
    }
  };

  const handleKonfirmasiBayar = async () => {
    setIsSubmitting(true);

    try {
      // ==========================================
      // LANGKAH 1: CEK SISA KUOTA SEBELUM PROSES LAINNYA
      // ==========================================
      const { data: kuotaData, error: cekError } = await supabase
        .from('kuota_harian')
        .select('id_kuota, sisa_kuota')
        .eq('tanggal', bookingData.tanggal_naik)
        .eq('id_jalur', parseInt(bookingData.id_jalur))
        .single(); // Ambil 1 baris spesifik

      // Jika admin belum mengatur kuota untuk tanggal tersebut
      if (cekError || !kuotaData) {
        alert("Sistem belum membuka kuota untuk tanggal tersebut. Silakan pilih tanggal lain atau hubungi admin.");
        setIsSubmitting(false);
        return;
      }

      // Jika kuota kurang dari jumlah anggota rombongan
      if (kuotaData.sisa_kuota < daftarAnggota.length) {
        alert(`Maaf, kuota tidak mencukupi! Sisa kuota saat ini hanya: ${kuotaData.sisa_kuota} orang.`);
        setIsSubmitting(false);
        return;
      }

      // ==========================================
      // PROSES UNGGAH DOKUMEN (Jika Kuota Aman)
      // ==========================================
      const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
      const idBookingBaru = `PRU-${randomString}`;
      const daftarAnggotaFinal = [];

      for (const anggota of daftarAnggota) {
        let ktpUrl = null;
        let sehatUrl = null;

        if (anggota.fileKtp) {
          const ktpPath = `${idBookingBaru}/KTP_${anggota.nama.replace(/\s+/g, '_')}`;
          const { error: ktpError } = await supabase.storage
            .from('dokumen_pendaki')
            .upload(ktpPath, anggota.fileKtp);
            
          if (ktpError) throw ktpError;
          const { data: publicKtp } = supabase.storage.from('dokumen_pendaki').getPublicUrl(ktpPath);
          ktpUrl = publicKtp.publicUrl;
        }

        if (anggota.fileSehat) {
          const sehatPath = `${idBookingBaru}/SEHAT_${anggota.nama.replace(/\s+/g, '_')}`;
          const { error: sehatError } = await supabase.storage
            .from('dokumen_pendaki')
            .upload(sehatPath, anggota.fileSehat);
            
          if (sehatError) throw sehatError;
          const { data: publicSehat } = supabase.storage.from('dokumen_pendaki').getPublicUrl(sehatPath);
          sehatUrl = publicSehat.publicUrl;
        }

        daftarAnggotaFinal.push({
          ...anggota,
          file_ktp: ktpUrl,
          file_surat_sehat: sehatUrl
        });
      }

      // ==========================================
      // SIMPAN DATA KE TABEL TRANSAKSI
      // ==========================================
      const biayaSimaksi = daftarAnggotaFinal.length * 25000;
      const biayaFasilitas = 40000;
      const adminSistem = 5000;
      const totalBiaya = biayaSimaksi + biayaFasilitas + adminSistem;

      const idUserAktif = localStorage.getItem('userId') || 1; 

      const bookingHeader = {
        id_booking: idBookingBaru,
        id_user: parseInt(idUserAktif), 
        id_jalur: parseInt(bookingData.id_jalur), 
        tanggal_naik: bookingData.tanggal_naik, 
        tanggal_turun: bookingData.tanggal_turun, 
        jumlah_anggota: daftarAnggotaFinal.length,
        total_biaya: totalBiaya,
        status_pembayaran: 'pending',
        status_pendakian: 'belum_berangkat'
      };

      const result = await BookingService.submitBooking(bookingHeader, daftarAnggotaFinal);

      if (result.success) {
        // ==========================================
        // LANGKAH 2: POTONG KUOTA HARIAN DI DATABASE
        // ==========================================
        const sisaKuotaBaru = kuotaData.sisa_kuota - daftarAnggotaFinal.length;
        
        const { error: updateKuotaError } = await supabase
          .from('kuota_harian')
          .update({ sisa_kuota: sisaKuotaBaru })
          .eq('id_kuota', kuotaData.id_kuota);

        if (updateKuotaError) {
          console.error("Peringatan: Gagal memotong kuota secara otomatis.", updateKuotaError);
        }

        alert(`Registrasi Berhasil! Kode Booking Anda: ${idBookingBaru}`);
        navigate('/dashboard'); 
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error("Gagal memproses pendaftaran:", error);
      alert("Terjadi kesalahan sistem saat memproses registrasi Anda. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      
      {/* 1. HEADER */}
      <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#0f291e] font-bold text-xl tracking-tight">
          <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          PRAMAS
        </div>
        <button 
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin membatalkan registrasi? Semua data akan hilang.")) {
              navigate('/dashboard');
            }
          }}
          className="text-gray-500 hover:text-red-600 text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          Batal Registrasi
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      {/* 2. PROGRESS BAR */}
      <div className="w-full max-w-4xl mx-auto pt-10 pb-6 px-4">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-700 -z-10 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <div key={step.num} className="flex flex-col items-center relative bg-[#f8fafc] px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${isActive ? 'bg-emerald-700 border-emerald-700 text-white shadow-md' : isCompleted ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {isCompleted ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg> : step.num}
                </div>
                <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-800' : isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AREA KONTEN DINAMIS */}
      <main className="flex-grow w-full max-w-5xl mx-auto p-6">
        
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Pilih Jalur Pendakian</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patak Banteng */}
                <div onClick={() => setBookingData({ ...bookingData, id_jalur: 1 })} className={`border-2 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer transition-transform hover:-translate-y-1 ${bookingData.id_jalur === 1 ? 'border-emerald-700' : 'border-gray-200 border'}`}>
                  {bookingData.id_jalur === 1 && <div className="absolute top-4 right-4 bg-emerald-700 rounded-full p-1 shadow-md z-10"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                  <img src="https://images.pexels.com/photos/37435302/pexels-photo-37435302.jpeg" alt="Patak Banteng" className="h-40 w-full object-cover" />
                  <div className={`p-5 ${bookingData.id_jalur === 1 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Patak Banteng</h3>
                    <p className="text-gray-600 text-sm mb-4">Jalur paling favorit dengan waktu tempuh singkat (2-3 jam) dan pemandangan sunrise terbaik.</p>
                  </div>
                </div>

                {/* Dieng */}
                <div onClick={() => setBookingData({ ...bookingData, id_jalur: 2 })} className={`border-2 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer transition-transform hover:-translate-y-1 ${bookingData.id_jalur === 2 ? 'border-emerald-700' : 'border-gray-200 border'}`}>
                  {bookingData.id_jalur === 2 && <div className="absolute top-4 right-4 bg-emerald-700 rounded-full p-1 shadow-md z-10"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                  <img src="https://images.pexels.com/photos/8901074/pexels-photo-8901074.jpeg" alt="Dieng" className="h-40 w-full object-cover" />
                  <div className={`p-5 ${bookingData.id_jalur === 2 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dieng</h3>
                    <p className="text-gray-600 text-sm mb-4">Jalur landai yang melintasi savana luas. Cocok untuk pendaki pemula yang menyukai rute santai.</p>
                  </div>
                </div>

                {/* Wates */}
                <div onClick={() => setBookingData({ ...bookingData, id_jalur: 3 })} className={`border-2 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer transition-transform hover:-translate-y-1 ${bookingData.id_jalur === 3 ? 'border-emerald-700' : 'border-gray-200 border'}`}>
                  {bookingData.id_jalur === 3 && <div className="absolute top-4 right-4 bg-emerald-700 rounded-full p-1 shadow-md z-10"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                  <img src="https://images.pexels.com/photos/24847624/pexels-photo-24847624.jpeg" alt="Wates" className="h-40 w-full object-cover" />
                  <div className={`p-5 ${bookingData.id_jalur === 3 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Wates</h3>
                    <p className="text-gray-600 text-sm mb-4">Jalur asri melewati hutan pinus yang rindang. Memiliki sumber air alami di tengah perjalanan.</p>
                  </div>
                </div>

                {/* Dwarawati */}
                <div onClick={() => setBookingData({ ...bookingData, id_jalur: 4 })} className={`border-2 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer transition-transform hover:-translate-y-1 ${bookingData.id_jalur === 4 ? 'border-emerald-700' : 'border-gray-200 border'}`}>
                  {bookingData.id_jalur === 4 && <div className="absolute top-4 right-4 bg-emerald-700 rounded-full p-1 shadow-md z-10"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                  <img src="https://images.pexels.com/photos/31692286/pexels-photo-31692286.jpeg" alt="Dwarawati" className="h-40 w-full object-cover" />
                  <div className={`p-5 ${bookingData.id_jalur === 4 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dwarawati</h3>
                    <p className="text-gray-600 text-sm mb-4">Jalur alternatif yang lebih sepi, menawarkan pengalaman pendakian yang tenang dan asri.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Input Tanggal Dinamis */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-sm text-gray-900 mb-4">Pilih Tanggal Pendakian</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal Naik</label>
                      <input 
                        type="date" 
                        value={bookingData.tanggal_naik}
                        onChange={(e) => setBookingData({ ...bookingData, tanggal_naik: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal Turun</label>
                      <input 
                        type="date" 
                        value={bookingData.tanggal_turun}
                        min={bookingData.tanggal_naik}
                        onChange={(e) => setBookingData({ ...bookingData, tanggal_turun: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0f4f8] border border-blue-100 rounded-2xl p-6 shadow-inner">
                  <h4 className="font-bold text-sm text-[#0f291e] mb-4">Ringkasan Pilihan</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-blue-200/50 pb-2">
                      <span className="text-gray-500">Jalur</span>
                      <span className="font-bold text-gray-900">{namaJalurMap[bookingData.id_jalur]}</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-200/50 pb-2">
                      <span className="text-gray-500">Tanggal Naik</span>
                      <span className="font-bold text-gray-900">{bookingData.tanggal_naik || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Data Anggota Rombongan</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Tambah Anggota Rombongan</h3>
                    <span className="bg-[#eef8eb] text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-[#d1e6cc]">Slot: {daftarAnggota.length} / 8</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                      <input type="text" name="nama" value={formAnggota.nama} onChange={handleInputAnggotaChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Identitas (NIK)</label>
                      <input type="text" name="nik" value={formAnggota.nik} onChange={handleInputAnggotaChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                      <input type="text" name="telepon" value={formAnggota.telepon} onChange={handleInputAnggotaChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                      <select name="gender" value={formAnggota.gender} onChange={handleInputAnggotaChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleAddAnggota} className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Tambah ke Daftar</button>
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-gray-200"><h3 className="font-bold text-gray-900 text-lg">Daftar Anggota Saat Ini</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#eef2f6] text-gray-500 text-[10px] font-bold uppercase"><th className="p-4 pl-6">Nama</th><th className="p-4">NIK</th><th className="p-4">Gender</th><th className="p-4 text-right">Aksi</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {daftarAnggota.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-8 text-center text-gray-400 text-sm font-medium">Belum ada anggota. Silakan tambah anggota pertama (Ketua Rombongan).</td>
                          </tr>
                        ) : (
                          daftarAnggota.map((anggota) => (
                            <tr key={anggota.id} className="bg-white">
                              <td className="p-4 pl-6"><div className="font-bold">{anggota.nama}</div><div className="text-xs text-gray-500">{anggota.role}</div></td>
                              <td className="p-4 text-sm text-gray-600">{anggota.nik}</td>
                              <td className="p-4"><span className="bg-[#eef8eb] text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{anggota.gender}</span></td>
                              <td className="p-4 text-right">
                                {anggota.role !== 'Ketua Rombongan' && (
                                  <button onClick={() => handleHapusAnggota(anggota.id)} className="text-red-500 font-bold text-xs hover:underline">Hapus</button>
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

              <div className="space-y-6">
                <div className="bg-[#eef8eb] border border-[#d1e6cc] rounded-2xl p-6 text-sm">
                  <p className="text-emerald-800 font-bold mb-2">Persyaratan Kesehatan</p>
                  <p className="text-emerald-700 text-xs">Setiap anggota wajib membawa Surat Sehat maksimal H-3.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#0f291e] mb-3">Verifikasi Identitas & Kesehatan</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <div className="bg-[#2a7a5f] text-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-5">Panduan Berkas</h3>
                  <p className="text-sm">Format wajib JPG/PNG/PDF maks 2MB.</p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                {daftarAnggota.map((anggota) => (
                  <div key={anggota.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-4">{anggota.nama} ({anggota.role})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                        <span className="font-semibold text-sm text-center text-gray-500 mb-2">{anggota.fileKtp ? anggota.fileKtp.name : `Unggah KTP`}</span>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => handleFileChange(anggota.id, 'fileKtp', e.target.files[0])}/>
                      </label>
                      <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                        <span className="font-semibold text-sm text-center text-gray-500 mb-2">{anggota.fileSehat ? anggota.fileSehat.name : 'Unggah Surat Sehat'}</span>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => handleFileChange(anggota.id, 'fileSehat', e.target.files[0])}/>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Ringkasan Pemesanan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Jalur Pendakian</div>
                        <div className="font-bold text-gray-900 text-sm">{namaJalurMap[bookingData.id_jalur]}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Jumlah Pendaki</div>
                        <div className="font-bold text-gray-900 text-sm">{daftarAnggota.length} Orang</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Tanggal Naik</div>
                        <div className="font-bold text-gray-900 text-sm">{bookingData.tanggal_naik}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Syarat & Ketentuan</h3>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-emerald-700 border-gray-300 rounded cursor-pointer" />
                    <span className="text-sm text-gray-700 font-medium">Saya menyetujui seluruh aturan keselamatan pendakian.</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#f0f4f8] border border-blue-50 rounded-2xl p-6 shadow-inner">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Rincian Biaya</h3>
                  <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Simaksi ({daftarAnggota.length} x 25k)</span>
                      <span className="text-gray-900 font-semibold">Rp{daftarAnggota.length * 25000}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admin Sistem</span>
                      <span className="text-gray-900 font-semibold">Rp5000</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-gray-900">Total Bayar</span>
                    <span className="text-xl font-extrabold text-emerald-700">Rp{(daftarAnggota.length * 25000) + 5000}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TOMBOL NAVIGASI BAWAH */}
        <div className="flex justify-between items-center mt-8 border-t border-gray-200 pt-6">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300'
            }`}
          >
            Kembali
          </button>

          <button 
            onClick={currentStep === 4 ? handleKonfirmasiBayar : nextStep}
            disabled={isSubmitting}
            className={`px-8 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2 ${
              isSubmitting ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {isSubmitting ? 'Memproses...' : (currentStep === 4 ? 'Konfirmasi & Bayar' : 'Lanjutkan')}
          </button>
        </div>

      </main>
    </div>
  );
};

export default Registration;