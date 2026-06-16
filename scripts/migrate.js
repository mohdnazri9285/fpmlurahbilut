const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// === MANUAL CONFIG ===
// Paste terus URL dan key kat sini (guna dari .env.local)
const SUPABASE_URL = 'https://ipagjpoiesnkiqxexpqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYWdqcG9pZXNua2lxeGV4cHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1ODk5NjksImV4cCI6MjA5NzE2NTk2OX0.Wn1ZxTMY3q0k8IdTiZPzMsxPgXtQC-x7xg3XRkS8GRc';
// =========================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// TRANSFORM FUNCTIONS
// =============================================

function transformHasil(data) {
  return {
    peringkat: data.Peringkat,
    blok: data.Blok,
    dirian_pokok: parseInt(data['Dirian Pokok']) || 0,
    luas: parseFloat(data.Luas) || 0,
    jumlah_pokok: parseInt(data['Jumlah Pokok']) || 0,
    target_hasil: parseFloat(data['Target Hasil']) || 0,
    hasil_jan: parseFloat(data['Hasil Sebenar January']) || 0,
    hasil_feb: parseFloat(data['Hasil Sebenar February']) || 0,
    hasil_mar: parseFloat(data['Hasil Sebenar March']) || 0,
    hasil_apr: parseFloat(data['Hasil Sebenar April']) || 0,
    hasil_may: parseFloat(data['Hasil Sebenar May']) || 0,
    hasil_jun: parseFloat(data['Hasil Sebenar June']) || 0,
    hasil_jul: parseFloat(data['Hasil Sebenar July']) || 0,
    hasil_aug: parseFloat(data['Hasil Sebenar August']) || 0,
    hasil_sep: parseFloat(data['Hasil Sebenar September']) || 0,
    hasil_oct: parseFloat(data['Hasil Sebenar October']) || 0,
    hasil_nov: parseFloat(data['Hasil Sebenar November']) || 0,
    hasil_dec: parseFloat(data['Hasil Sebenar December']) || 0,
    jumlah_hasil: parseFloat(data['Jumlah Hasil (Metrik Tan)']) || 0,
    pencapaian: parseFloat(data['Pencapaian Hasil (Tan/Hektar)']) || 0
  };
}

function transformTandan(data) {
  return {
    peringkat: data.Peringkat,
    blok: data.Blok,
    dirian_pokok: parseInt(data['Dirian Pokok']) || 0,
    luas: parseFloat(data.Luas) || 0,
    jumlah_pokok: parseInt(data['Jumlah Pokok']) || 0,
    tandan_jan: parseInt(data['Tandan Sebenar January']) || 0,
    tandan_feb: parseInt(data['Tandan Sebenar February']) || 0,
    tandan_mar: parseInt(data['Tandan Sebenar March']) || 0,
    tandan_apr: parseInt(data['Tandan Sebenar April']) || 0,
    tandan_may: parseInt(data['Tandan Sebenar May']) || 0,
    tandan_jun: parseInt(data['Tandan Sebenar June']) || 0,
    tandan_jul: parseInt(data['Tandan Sebenar July']) || 0,
    tandan_aug: parseInt(data['Tandan Sebenar August']) || 0,
    tandan_sep: parseInt(data['Tandan Sebenar September']) || 0,
    tandan_oct: parseInt(data['Tandan Sebenar October']) || 0,
    tandan_nov: parseInt(data['Tandan Sebenar November']) || 0,
    tandan_dec: parseInt(data['Tandan Sebenar December']) || 0,
    jumlah_tandan: parseInt(data['Jumlah Tandan']) || 0,
    tm_jan: parseInt(data['Tandan Muda January']) || 0,
    tm_feb: parseInt(data['Tandan Muda February']) || 0,
    tm_mar: parseInt(data['Tandan Muda March']) || 0,
    tm_apr: parseInt(data['Tandan Muda April']) || 0,
    tm_may: parseInt(data['Tandan Muda May']) || 0,
    tm_jun: parseInt(data['Tandan Muda June']) || 0,
    tm_jul: parseInt(data['Tandan Muda July']) || 0,
    tm_aug: parseInt(data['Tandan Muda August']) || 0,
    tm_sep: parseInt(data['Tandan Muda September']) || 0,
    tm_oct: parseInt(data['Tandan Muda October']) || 0,
    tm_nov: parseInt(data['Tandan Muda November']) || 0,
    tm_dec: parseInt(data['Tandan Muda December']) || 0,
    jumlah_tm: parseInt(data['Jumlah Tandan Muda']) || 0,
    berat_jan: parseFloat(data['Berat Tandan January']) || 0,
    berat_feb: parseFloat(data['Berat Tandan February']) || 0,
    berat_mar: parseFloat(data['Berat Tandan March']) || 0,
    berat_apr: parseFloat(data['Berat Tandan April']) || 0,
    berat_may: parseFloat(data['Berat Tandan May']) || 0,
    berat_jun: parseFloat(data['Berat Tandan June']) || 0,
    berat_jul: parseFloat(data['Berat Tandan July']) || 0,
    berat_aug: parseFloat(data['Berat Tandan August']) || 0,
    berat_sep: parseFloat(data['Berat Tandan September']) || 0,
    berat_oct: parseFloat(data['Berat Tandan October']) || 0,
    berat_nov: parseFloat(data['Berat Tandan November']) || 0,
    berat_dec: parseFloat(data['Berat Tandan December']) || 0,
    purata_berat: parseFloat(data['Purata Berat Tandan']) || 0
  };
}

