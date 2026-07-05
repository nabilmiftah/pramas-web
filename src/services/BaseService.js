import { supabase } from './supabaseClient.js';

// Ini adalah implementasi "Class" dalam OOP
class BaseService {
  
  // Constructor akan menerima nama tabel saat class ini dipanggil nanti
  constructor(tableName) {
    this.tableName = tableName;
    this.db = supabase;
  }

  // Method (Fungsi) untuk mengambil SEMUA data dari tabel
  async getAll() {
    const { data, error } = await this.db.from(this.tableName).select('*');
    if (error) {
      console.error(`Error mengambil data dari tabel ${this.tableName}:`, error.message);
      throw new Error(error.message);
    }
    return data;
  }

  // Method (Fungsi) untuk mengambil SATU data berdasarkan ID
  async getById(columnName, id) {
    const { data, error } = await this.db
      .from(this.tableName)
      .select('*')
      .eq(columnName, id)
      .single();
      
    if (error) {
      console.error(`Error mengambil data ID ${id}:`, error.message);
      throw new Error(error.message);
    }
    return data;
  }
}

export default BaseService;