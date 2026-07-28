import React from 'react';

const FasilitasBeranda = () => {
  // Data statis untuk fasilitas basecamp
  const daftarFasilitas = [
    {
      id: 1,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      ),
      judul: "Basecamp 24 Jam",
      deskripsi: "Pelayanan registrasi, informasi cuaca, dan posko pantau pendakian yang selalu siaga setiap saat."
    },
    {
      id: 2,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      ),
      judul: "Fasilitas Kesehatan",
      deskripsi: "Dilengkapi ruang p3k dasar, tabung oksigen darurat, dan tim medis siaga untuk penanganan pertama."
    },
    {
      id: 3,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      ),
      judul: "Pusat Pengisian Daya",
      deskripsi: "Tersedia area khusus charging station gratis untuk memastikan komunikasi pendaki tidak terputus."
    },
    {
      id: 4,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
      ),
      judul: "Fasilitas Sanitasi",
      deskripsi: "Toilet dan kamar mandi yang bersih, air mengalir 24 jam, serta area mencuci peralatan masak."
    },
    {
      id: 5,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      ),
      judul: "Warung Logistik",
      deskripsi: "Menyediakan kebutuhan logistik makanan, minuman hangat, dan penyewaan alat pendakian standar."
    },
    {
      id: 6,
      ikon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      ),
      judul: "Penitipan Barang",
      deskripsi: "Loker keamanan dan area parkir kendaraan (motor/mobil) luas yang dijaga ketat selama 24 jam."
    }
  ];

  return (
    <section className="py-20 px-8 md:px-16 w-full bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-emerald-700 font-bold tracking-wider text-xs uppercase mb-2 block">
            Kenyamanan Maksimal
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f291e] mb-4">
            Layanan & Fasilitas Basecamp
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Kami memastikan persiapan dan kepulangan Anda terfasilitasi dengan baik melalui pengelolaan basecamp yang terintegrasi dan profesional.
          </p>
        </div>

        {/* Grid Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {daftarFasilitas.map((fasilitas) => (
            <div 
              key={fasilitas.id} 
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                {fasilitas.ikon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {fasilitas.judul}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {fasilitas.deskripsi}
              </p>
            </div>
          ))}
        </div>

        {/* Info Tambahan Bawah */}
        <div className="mt-16 bg-[#eef8eb] border border-[#d1e6cc] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm md:text-base">Keamanan Terpadu</h4>
              <p className="text-xs md:text-sm text-emerald-700 mt-1">Seluruh jalur dilengkapi sistem checkpoint komunikasi radio tim SAR.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FasilitasBeranda;