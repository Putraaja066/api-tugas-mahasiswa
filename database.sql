CREATE TABLE tugas_kuliah (
  id SERIAL PRIMARY KEY,
  nama_tugas VARCHAR(100) NOT NULL,
  mata_kuliah VARCHAR(100) NOT NULL,
  deadline DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'belum',
  prioritas VARCHAR(20) DEFAULT 'sedang',
  created_at TIMESTAMP DEFAULT NOW()
);