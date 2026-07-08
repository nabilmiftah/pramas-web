import { supabase } from './supabaseClient'; // Sesuaikan path ini dengan letak file konfigurasi Supabase Anda

class KuotaService {
  // Fungsi khusus untuk mengambil data kuota beserta nama jalurnya
  static async getKuotaDenganJalur() {
    try {
      // Melakukan JOIN: Ambil semua data kuota_harian, lalu intip tabel jalur_pendakian
      // untuk mengambil kolom nama_jalur (atau nama, sesuaikan dengan nama kolom di tabel Anda)
      const { data, error } = await supabase
        .from('kuota_harian')
        .select(`
          id_kuota,
          tanggal,
          sisa_kuota,
          id_jalur,
          jalur_pendakian (
            nama_jalur,
            gambar
          )
        `)
        // Opsional: Urutkan berdasarkan tanggal terdekat
        .order('tanggal', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error mengambil data kuota terpadu:", error.message);
      return null;
    }
  }
}

export default KuotaService;