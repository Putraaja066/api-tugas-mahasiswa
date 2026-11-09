const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());

// 1. POST - tambah tugas baru
app.post('/tugas', async (req, res) => {
    try {
        const { nama_tugas, mata_kuliah, deadline, status, prioritas } = req.body;
        const result = await pool.query(
            `INSERT INTO tugas_kuliah (nama_tugas, mata_kuliah, deadline, status, prioritas)
       VALUES ($1, $2, $3, COALESCE($4, 'belum'), COALESCE($5, 'sedang')) RETURNING *`,
            [nama_tugas, mata_kuliah, deadline, status, prioritas]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET - semua tugas
app.get('/tugas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tugas_kuliah ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. GET - cari berdasarkan nama (HARUS di atas route :id)
app.get('/tugas/nama/:nama', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tugas_kuliah WHERE nama_tugas ILIKE $1',
            [`%${req.params.nama}%`]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET - berdasarkan ID
app.get('/tugas/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tugas_kuliah WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - update tugas
app.put('/tugas/:id', async (req, res) => {
    try {
        const { nama_tugas, mata_kuliah, deadline, status, prioritas } = req.body;
        const result = await pool.query(
            `UPDATE tugas_kuliah
       SET nama_tugas=$1, mata_kuliah=$2, deadline=$3, status=$4, prioritas=$5
       WHERE id=$6 RETURNING *`,
            [nama_tugas, mata_kuliah, deadline, status, prioritas, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE - hapus tugas
app.delete('/tugas/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM tugas_kuliah WHERE id=$1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        res.json({ message: 'Tugas berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));