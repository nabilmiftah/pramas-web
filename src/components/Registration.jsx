import React, { useState } from 'react';

const Registration = () => {
  // State untuk melacak pengguna berada di langkah ke berapa (1 - 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Daftar langkah agar mudah dikelola dan dirender otomatis
  const steps = [
    { num: 1, title: 'Jalur & Tanggal' },
    { num: 2, title: 'Data Rombongan' },
    { num: 3, title: 'Unggah Dokumen' },
    { num: 4, title: 'Review & Bayar' }
  ];

  // Fungsi navigasi langkah
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // State Langkah 1: Jalur dan Tanggal
  const [bookingData, setBookingData] = useState({
    jalur: 'Patak Banteng',
    tanggal: ''
  });

  // State Langkah 2: Form Input Anggota Sementara
  const [formAnggota, setFormAnggota] = useState({
    nama: '',
    nik: '',
    telepon: '',
    gender: ''
  });

  // State Langkah 2: Daftar Anggota yang Tersimpan
  // Kita inisialisasi dengan data ketua dan anggota pertama agar sesuai dengan dataset
  const [daftarAnggota, setDaftarAnggota] = useState([
    { 
      id: Date.now(), 
      nama: 'Ridwan Shol', 
      nik: '3301XXXXXXXX0001', 
      telepon: '08123456789', 
      gender: 'Perempuan', 
      role: 'Ketua Rombongan' 
    },
    { 
      id: Date.now() + 1, 
      nama: 'Miftah', 
      nik: '3301XXXXXXXX0002', 
      telepon: '08129876543', 
      gender: 'Perempuan', 
      role: 'Anggota' 
    }
  ]);

  // Fungsi untuk menangani input form anggota berubah
  const handleInputAnggotaChange = (e) => {
    const { name, value } = e.target;
    setFormAnggota({
      ...formAnggota,
      [name]: value
    });
  };

  // Fungsi untuk menambahkan anggota ke dalam tabel (Maksimal 8)
  const handleAddAnggota = (e) => {
    e.preventDefault();
    if (daftarAnggota.length >= 8) {
      alert('Batas maksimal 8 anggota telah tercapai.');
      return;
    }
    
    // Validasi sederhana agar form tidak kosong
    if (!formAnggota.nama || !formAnggota.nik || !formAnggota.gender) {
      alert('Mohon lengkapi data anggota.');
      return;
    }

    const anggotaBaru = {
      id: Date.now(),
      ...formAnggota,
      role: daftarAnggota.length === 0 ? 'Ketua Rombongan' : 'Anggota'
    };

    setDaftarAnggota([...daftarAnggota, anggotaBaru]);
    
    // Reset form setelah berhasil ditambah
    setFormAnggota({ nama: '', nik: '', telepon: '', gender: '' });
  };

  // Fungsi untuk menghapus anggota dari tabel
  const handleHapusAnggota = (id) => {
    const filteredAnggota = daftarAnggota.filter(anggota => anggota.id !== id);
    setDaftarAnggota(filteredAnggota);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      
      {/* 1. HEADER (Fokus Penuh, Tanpa Menu) */}
      <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#0f291e] font-bold text-xl tracking-tight">
          <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          PRAMAS
        </div>
        <button className="text-gray-500 hover:text-gray-800 text-sm font-semibold flex items-center gap-2 transition-colors">
          Batal Registrasi
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      {/* 2. PROGRESS BAR / STEPPER YANG KONSISTEN */}
      <div className="w-full max-w-4xl mx-auto pt-10 pb-6 px-4">
        <div className="flex justify-between items-center relative">
          {/* Garis Latar Belakang (Abu-abu) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          
          {/* Garis Progres (Hijau) */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-700 -z-10 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Lingkaran Indikator Langkah */}
          {steps.map((step, index) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div key={step.num} className="flex flex-col items-center relative bg-[#f8fafc] px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-emerald-700 border-emerald-700 text-white shadow-md' 
                      : isCompleted 
                        ? 'bg-emerald-700 border-emerald-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${
                  isActive ? 'text-emerald-800' : isCompleted ? 'text-emerald-700' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AREA KONTEN DINAMIS (Berubah sesuai langkah) */}
      <main className="flex-grow w-full max-w-5xl mx-auto p-6">
        
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Pilih Jalur Pendakian</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* KOLOM KIRI: Daftar Jalur (Porsi 2/3 layar) */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Kartu 1: Patak Banteng (Status Terpilih) */}
                <div className="border-2 border-emerald-700 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer transition-transform hover:-translate-y-1">
                  <div className="absolute top-4 right-4 bg-emerald-700 rounded-full p-1 shadow-md z-10">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <img 
                    src="https://images.pexels.com/photos/37435302/pexels-photo-37435302.jpeg" 
                    alt="Jalur Patak Banteng" 
                    className="h-40 w-full object-cover" 
                   />
                  <div className="p-5 bg-emerald-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">Patak Banteng</h3>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Populer</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">Jalur paling favorit dengan waktu tempuh singkat (2-3 jam) dan pemandangan sunrise terbaik.</p>
                    <div className="flex gap-4 text-xs font-bold text-emerald-700">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> Menantang</span>
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 150 Min</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 2: Dieng (Status Tidak Terpilih) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-emerald-700 transition-all hover:-translate-y-1">
                  <img 
                    src="https://images.pexels.com/photos/8901074/pexels-photo-8901074.jpeg" 
                    alt="Jalur Patak Banteng" 
                    className="h-40 w-full object-cover" 
                   />
                  <div className="p-5 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dieng</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">Jalur landai yang melintasi savana luas. Cocok untuk pendaki pemula yang menyukai rute santai.</p>
                    <div className="flex gap-4 text-xs font-bold text-emerald-600">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> Mudah</span>
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 180 Min</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 3: Wates (Bentuk disesuaikan dengan kartu lain) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-emerald-700 transition-all hover:-translate-y-1">
                   <img 
                    src="https://images.pexels.com/photos/24847624/pexels-photo-24847624.jpeg" 
                    alt="Jalur Patak Banteng" 
                    className="h-40 w-full object-cover" 
                   />
                   <div className="p-5 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Wates</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">Jalur asri melewati hutan pinus yang rindang. Memiliki sumber air alami di tengah perjalanan.</p>
                    <div className="flex gap-4 text-xs font-bold text-emerald-600">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> Sedang</span>
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 210 Min</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 4: Dwarawati (Tambahan Jalur Ke-4) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-emerald-700 transition-all hover:-translate-y-1">
                   <img 
                    src="https://images.pexels.com/photos/31692286/pexels-photo-31692286.jpeg" 
                    alt="Jalur Patak Banteng" 
                    className="h-40 w-full object-cover" 
                   />
                   <div className="p-5 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dwarawati</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">Jalur alternatif yang lebih sepi, menawarkan pengalaman pendakian yang tenang dan asri.</p>
                    <div className="flex gap-4 text-xs font-bold text-emerald-600">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> Mudah</span>
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 180 Min</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* KOLOM KANAN: Kalender & Ringkasan (Porsi 1/3 layar) */}
              <div className="space-y-6">
                
                {/* Card Kalender */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-sm text-gray-900">Pilih Tanggal</h4>
                    <div className="flex gap-2 text-gray-400">
                      <svg className="w-5 h-5 cursor-pointer hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                      <svg className="w-5 h-5 cursor-pointer hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                  <div className="text-center text-emerald-700 font-bold mb-4">Oktober 2024</div>
                  {/* Grid Kalender Dummy */}
                  <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-semibold mb-6">
                    <div className="text-gray-400">M</div><div className="text-gray-400">S</div><div className="text-gray-400">S</div><div className="text-gray-400">R</div><div className="text-gray-400">K</div><div className="text-gray-400">J</div><div className="text-gray-400">S</div>
                    <div className="text-gray-300">29</div><div className="text-gray-300">30</div>
                    <div className="text-gray-800 relative">1 <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></div>
                    <div className="text-gray-800 relative">2 <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></div>
                    <div className="bg-emerald-700 text-white rounded-lg py-1 relative">3</div>
                    <div className="text-gray-800 relative">4 <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></div>
                    <div className="text-gray-800 relative">5 <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></div>
                  </div>
                  <div className="flex justify-center gap-6 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tersedia</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Penuh</span>
                  </div>
                </div>

                {/* Card Ringkasan Pilihan */}
                <div className="bg-[#f0f4f8] border border-blue-100 rounded-2xl p-6 shadow-inner">
                  <h4 className="font-bold text-sm text-[#0f291e] mb-4">Ringkasan Pilihan</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-blue-200/50 pb-2">
                      <span className="text-gray-500">Jalur</span>
                      <span className="font-bold text-gray-900">Patak Banteng</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-200/50 pb-2">
                      <span className="text-gray-500">Tanggal</span>
                      <span className="font-bold text-gray-900">3 Okt 2024</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-500">Sisa Kuota</span>
                      <span className="font-bold"><span className="text-emerald-600">142</span> Pendaki</span>
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
              
              {/* KOLOM KIRI: Form Input & Daftar Anggota (Porsi 2/3) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Form Tambah Anggota */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Tambah Anggota Rombongan</h3>
                    <span className="bg-[#eef8eb] text-emerald-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-[#d1e6cc]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      {/* Slot dinamis membaca panjang array */}
                      Slot: {daftarAnggota.length} / 8
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="nama"
                        value={formAnggota.nama}
                        onChange={handleInputAnggotaChange}
                        placeholder="Sesuai Identitas" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Identitas (KTP/Passport)</label>
                      <input 
                        type="text" 
                        name="nik"
                        value={formAnggota.nik}
                        onChange={handleInputAnggotaChange}
                        placeholder="16 Digit NIK atau No. Passport" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                      <input 
                        type="text" 
                        name="telepon"
                        value={formAnggota.telepon}
                        onChange={handleInputAnggotaChange}
                        placeholder="Contoh: 08123456789" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                      <div className="relative">
                        <select 
                          name="gender"
                          value={formAnggota.gender}
                          onChange={handleInputAnggotaChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-white text-gray-600 text-sm appearance-none"
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddAnggota} 
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      Tambah ke Daftar
                    </button>
                  </div>
                </div>

                {/* Daftar Anggota Saat Ini */}
                <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg">Daftar Anggota Saat Ini</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#eef2f6] text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                          <th className="p-4 pl-6">Nama</th>
                          <th className="p-4">ID Number</th>
                          <th className="p-4">Gender</th>
                          <th className="p-4 text-right pr-6">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Rendering dinamis menggunakan map */}
                        {daftarAnggota.map((anggota) => (
                          <tr key={anggota.id} className="bg-white">
                            <td className="p-4 pl-6">
                              <div className={`font-bold ${anggota.role === 'Ketua Rombongan' ? 'text-emerald-700' : 'text-gray-900'}`}>
                                {anggota.nama}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{anggota.role}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{anggota.nik}</td>
                            <td className="p-4">
                              <span className="bg-[#eef8eb] text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{anggota.gender}</span>
                            </td>
                            <td className="p-4 text-right pr-6 flex justify-end gap-3 mt-1">
                              {/* Ketua tidak boleh dihapus */}
                              {anggota.role !== 'Ketua Rombongan' && (
                                <button 
                                  onClick={() => handleHapusAnggota(anggota.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pesan jika slot masih tersedia */}
                  {daftarAnggota.length < 8 && (
                    <div className="bg-white p-8 text-center text-sm text-gray-400 font-semibold flex flex-col items-center justify-center gap-3 border-t border-gray-200">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      Silakan tambahkan anggota lainnya (maks. 8 orang)
                    </div>
                  )}
                </div>

              </div>

              {/* KOLOM KANAN: Persyaratan & Status (Porsi 1/3) */}
              <div className="space-y-6">
                
                {/* Card Persyaratan */}
                <div className="bg-[#eef8eb] border border-[#d1e6cc] rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <svg className="w-24 h-24 text-emerald-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                  </div>
                  <div className="flex items-center gap-2 text-[#0f291e] font-bold mb-3 relative z-10 text-sm">
                    <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Persyaratan Kesehatan
                  </div>
                  <p className="text-emerald-800 text-xs leading-relaxed mb-4 relative z-10">
                    Setiap anggota rombongan Wajib melampirkan Surat Keterangan Sehat asli dari Klinik/Rumah Sakit yang masih berlaku pada tahap selanjutnya.
                  </p>
                  <div className="text-[11px] text-emerald-700/80 font-semibold flex items-center gap-1.5 relative z-10">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Berlaku maksimal 3 hari sebelum keberangkatan.
                  </div>
                </div>

                {/* Card Status */}
                <div className="bg-[#f0f4f8] border border-blue-100 rounded-2xl p-6 shadow-inner">
                  <h4 className="font-bold text-[#0f291e] mb-5 text-sm">Status Rombongan</h4>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      <span>Kapasitas Kelompok</span>
                      {/* Persentase kapasitas dinamis */}
                      <span>{((daftarAnggota.length / 8) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      {/* Bar progres dinamis */}
                      <div 
                        className="bg-[#a8c6a6] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(daftarAnggota.length / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 text-sm font-semibold ${daftarAnggota.length > 0 ? 'text-emerald-700' : 'text-gray-500'}`}>
                      {daftarAnggota.length > 0 ? (
                        <svg className="w-4 h-4 bg-emerald-700 text-white rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      Ketua Rombongan Terdaftar
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${daftarAnggota.length >= 3 ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                      {daftarAnggota.length >= 3 ? (
                        <svg className="w-4 h-4 bg-emerald-700 text-white rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      Minimal 3 anggota (Opsional)
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in">
            {/* Header Langkah 3 */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#0f291e] mb-3">Verifikasi Identitas & Kesehatan</h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                Silakan unggah pindaian KTP/SIM dan Surat Keterangan Sehat terbaru untuk setiap anggota pendaki. Pastikan dokumen terbaca dengan jelas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* KOLOM KIRI: Panduan & Status Kelengkapan (Porsi 1/3) */}
              <div className="space-y-6">
                
                {/* Card Panduan Berkas */}
                <div className="bg-[#2a7a5f] text-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Panduan Berkas
                  </h3>
                  <ul className="space-y-4 text-sm text-emerald-50">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="leading-relaxed">Format file wajib JPG, PNG, atau PDF dengan ukuran maksimal 2MB per file.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="leading-relaxed">Surat Sehat harus diterbitkan maksimal 3 hari sebelum tanggal keberangkatan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="leading-relaxed">Identitas (KTP/Passport) harus masih berlaku saat pelaksanaan pendakian.</span>
                    </li>
                  </ul>
                </div>

                {/* Card Status Kelengkapan */}
                <div className="bg-[#f4f7fa] border border-blue-50 rounded-2xl p-6">
                  <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Status Kelengkapan</h4>
                  <div className="flex items-end justify-between mb-3">
                    <span className="text-4xl font-extrabold text-[#0f291e]">65%</span>
                    <span className="text-sm font-semibold text-gray-500 mb-1">4 dari 6 dokumen</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#2a7a5f] h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-2 space-y-6">
                {daftarAnggota.map((anggota) => (
                  <div key={anggota.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                        {anggota.nama.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{anggota.nama}</h4>
                        <span className="text-xs text-gray-500">{anggota.role}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Input KTP */}
                      <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-500 cursor-pointer transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="font-semibold text-sm">Unggah KTP {anggota.nama}</span>
                        <input type="file" className="hidden" />
                      </label>

                      {/* Input Surat Sehat */}
                      <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-500 cursor-pointer transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="font-semibold text-sm">Unggah Surat Sehat</span>
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
  
            </div>
            
            {/* Keamanan Data */}
            <div className="mt-8 bg-gray-50 rounded-xl p-4 flex items-center justify-center gap-3 text-sm text-gray-500 border border-gray-200">
               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               Data Anda dienkripsi dan hanya digunakan untuk keperluan perizinan pendakian.
            </div>

          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in">
            {/* Header ditiadakan agar lebih bersih seperti desain Anda */}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              
              {/* KOLOM KIRI: Ringkasan & Syarat Ketentuan (Porsi 2/3) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Card Ringkasan Pemesanan */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Ringkasan Pemesanan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Jalur Pendakian</div>
                        <div className="font-bold text-gray-900 text-sm">Jalur Dieng (Favorit)</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Jumlah Pendaki</div>
                        <div className="font-bold text-gray-900 text-sm">4 Orang (WNI)</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Waktu Kunjungan</div>
                        <div className="font-bold text-gray-900 text-sm">12 Mei - 14 Mei 2024 (3H 2M)</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs text-gray-500 mb-1">Ketua Kelompok</div>
                        <div className="font-bold text-gray-900 text-sm">Aditya Pratama</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Syarat & Ketentuan */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Syarat & Ketentuan</h3>
                  <div className="border border-gray-200 rounded-xl p-5 bg-white h-48 overflow-y-auto mb-5 text-sm text-gray-600 space-y-4 shadow-inner">
                    <p>1. Pendaki wajib membawa perlengkapan standar keamanan pendakian (Sepatu, Jaket, Tenda, Sleeping Bag).</p>
                    <p>2. Dilarang membawa senjata tajam (kecuali pisau lipat camping), narkoba, dan minuman keras.</p>
                    <p>3. Seluruh sampah yang dihasilkan wajib dibawa turun kembali ke basecamp.</p>
                    <p>4. Pendakian hanya diperbolehkan pada jalur resmi yang telah ditentukan.</p>
                    <p>5. Pengelola tidak bertanggung jawab atas kehilangan barang pribadi selama pendakian.</p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-emerald-700 border-gray-300 rounded focus:ring-emerald-600 cursor-pointer" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Saya telah membaca dan menyetujui seluruh aturan keselamatan dan prosedur operasional pendakian Gunung Prau.</span>
                  </label>
                </div>

              </div>

              {/* KOLOM KANAN: Rincian Biaya (Porsi 1/3) */}
              <div className="space-y-6">
                
                {/* Card Pembayaran */}
                <div className="bg-[#f0f4f8] border border-blue-50 rounded-2xl p-6 shadow-inner">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Rincian Biaya</h3>
                  
                  <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Simaksi (4 x Rp25.000)</span>
                      <span className="text-gray-900 font-semibold">Rp100.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Biaya Fasilitas & Kebersihan</span>
                      <span className="text-gray-900 font-semibold">Rp40.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admin Sistem</span>
                      <span className="text-gray-900 font-semibold">Rp5.000</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-gray-900">Total Bayar</span>
                    <span className="text-xl font-extrabold text-emerald-700">Rp145.000</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-3">Metode Pembayaran</div>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="border-2 border-emerald-600 bg-white text-emerald-700 font-bold py-2.5 rounded-lg text-sm transition-transform active:scale-95 shadow-sm">QRIS</button>
                      <button className="border border-gray-200 bg-white text-gray-400 font-semibold py-2.5 rounded-lg text-sm hover:border-gray-300 transition-colors">VA</button>
                      <button className="border border-gray-200 bg-white text-gray-400 font-semibold py-2.5 rounded-lg text-sm hover:border-gray-300 transition-colors">Card</button>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Pembayaran Terenkripsi & Aman
                  </div>
                </div>

                {/* Info Timeout Alert */}
                <div className="bg-[#eef8eb] border border-[#d1e6cc] rounded-xl p-4 flex gap-3 text-sm text-emerald-800 shadow-sm">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="leading-relaxed">Pembayaran harus diselesaikan dalam <span className="font-bold">15 menit</span> setelah konfirmasi untuk mengamankan kuota.</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 4. TOMBOL NAVIGASI BAWAH */}
        <div className="flex justify-between items-center mt-8 border-t border-gray-200 pt-6">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              currentStep === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Kembali
          </button>

          <button 
            onClick={nextStep}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
          >
            {currentStep === 4 ? 'Konfirmasi & Bayar' : 'Lanjutkan'}
            {currentStep !== 4 && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
          </button>
        </div>

      </main>
    </div>
  );
};

export default Registration;