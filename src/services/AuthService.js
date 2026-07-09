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

  // 2. Fungsi Login (Masuk)
  static async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      return { success: true, data: data };
    } catch (error) {
      console.error("Error saat Login:", error.message);
      return { success: false, pesan: error.message };
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