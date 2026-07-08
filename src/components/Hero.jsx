const Hero = () => {
  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center flex items-center"
      style={{ 
        backgroundImage: "url('https://images.pexels.com/photos/2835562/pexels-photo-2835562.jpeg')"
      }}
    >
      {/* Overlay gelap agar teks putih tetap terbaca walaupun gambar latarnya terang */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Konten Teks dan Tombol */}
      <div className="relative z-10 px-8 md:px-16 max-w-4xl text-white">
        <p className="text-xs md:text-sm font-semibold tracking-wider text-green-300 mb-3 uppercase">
          Mount Prau Registration System
        </p>
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          PRAMAS: Pendakian Gunung Prau Lebih Aman & Terencana
        </h1>
        
        <p className="text-base md:text-lg mb-8 text-gray-200 max-w-2xl">
          Sistem resmi manajemen kuota dan pendaftaran pendakian Gunung Prau. Pastikan keamanan dan kenyamanan perjalanan Anda dengan merencanakan pendakian secara bertanggung jawab.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 flex items-center justify-center">
            {/* Ikon User */}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Registrasi Sekarang
          </button>
          
          <button className="bg-transparent border border-white hover:bg-white/20 text-white px-6 py-3 rounded-md font-medium transition duration-300 flex items-center justify-center">
            {/* Ikon Buku/Panduan */}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Pelajari Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;