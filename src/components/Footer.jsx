import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f291e] text-white pt-16 pb-8 px-8 md:px-16 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Kolom 1: Info Brand (Lebih Lebar) */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold tracking-wide mb-4">PRAMAS</h2>
          <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
            Sistem Manajemen Pendakian Terintegrasi Gunung Prau. Melayani pendaki dengan profesionalisme dan komitmen tinggi terhadap kelestarian alam.
          </p>
          
          {/* Ikon Sosial Media / Share */}
          <div className="flex space-x-4">
            <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-emerald-800 transition">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-emerald-800 transition">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            </button>
          </div>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Tautan Cepat</h3>
          <ul className="text-gray-400 text-sm space-y-3">
            <li><Link to="/" className="hover:text-white transition">Beranda</Link></li>
            <li><Link to="/cek-kuota" className="hover:text-white transition">Cek Kuota</Link></li>
            <li><Link to="/jalur" className="hover:text-white transition">Jalur Pendakian</Link></li>
            <li><Link to="/panduan" className="hover:text-white transition">Panduan Mendaki</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Dukungan */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Dukungan</h3>
          <ul className="text-gray-400 text-sm space-y-3">
            <li><a href="#" className="hover:text-white transition">Pusat Bantuan</a></li>
            <li><a href="#" className="hover:text-white transition">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-white transition">Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-white transition">Hubungi Kami</a></li>
          </ul>
        </div>
        
      </div>

      {/* Bagian Bawah: Copyright */}
      <div className="max-w-7xl mx-auto border-t border-emerald-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2024 PRAMAS Hiking Management. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;