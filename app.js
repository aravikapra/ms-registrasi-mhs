const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_ms_spp'
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal: ' + err.stack);
    return;
  }

  console.log('Terhubung ke database dengan ID ' + connection.threadId);

  // Mulai tambahkan 1000 data dummy
//   addDummyData(0)
//     .then(() => {
//       // Tutup koneksi setelah operasi selesai
//       connection.end();
//     })
//     .catch((error) => {
//       console.error('Terjadi kesalahan: ' + error);
//       connection.end();
//     });
});
function getRandomnim() {
    const randomNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    return String(randomNumber);
  }

function generateRandomNIK() {
    const randomNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    return String(randomNumber);
  }
  function getRandomStatus() {
    const statusOptions = ['on_registered', 'on_success', 'on_rejected'];
    return statusOptions[Math.floor(Math.random() * statusOptions.length)];
  }
  
  // Fungsi untuk mendapatkan jenis kelamin acak
  function getRandomGender() {
    const genderOptions = ['male', 'female'];
    return genderOptions[Math.floor(Math.random() * genderOptions.length)];
  }
  function getRandomDate() {
    const startDate = new Date(2020, 0, 1); // Mulai dari 1 Januari 2020
    const endDate = new Date(); // Sampai dengan tanggal saat ini
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    return randomDate.toISOString().slice(0, 19).replace("T", " "); // Format tanggal untuk MySQL
  }
function addDummyData(index) {
  if (index === 900) {
    return Promise.resolve(); // Semua data telah ditambahkan
  }

  return new Promise((resolve, reject) => {
    const nik = generateRandomNIK();
    const status = getRandomStatus();
    const created_at = getRandomDate();
    const modified_at = getRandomDate();

    const registrasiData = {
      nik,
      status,
      created_at,
      modified_at
    };

    connection.query('INSERT INTO tbl_registrasi SET ?', registrasiData, (error, results) => {
      if (error) {
        reject(error);
      }

      const regId = results.insertId;

      const mahasiswaData = {
        reg_id: regId,
        nim: getRandomnim(),
        nama: 'Nama Mahasiswa ' + index,
        alamat: 'Alamat Mahasiswa ' + index,
        jenis_kelamin: getRandomGender(),
        created_at: getRandomDate(),
        modified_at: getRandomDate()
      };

      connection.query('INSERT INTO tbl_mahasiswa SET ?', mahasiswaData, (error, results) => {
        if (error) {
          reject(error);
        }

        console.log('Data berhasil ditambahkan ke tabel tbl_mahasiswa dengan ID ' + results.insertId);

        // Lanjutkan dengan data selanjutnya
        addDummyData(index + 1)
          .then(resolve)
          .catch(reject);
      });
    });
  });
}
  
app.get('/api/mahasiswa', (req, res) => {
    const query = 'SELECT * FROM tbl_mahasiswa';
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Terjadi kesalahan: ' + error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
        return;
      }
      res.json({ data: results });
    });
  });
  
  // GET data registrasi
  app.get('/api/registrasi', (req, res) => {
    const query = 'SELECT * FROM tbl_registrasi';
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Terjadi kesalahan: ' + error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
        return;
      }
      res.json({ data: results });
    });
  });

  app.get('/api/mahasiswa-registrasi', (req, res) => {
    const query = 'SELECT m.*, r.* FROM tbl_mahasiswa m JOIN tbl_registrasi r ON m.reg_id = r.id';
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Terjadi kesalahan: ' + error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
        return;
      }
      res.json({ data: results });
    });
  });
// Fungsi-fungsi lainnya tetap sama seperti pada contoh sebelumnya...
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });