# REST API Layanan Cuci Sepatu

## Deskripsi Umum Proyek

Proyek ini adalah API sederhana yang dibuat menggunakan **Node.js** dan **Express.js**, berfungsi untuk mengelola data sepatu pada layanan jasa cuci sepatu. API ini terhubung ke database **Supabase** (PostgreSQL) dan di-deploy menggunakan **Vercel**.

Tujuan utama proyek ini adalah menyediakan *backend* yang fungsional untuk proses pencatatan (CRUD), pemantauan, dan pembaruan status cucian sepatu secara digital.

---

## Tujuan dan Fitur Utama

### Tujuan

Tujuan utama dari API ini adalah menyediakan sistem terpusat untuk melacak status setiap pasang sepatu yang masuk, mulai dari proses diterima, dicuci, hingga selesai dan siap diambil.

### Fitur Utama

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/` | Menampilkan pesan status bahwa API berjalan. |
| `GET` | `/items` | Mengambil dan menampilkan seluruh daftar data cucian sepatu. |
| `GET` | `/items?status=...` | Memfilter dan menampilkan data berdasarkan status (cth: `Selesai`). |
| `GET` | `/items/:id` | Mengambil dan menampilkan detail satu data sepatu berdasarkan ID. |
| `POST` | `/items` | Membuat entri data baru untuk sepatu yang baru diterima. |
| `PUT` | `/items/:id` | Memperbarui informasi atau status data sepatu yang sudah ada. |
| `DELETE` | `/items/:id` | Menghapus data sepatu dari daftar (misal: sudah diambil pelanggan). |

---

## Struktur Data

Data disimpan dalam tabel `items` di database Supabase.

| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| **id** | `bigint` (Primary Key) | ID unik (auto-increment) untuk setiap data cucian. |
| **created_at** | `timestamptz` | Waktu dan tanggal kapan data pertama kali dibuat. |
| **nama** | `text` | Nama atau deskripsi singkat sepatu (misal: "Nike Air Force 1"). |
| **status** | `text` | Status progres pencucian (Default: "Sedang Dicuci"). |
| **tanggalMasuk** | `date` | Tanggal saat sepatu diterima (Default: Hari ini). |
| **tanggalSelesai** | `date` | Tanggal saat proses pencucian selesai (Bisa NULL/kosong). |

---

## Contoh Request dan Response

Contoh-contoh berikut didasarkan pada data *live* dari *database*.

### 1. Mendapatkan Semua Item (READ)

* **Endpoint:** `GET /items`
* **Response Sukses (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nama": "Sepatu Baru",
        "status": "Selesai",
        "tanggalMasuk": "2025-10-23",
        "tanggalSelesai": "2025-10-23",
        "created_at": "2025-10-23T11:06:20.123Z"
      },
      {
        "id": 2,
        "nama": "NIKE VOMERO",
        "status": "Sedang Dicuci",
        "tanggalMasuk": "2025-10-23",
        "tanggalSelesai": null,
        "created_at": "2025-10-23T15:05:16.714Z"
      }
    ]
    ```

### 2. Memfilter Item berdasarkan Status (READ)

* **Endpoint:** `GET /items?status=Sedang Dicuci`
* **Response Sukses (200 OK):**
    ```json
    [
      {
        "id": 2,
        "nama": "NIKE VOMERO",
        "status": "Sedang Dicuci",
        "tanggalMasuk": "2025-10-23",
        "tanggalSelesai": null,
        "created_at": "2025-10-23T15:05:16.714Z"
      }
    ]
    ```

### 3. Membuat Item Baru (CREATE)

* **Endpoint:** `POST /items`
* **Request Body:**
    ```json
    {
      "nama": "NIKE VOMERO",
      "status": "Sedang Dicuci"
    }
    ```

