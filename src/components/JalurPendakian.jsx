const JalurPendakian = () => {
  // Data sementara 
  const dataJalur = [
    {
      id: 1,
      nama: "Patak Banteng",
      tingkat: "MENENGAH",
      jarak: "2.5 KM",
      waktu: "3 - 4 Jam",
      deskripsi: "Jalur tercepat dan terfavorit dengan pemandangan sunrise terbaik.",
      // Menggunakan gambar placeholder sementara
      gambar: "https://images.unsplash.com/photo-1608965223882-d8a0059e50d5?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      nama: "Dieng",
      tingkat: "MUDAH",
      jarak: "4.2 KM",
      waktu: "4 - 5 Jam",
      deskripsi: "Jalur landai dengan tanjakan yang relatif santai, cocok untuk pemula.",
      gambar: "https://images.unsplash.com/photo-1667542027645-5ba2fd10aced?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGd1bnVuZyUyMHByYXV8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 3,
      nama: "Kalilembu",
      tingkat: "MUDAH",
      jarak: "3.8 KM",
      waktu: "4 Jam",
      deskripsi: "Menawarkan ketenangan melewati hutan pinus yang asri dan udara sejuk.",
      gambar: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 4,
      nama: "Igirmranak",
      tingkat: "MENENGAH",
      jarak: "5.0 KM",
      waktu: "5 - 6 Jam",
      deskripsi: "Jalur paling sepi dan alami, melewati padang sabana yang luas.",
      gambar: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section Khusus Jalur Pendakian */}
      <div
        className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center"
        // Silakan ganti link unsplash ini dengan link gambar yang Anda suka
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/4552239/pexels-photo-4552239.jpeg')" 
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 px-8 md:px-16 max-w-3xl text-white">
          {/* Breadcrumb (Navigasi Jejak) */}
          <p className="text-sm text-gray-300 mb-3">
            Beranda &gt; <span className="text-white font-semibold">Jalur Pendakian</span>
          </p>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Eksplorasi Jalur Terbaik Gunung Prau 2.565 MDPL
          </h1>
          
          <p className="text-base md:text-lg mb-6 text-gray-200">
            Pilih gerbang petualanganmu. Dari tanjakan menantang Patak Banteng hingga ketenangan jalur Igirmranak, temukan rute yang sesuai dengan pengalamanmu.
          </p>
          
          <button className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-2 rounded-md font-medium transition duration-300 flex items-center">
            Pilih Rute
            {/* Ikon Panah ke Bawah */}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </button>
        </div>
      </div>

      {/* 2. Bagian Daftar Kartu Jalur */}
      <section className="py-16 px-8 md:px-16 w-full max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <p className="text-emerald-700 font-semibold tracking-wider text-sm mb-2">BASECAMP RESMI</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Daftar Jalur Pendakian Terverifikasi</h2>
          <p className="text-gray-600 max-w-2xl">
            Pastikan Anda mendaki melalui jalur resmi untuk menjamin keselamatan dan membantu konservasi lingkungan Gunung Prau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataJalur.map((jalur) => (
            <div key={jalur.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <div 
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${jalur.gambar})` }}
              ></div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${jalur.tingkat === 'MUDAH' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {jalur.tingkat}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">• {jalur.jarak}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{jalur.nama}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">{jalur.deskripsi}</p>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-xs text-gray-400">ESTIMASI</p>
                    <p className="font-semibold text-gray-800 text-sm">{jalur.waktu}</p>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold flex items-center">
                    Lihat Detail
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JalurPendakian;