function transformPembajaan(data) {
  return {
    peringkat: data.Peringkat,
    luas: parseFloat(data['Luas (Ha)']) || 0,
    pusingan: parseInt(data.Pusingan) || 0,
    kadar: parseFloat(data['Kadar (kg/pokok)']) || 0,
    keperluan: parseInt(data['Keperluan (Beg)']) || 0,
    spreader: parseInt(data['Spreader (Beg)']) || 0,
    manual: parseInt(data['Manual (Beg)']) || 0,
    siap: parseInt(data['Siap (Beg)']) || 0,
    peratus_siap: parseInt(data['% Siap']) || 0
  };
}

function transformMerumput(data) {
  return {
    peringkat: data.Peringkat,
    luas: parseFloat(data['Luas (Ha)']) || 0,
    pusingan_1: parseFloat(data['Pusingan 1']) || 0,
    pusingan_2: parseFloat(data['Pusingan 2']) || 0,
    pusingan_3: parseFloat(data['Pusingan 3']) || 0
  };
}

function transformMekanisasi(data) {
  return {
    jentera: data.JENTERA,
    aplikasi: data.APLIKASI,
    jumlah: parseInt(data.JUMLAH) || 0
  };
}

function transformUser(data) {
  return {
    username: data['Nama Pengguna'],
    jawatan: data['Jawatan / Peranan'],
    user_id: data['id pengguna'],
    password_hash: data['kata laluan'],
    role: 'Supervisor'
  };
}

// =============================================
// MIGRATE FUNCTION
// =============================================

async function migrateCSV(filePath, tableName, transformFn) {
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const transformed = transformFn(data);
        // Skip if all values are empty
        if (Object.values(transformed).every(v => v === '' || v === null || v === undefined)) {
          return;
        }
        results.push(transformed);
      })
      .on('end', async () => {
        if (results.length === 0) {
          console.log(`⚠️ No data found in ${path.basename(filePath)}`);
          resolve();
          return;
        }
        
        try {
          // Insert in batches of 100
          for (let i = 0; i < results.length; i += 100) {
            const batch = results.slice(i, i + 100);
            const { error } = await supabase.from(tableName).insert(batch);
            if (error) {
              console.error(`❌ Error inserting into ${tableName}:`, error.message);
              // Continue with next batch
            }
          }
          console.log(`✅ ${results.length} rows inserted into ${tableName}`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

// =============================================
// RUN MIGRATION
// =============================================

async function runMigration() {
  console.log('🚀 Starting migration...\n');
  
  const dataDir = path.join(__dirname, '../data');
  
  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.error('❌ Data directory not found! Create a "data" folder and put your CSV files there.');
    return;
  }
  
  const files = {
    'hasil_2025.csv': { table: 'hasil_2025', transform: transformHasil },
    'hasil_2026.csv': { table: 'hasil_2026', transform: transformHasil },
    'laporan_tandan.csv': { table: 'laporan_tandan', transform: transformTandan },
    'pembajaan.csv': { table: 'pembajaan', transform: transformPembajaan },
    'merumput.csv': { table: 'merumput', transform: transformMerumput },
    'mekanisasi.csv': { table: 'mekanisasi', transform: transformMekanisasi },
    'user.csv': { table: 'users', transform: transformUser }
  };
  
  for (const [filename, config] of Object.entries(files)) {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      console.log(`📄 Processing ${filename}...`);
      await migrateCSV(filePath, config.table, config.transform);
    } else {
      console.log(`⚠️ File not found: ${filename}`);
    }
  }
  
  console.log('\n✅ Migration complete!');
}

runMigration().catch(console.error);