import { useState, useEffect } from "react";
import JalurService from "../services/JalurService";

const JalurPendakian = () => {
  // State untuk menyimpan data dari database dan status loading
  const [dataJalur, setDataJalur] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect untuk memanggil data saat komponen pertama kali dirender
  useEffect(() => {
    const ambilData = async () => {
      try {
        setLoading(true);
        // Memanggil metode getAll() yang ada di JalurService
        const response = await JalurService.getAll();

        console.log("Data dari Supabase:", response);
        
        // Memasukkan data dari Supabase ke dalam state
        if (response) {
          setDataJalur(response);
        }
      } catch (error) {
        console.error("Gagal mengambil data jalur:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/10416510/pexels-photo-10416510.jpeg')" 
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-8 md:px-16 max-w-3xl text-white">
          <p className="text-sm text-gray-300 mb-3">
            Beranda &gt; <span className="text-white font-semibold">Jalur Pendakian</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Eksplorasi Jalur Terbaik Gunung Prau 2.565 MDPL
          </h1>
          <p className="text-base md:text-lg mb-6 text-gray-200">
            Pilih gerbang petualanganmu. Dari tanjakan menantang Patak Banteng hingga ketenangan jalur Igirmranak, temukan rute yang sesuai dengan pengalamanmu.
          </p>
        </div>
      </div>

      {/* Bagian Daftar Kartu Jalur */}
      <section className="py-16 px-8 md:px-16 w-full max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <p className="text-emerald-700 font-semibold tracking-wider text-sm mb-2">BASECAMP RESMI</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Daftar Jalur Pendakian Terverifikasi</h2>
          <p className="text-gray-600 max-w-2xl">
            Pastikan Anda mendaki melalui jalur resmi untuk menjamin keselamatan dan membantu konservasi lingkungan Gunung Prau.
          </p>
        </div>

        {/* Kondisi Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
            <span className="ml-3 text-emerald-800 font-medium">Memuat data dari database...</span>
          </div>
        ) : dataJalur.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Belum ada data jalur pendakian di database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mapping data dari database Supabase */}
            {dataJalur.map((jalur, index) => (
              <div key={jalur.id || index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden flex flex-col">
                <div 
                  className="h-48 w-full bg-cover bg-center bg-gray-200"
                  // Gunakan gambar default jika di database tidak ada kolom gambar
                  style={{ backgroundImage: `url(${jalur.gambar || 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=600&auto=format&fit=crop'})` }}
                ></div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${jalur.tingkat === 'MUDAH' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {/* Sesuaikan nama properti (misal: tingkat_kesulitan) dengan kolom di Supabase Anda */}
                      {jalur.tingkat || 'STANDARD'}
                    </span>
                  </div>
                  {/* Sesuaikan properti nama dengan kolom di Supabase (misal: nama_jalur) */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{jalur.nama_jalur || jalur.nama || 'Nama Jalur'}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">{jalur.deskripsi || 'Deskripsi jalur belum tersedia.'}</p>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-xs text-gray-400">STATUS</p>
                      <p className={`font-semibold text-sm ${jalur.status === 'Aktif' || jalur.status === 'Buka' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {jalur.status || 'Buka'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default JalurPendakian;