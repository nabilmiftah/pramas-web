import { useState } from 'react';

const Panduan = () => {
  // State untuk mengontrol FAQ yang terbuka
  const [faqAktif, setFaqAktif] = useState(null);

  const toggleFaq = (index) => {
    setFaqAktif(faqAktif === index ? null : index);
  };

  const dataFaq = [
    {
      tanya: "Dapatkah saya mengubah tanggal pendakian (Reschedule)?",
      jawab: "Ya, reschedule dapat dilakukan maksimal 3 hari sebelum tanggal keberangkatan awal, selama kuota di tanggal baru masih tersedia. Silakan hubungi layanan pelanggan kami untuk proses ini."
    },
    {
      tanya: "Bagaimana jika terjadi cuaca ekstrem?",
      jawab: "Keselamatan adalah prioritas utama. Jika pihak Basecamp atau otoritas setempat menutup jalur karena cuaca ekstrem, jadwal Anda dapat diubah (reschedule) tanpa batas waktu atau opsi pengembalian dana sesuai syarat yang berlaku."
    },
    {
      tanya: "Apakah pendaki solo diperbolehkan?",
      jawab: "Demi keselamatan, kami sangat menyarankan pendakian dilakukan minimal dalam grup beranggotakan 3 orang. Namun, pendaki solo diizinkan dengan syarat wajib melapor secara detail di Basecamp dan melengkapi formulir tanggung jawab pribadi."
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex items-center"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/34464864/pexels-photo-34464864.jpeg')" 
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-8 md:px-16 max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Panduan Booking Jalur<br/>Pendakian
          </h1>
          <p className="text-base md:text-lg text-gray-200">
            Ikuti langkah-langkah mudah di bawah ini untuk merencanakan petualangan pendakian Anda dengan aman dan terorganisir.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 space-y-24">
        
        {/* 2. Langkah Pendaftaran */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Langkah Pendaftaran</h2>
            <p className="text-gray-500">Proses digitalisasi pendakian untuk kenyamanan bersama.</p>
          </div>

          <div className="relative">
            {/* Garis penghubung (hanya terlihat di layar besar) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gray-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#0f291e] rounded-md flex items-center justify-center text-white mb-6 shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">1. Pilih Jalur & Tanggal</h3>
                <p className="text-sm text-gray-500">Pilih salah satu dari 4 jalur resmi dan tentukan tanggal keberangkatan sesuai kuota tersedia.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#0f291e] rounded-md flex items-center justify-center text-white mb-6 shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">2. Isi Data Pendaki</h3>
                <p className="text-sm text-gray-500">Lengkapi data diri ketua rombongan dan anggota tim sesuai identitas resmi (KTP/Passport).</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#0f291e] rounded-md flex items-center justify-center text-white mb-6 shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">3. Pembayaran</h3>
                <p className="text-sm text-gray-500">Lakukan pembayaran melalui transfer bank atau e-wallet dalam batas waktu 1x24 jam.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#0f291e] rounded-md flex items-center justify-center text-white mb-6 shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">4. Verifikasi E-Ticket</h3>
                <p className="text-sm text-gray-500">Setelah verifikasi, E-Ticket akan dikirim ke email untuk ditunjukkan di basecamp saat registrasi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Persyaratan Wajib */}
        <section className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm">
          <div className="w-full md:w-1/2">
            <div className="flex items-center mb-8">
              <svg className="w-6 h-6 text-emerald-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <h2 className="text-2xl font-bold text-gray-800">Persyaratan Wajib</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-700 rounded-full p-1 mt-1 mr-4 shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Identitas Diri Asli</h4>
                  <p className="text-sm text-gray-500">Wajib membawa KTP/Kartu Pelajar/Paspor asli untuk proses check-in di Basecamp.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-700 rounded-full p-1 mt-1 mr-4 shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Surat Keterangan Sehat</h4>
                  <p className="text-sm text-gray-500">Dokumen medis resmi yang dikeluarkan maksimal 3 hari sebelum tanggal pendakian.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-700 rounded-full p-1 mt-1 mr-4 shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Perlengkapan Standar</h4>
                  <p className="text-sm text-gray-500">Sepatu gunung, tenda double layer, sleeping bag, dan peralatan masak wajib dibawa.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop" 
              alt="Perlengkapan Pendakian" 
              className="w-full h-auto rounded-xl object-cover shadow-md"
            />
          </div>
        </section>

        {/* 4. Pertanyaan Sering Diajukan (FAQ) */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Pertanyaan Sering Diajukan (FAQ)</h2>
          <div className="space-y-4">
            {dataFaq.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-800 text-sm">{faq.tanya}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${faqAktif === index ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {faqAktif === index && (
                  <div className="px-6 pb-4 pt-1 border-t border-gray-50">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.jawab}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 5. Call To Action (CTA) */}
        <section className="bg-[#0f291e] rounded-2xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
          {/* Ornamen pola latar belakang (opsional untuk estetika) */}
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none"><circle cx="100" cy="0" r="100" fill="white"/></svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap untuk Mendaki?</h2>
            <p className="text-gray-300 mb-10 max-w-lg mx-auto">
              Kuota terbatas setiap harinya. Segera amankan slot perjalanan Anda hari ini.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-[#8cf0a1] hover:bg-[#72e089] text-[#0f291e] font-bold py-3 px-8 rounded-md transition duration-300 flex items-center w-full sm:w-auto justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Mulai Booking Sekarang
              </button>
              <button className="bg-transparent hover:bg-white/10 border border-white text-white font-semibold py-3 px-8 rounded-md transition duration-300 w-full sm:w-auto">
                Hubungi Support
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Panduan;