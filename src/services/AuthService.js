import { supabase } from './supabaseClient'; 

class AuthService {
  

  // Private 
  static #defaultRole = 'pendaki';

  // Private 
  static async #simpanProfilKeDatabase(email, namaLengkap, noTelepon) {
    const { error: dbError } = await supabase
      .from('pengguna')
      .insert([
        {
          nama_lengkap: namaLengkap,
          email: email,
          no_hp: noTelepon,
          role: this.#defaultRole, 
          password: 'ENCRYPTED_BY_AUTH'
        }
      ]);

    if (dbError) {
      throw new Error(`Gagal menyimpan ke tabel pengguna: ${dbError.message}`);
    }
  }

  // Private
  static async #ambilRolePengguna(email) {
    const { data: userData, error: dbError } = await supabase
      .from('pengguna')
      .select('role, nama_lengkap')
      .eq('email', email)
      .single();

    if (dbError) {
      console.error("Gagal mengambil role pengguna:", dbError.message);
      return null;
    }
    return userData;
  }

  static async register(email, password, namaLengkap, noTelepon) {
    try {
      // Langkah A: Autentikasi Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Langkah B: Panggil Private Method untuk menyimpan data (Kode menjadi jauh lebih bersih!)
      if (authData.user) {
        await this.#simpanProfilKeDatabase(email, namaLengkap, noTelepon);
      }
      
      return { success: true, data: authData };
    } catch (error) {
      console.error("Error saat Registrasi:", error.message);
      return { success: false, pesan: error.message };
    }
  }

  static async login(email, password) {
    try {
      // Tahap 1: Validasi keamanan 
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Tahap 2: Panggil Private Method untuk mengambil data role
      const userData = await this.#ambilRolePengguna(email);

      return { 
        success: true, 
        user: authData.user,
        role: userData ? userData.role : this.#defaultRole, 
        nama: userData ? userData.nama_lengkap : 'Pengguna'
      };

    } catch (error) {
      console.error("Error saat Login:", error.message);
      return { success: false, pesan: "Email atau kata sandi tidak valid. Silakan coba lagi." };
    }
  }

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

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

export default AuthService;