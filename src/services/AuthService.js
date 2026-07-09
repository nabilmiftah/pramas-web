import { supabase } from './supabaseClient';

class AuthService {
  // 1. Fungsi Registrasi (Daftar Akun Baru)
  static async register(email, password, namaLengkap, noTelepon) {
    try {
      // Langkah A: Daftarkan email & password ke sistem keamanan Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Langkah B: Jika sukses, simpan profil pengguna ke tabel 'pengguna' Anda
      // (Pastikan nama kolom di bawah ini sesuai dengan tabel pengguna Anda di Supabase)
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('pengguna')
          .insert([
            {
              nama_lengkap: namaLengkap,
              email: email,
              no_hp: noTelepon,
              role: 'pendaki', // Otomatis menjadi pendaki saat mendaftar
              password: 'ENCRYPTED_BY_AUTH'
            }
          ]);
          
        if (dbError) {
          console.error("Gagal menyimpan ke tabel pengguna:", dbError.message);
          // Catatan: Di aplikasi nyata, jika ini gagal, kita mungkin perlu menghapus auth.user
        }
      }
      
      return { success: true, data: authData };
    } catch (error) {
      console.error("Error saat Registrasi:", error.message);
      return { success: false, pesan: error.message };
    }
  }

  // 2. Fungsi Login
  static async login(email, password) {
    try {
      // Tahap 1: Validasi keamanan (cek email dan sandi di brankas Supabase)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Tahap 2: Ambil data 'role' dari tabel 'pengguna' publik Anda
      const { data: userData, error: dbError } = await supabase
        .from('pengguna')
        .select('role, nama_lengkap')
        .eq('email', email)
        .single(); // .single() digunakan karena email pasti unik (1 baris)

      if (dbError) {
        console.error("Gagal mengambil role pengguna:", dbError.message);
      }

      // Gabungkan data sesi dengan data role agar bisa dibaca oleh Login.jsx
      return { 
        success: true, 
        user: authData.user,
        role: userData ? userData.role : 'pendaki', // Default ke pendaki jika kosong
        nama: userData ? userData.nama_lengkap : 'Pengguna'
      };

    } catch (error) {
      console.error("Error saat Login:", error.message);
      return { success: false, pesan: "Email atau kata sandi tidak valid. Silakan coba lagi." };
    }
  }

  // 3. Fungsi Logout (Keluar)
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error saat Logout:", error.message);
      return { success: false, pesan: error.message };
    }
  }

  // 4. Fungsi untuk mengecek siapa yang sedang login saat ini
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

export default AuthService;