* **Response Sukses (201 Created):**
    ```json
    {
      "message": "Data sepatu berhasil ditambahkan.",
      "data": {
        "id": 2,
        "nama": "NIKE VOMERO",
        "status": "Sedang Dicuci",
        "tanggalMasuk": "2025-10-23",
        "tanggalSelesai": null,
        "created_at": "2025-10-23T15:05:16.714Z"
      }
    }
    ```

### 4. Memperbarui Item (UPDATE)

* **Endpoint:** `PUT /items/1`
* **Request Body:**
    ```json
    {
      "status": "Selesai",
      "tanggalSelesai": "2025-10-23"
    }
    ```

* **Response Sukses (200 OK):**
    ```json
    {
      "message": "Data sepatu berhasil diperbarui.",
      "data": {
        "id": 1,
        "nama": "Sepatu Baru",
        "status": "Selesai",
        "tanggalMasuk": "2025-10-23",
        "tanggalSelesai": "2025-10-23",
        "created_at": "2025-10-23T11:06:20.123Z"
      }
    }
    ```

### 5. Menghapus Item (DELETE)

* **Endpoint:** `DELETE /items/1`
* **Response Sukses (200 OK):**
    ```json
    {
      "message": "Data sepatu berhasil dihapus."
    }
    ```

---

## Alur Pengujian API (Postman)

API ini telah diuji menggunakan Postman untuk memastikan semua fungsionalitas CRUD dan filter berjalan dengan baik. Alur pengujian yang dilakukan adalah sebagai berikut:

1.  **[POST] Tambah Sepatu:**
    * **Metode:** `POST`
    * **Endpoint:** `/items`
    * **Body:** Mengirim data `nama` dan `status` baru.
    * **Hasil:** Mendapat respons `201 Created` dan data baru (termasuk `id`).

2.  **[GET] Lihat Semua Sepatu:**
    * **Metode:** `GET`
    * **Endpoint:** `/items`
    * **Hasil:** Mendapat respons `200 OK` dan *array* JSON berisi semua data, termasuk data yang baru ditambahkan.

3.  **[PUT] Update Status:**
    * **Metode:** `PUT`
    * **Endpoint:** `/items/:id` (menggunakan `id` dari langkah 1)
    * **Body:** Mengirim data `status` dan `tanggalSelesai` yang baru.
    * **Hasil:** Mendapat respons `200 OK` dan data yang telah diperbarui.

4.  **[GET] Filter Status Selesai:**
    * **Metode:** `GET`
    * **Endpoint:** `/items?status=Selesai`
    * **Hasil:** Mendapat respons `200 OK` dan *array* JSON yang hanya berisi data dengan status "Selesai".

5.  **[DELETE] Hapus Sepatu:**
    * **Metode:** `DELETE`
    * **Endpoint:** `/items/:id` (menggunakan `id` yang sama)
    * **Hasil:** Mendapat respons `200 OK` dan pesan konfirmasi penghapusan.

---

## Langkah Instalasi dan Cara Menjalankan API

### 1. Clone Repository

Buka terminal Anda dan jalankan perintah berikut (ganti dengan URL repo Anda):
```bash
git clone [LINK_GITHUB_REPOSITORY_ANDA]
cd [NAMA_FOLDER_REPO_ANDA]
```

### 2. Install Dependencies

Instal semua *package* Node.js yang dibutuhkan proyek:
```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat sebuah file baru bernama .env di direktori utama proyek. Salin dan tempel format di bawah ini, lalu isi dengan kredensial dari dashboard Supabase Anda.
```bash
SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
SUPABASE_SERVICE_KEY=KUNCI_ANON_PUBLIK
```

### 3. Konfigurasi Environment Variables

```bash
npm run dev
```

## 📦 Link GitHub Repository
https://github.com/melakhaa/ResponsiModul1_PPPB_KEL32_Darren-Nathnael-Melakha.git

## 🌐 Link Deploy (Vercel)
https://responsi-modul1-pppb-kel-32-darren.vercel.app/
