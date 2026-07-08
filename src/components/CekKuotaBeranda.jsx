const CekKuotaBeranda = () => {
  // Data statis sementara menyesuaikan desain Landing Page
  const dataJalurHarian = [
    {
      id: 1,
      nama: "Jalur Patak Banteng",
      deskripsi: "Jalur tercepat dengan pemandangan sunrise terbaik.",
      sisaKuota: 124,
      status: "Tersedia",
      gambar: "https://images.pexels.com/photos/33679537/pexels-photo-33679537.jpeg"
    },
    {
      id: 2,
      nama: "Jalur Dieng",
      deskripsi: "Jalur landai, cocok untuk pendaki pemula.",
      sisaKuota: 85,
      status: "Tersedia",
      gambar: "https://images.unsplash.com/photo-1667542027645-5ba2fd10aced?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGd1bnVuZyUyMHByYXV8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 3,
      nama: "Jalur Kalilembu",
      deskripsi: "Jalur sepi dengan lanskap hutan pinus yang asri.",
      sisaKuota: 12,
      status: "Terbatas",
      gambar: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 4,
      nama: "Jalur Wekas",
      deskripsi: "Jalur panjang dengan variasi medan menantang.",
      sisaKuota: 0,
      status: "Penuh",
      // Menggunakan gambar hitam putih/grayscale untuk memberi kesan "Tutup/Penuh"
      gambar: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop&sat=-100" 
    }
  ];

  // Fungsi untuk menentukan warna badge status
  const getBadgeColor = (status) => {
    if (status === 'Penuh') return 'bg-red-500 text-white';
    if (status === 'Terbatas') return 'bg-yellow-400 text-yellow-900';
    return 'bg-emerald-600 text-white';
  };

  return (
    <section className="py-16 px-8 md:px-16 max-w-7xl mx-auto w-full">
      {/* Judul Bagian */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cek Kuota Pendakian</h2>
        <p className="text-gray-500 text-sm">Ketersediaan slot pendakian harian diperbarui secara real-time.</p>
      </div>

      {/* Kontrol Input Tanggal & Legend Warna */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <label className="block text-emerald-800 font-semibold text-sm mb-2">Pilih Tanggal Pendakian</label>
          <div className="relative">
            <input 
              type="date" 
              className="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
              defaultValue="2024-10-15"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex space-x-4 text-xs font-medium text-gray-600">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-2"></span>Tersedia</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2"></span>Terbatas</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>Penuh</div>
        </div>
      </div>

      {/* Deretan Kartu Kuota */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataJalurHarian.map((jalur) => (
          <div key={jalur.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
            {/* Area Gambar dengan Badge Status melayang di atasnya */}
            <div 
              className="h-36 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${jalur.gambar})` }}
            >
              <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-sm ${getBadgeColor(jalur.status)}`}>
                {jalur.status}
              </span>
            </div>
            
            {/* Info Jalur */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-emerald-800 font-bold text-lg mb-1">{jalur.nama}</h3>
              <p className="text-gray-500 text-xs mb-4 flex-grow">{jalur.deskripsi}</p>
              
              {/* Garis batas dan Info Angka Kuota */}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-auto">
                <span className="text-xs text-gray-400 font-medium tracking-wide">Sisa Kuota</span>
                <span className={`text-sm font-bold ${jalur.sisaKuota === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {jalur.sisaKuota} Orang
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CekKuotaBeranda;