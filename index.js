// Import dependencies
require('dotenv').config(); // Memuat variabel dari .env
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Express app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware untuk parsing JSON body

// Inisialisasi Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ---- Definisi Rute API ----

// Root (Health Check)
app.get('/', (req, res) => {
    res.json({ message: 'API Layanan Cuci Sepatu Berjalan' });
});

// 1. CREATE (Tambah item baru)
app.post('/items', async (req, res) => {
    const { nama, status, tanggalMasuk } = req.body;

    // Validasi sederhana
    if (!nama) {
        return res.status(400).json({ error: 'Nama sepatu wajib diisi.' });
    }

    const { data, error } = await supabase
        .from('items')
        .insert([
            {
                nama: nama,
                status: status || 'Sedang Dicuci', // Default status
                tanggalMasuk: tanggalMasuk || new Date().toISOString().split('T')[0] // Default tgl hari ini
            }
        ])
        .select(); // Mengembalikan data yang baru dibuat

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Data sepatu berhasil ditambahkan.', data: data[0] });
});

// 2. READ (Ambil semua item + Filter by Status)
app.get('/items', async (req, res) => {
    const { status } = req.query; // Ambil query param 'status'

    let query = supabase.from('items').select('*');

    // Terapkan filter jika ada query ?status=
    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('id', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});

// 3. READ (Ambil satu item by ID)
app.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single(); // .single() untuk ambil 1 data atau null

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: 'Data sepatu tidak ditemukan.' });
    }

    res.status(200).json(data);
});

// 4. UPDATE (Update status atau data lain by ID)
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    // Ambil data yang ingin di-update dari body
    const { nama, status, tanggalSelesai } = req.body;

    // Buat objek update dinamis
    let updateData = {};
    if (nama) updateData.nama = nama;
    if (status) updateData.status = status;
    if (tanggalSelesai) updateData.tanggalSelesai = tanggalSelesai;

    const { data, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select(); // Mengembalikan data yang di-update

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Data sepatu tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Data sepatu berhasil diperbarui.', data: data[0] });
});

// 5. DELETE (Hapus item by ID)
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Data sepatu berhasil dihapus.' });
});


// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});