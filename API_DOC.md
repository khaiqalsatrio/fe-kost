# 📚 Rest API Documentation - Kost App

Dokumen ini berisi panduan teknis integrasi API Backend aplikasi Kost untuk kebutuhan pengembangan di Frontend (React Native). Semua request dan response di-format dalam bentuk `application/json`.

## 🌐 Base URL Konfigurasi
Backend saat ini berjalan di port **4000**.
Untuk mencoba di local Emulator Android, Anda sangat disarankan menggunakan Network IP Local atau Host loopback emulator:
- Android Emulator: `http://10.0.2.2:4000`
- Real Device / iOS Emulator: `http://<IP_LOCAL_KOMPUTER>:4000` (Misal: `http://192.168.1.10:4000`)

Anda juga bisa melihat dan mencoba langsung API melalui antarmuka **RapiDoc Documentation** yang tersedia di:
👉 `http://localhost:4000/docs`

---

## 🛡️ Otentikasi & Header
Sebagian besar endpoint memerlukan token otorisasi. Token didapatkan melalui endpoint Login. Sertakan token tersebut di setiap request yang membutuhkan autentikasi dalam header HTTP:

```json
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>",
  "Content-Type": "application/json"
}
```

---

## 🔐 1. Modul Autentikasi (Universal)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Akses:** Public
- **Deskripsi:** Mendaftarkan akun baru dengan spesifikasi Role ('CUSTOMER' atau 'OWNER').

**Request Body (`application/json`):**
```json
{
  "email": "user@example.com",
  "password": "password123", // Minimal 6 karakter
  "name": "Budi Santoso",
  "role": "CUSTOMER" // Pilihan: "CUSTOMER" atau "OWNER"
}
```

**Response Success (201 Created):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "Budi Santoso",
  "role": "CUSTOMER",
  "createdAt": "2024-05-01T00:00:00Z",
  "updatedAt": "2024-05-01T00:00:00Z"
}
```

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Akses:** Public
- **Deskripsi:** Mengautentikasi kredensial pengguna dan mengembalikan JWT Access Token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201 / 200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### 1.3 Get My Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Akses:** Private (Header Authorization Wajib)
- **Deskripsi:** Mendapatkan informasi profile user yang sedang login.

**Response Success:**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "Budi Santoso",
  "role": "CUSTOMER"
  // dll
}
```

---

## 🔍 2. Modul Kost (Pencarian & Manajemen)

### 2.1 Get Semua Kost (Explore)
- **Method:** `GET`
- **Endpoint:** `/kost`
- **Akses:** Public
- **Deskripsi:** Menampilkan daftar semua kost. Mendukung *filtering* via query params (`?city=xxx&maxPrice=5000000`).

**Response Success:**
```json
[
  {
    "id": "uuid-kost-1",
    "name": "Kost Ceria",
    "description": "Kost nyaman dan strategis dekat kampus",
    "address": "Jl. Merdeka No. 10",
    "city": "Jakarta",
    "price_per_month": 1500000,
    "facilities": ["AC", "WiFi", "Laundry"],
    "images": ["https://image.com/1.jpg"],
    "ownerId": "uuid-owner",
    "createdAt": "..."
  }
]
```

### 2.2 Get Detail Kost
- **Method:** `GET`
- **Endpoint:** `/kost/:id`
- **Akses:** Public
- **Deskripsi:** Mengambil informasi spesifik dan detail tentang suatu properti kos berdasar `id`.

**Response Success:** Mengembalikan Data Object (Single) seperti struktur 2.1.

### 2.3 Create Kost Baru (Khusus Owner)
- **Method:** `POST`
- **Endpoint:** `/kost`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Membuat pendaftaran tawaran kos baru oleh Bapak/Ibu Kos.

**Request Body:**
```json
{
  "name": "Kost Ceria",
  "description": "Kost nyaman dan strategis dekat kampus",
  "address": "Jl. Merdeka No. 10",
  "city": "Jakarta",
  "price_per_month": 1500000,
  "facilities": ["AC", "WiFi", "Laundry"],
  "images": ["https://image.com/1.jpg"]
}
```

### 2.4 Get Dashboard Kost Milik Sendiri (Khusus Owner)
- **Method:** `GET`
- **Endpoint:** `/kost/my`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menampilkan semua kost yang dimiliki dan dikelola oleh `req.user.id`.

### 2.5 Update Kost (Khusus Owner)
- **Method:** `PATCH`
- **Endpoint:** `/kost/:id`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Mengupdate informasi Kost. Semua body bersifat *opsional*.

**Request Body (Opsional):**
```json
{
  "name": "Kost Ceria Updated",
  "price_per_month": 2000000
}
```

### 2.6 Delete Kost (Khusus Owner)
- **Method:** `DELETE`
- **Endpoint:** `/kost/:id`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menghapus record kost.

---

## 💼 3. Modul Booking / Pesanan Sewa

### 3.1 Create Booking / Pesan Kost (Khusus Customer)
- **Method:** `POST`
- **Endpoint:** `/booking`
- **Akses:** Private, **Harus Role `CUSTOMER`**
- **Deskripsi:** Transaksi pengajuan sewa kos. Total harga akan dikalkulasi otomatis (`durationMonths` * `price_per_month` Kost). Status otomatis menjadi `PENDING`.

**Request Body:**
```json
{
  "kostId": "uuid-kost-id",
  "startDate": "2024-05-01",
  "durationMonths": 3
}
```

**Response Success:**
```json
{
  "id": "uuid-booking",
  "kostId": "uuid-kost-id",
  "customerId": "uuid-user-id",
  "startDate": "2024-05-01",
  "durationMonths": 3,
  "totalPrice": 4500000,
  "status": "PENDING",
  "createdAt": "..."
}
```

### 3.2 Get Transaksi Riwayat Sendiri (Khusus Customer)
- **Method:** `GET`
- **Endpoint:** `/booking`
- **Akses:** Private, **Harus Role `CUSTOMER`**
- **Deskripsi:** Menampilkan semua riwayat pesanan (baik pending, reject, atau approved) milik pengguna *Pencari Kos*.

### 3.3 Get Pesanan Masuk (Khusus Owner)
- **Method:** `GET`
- **Endpoint:** `/booking/incoming`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menampilkan dashboard bagi Pemilik Kos untuk melihat siapa saja *Customer* yang mengajukan penyewaan kamar pada semua Properti miliknya.

### 3.4 Update Status Booking (Khusus Owner)
- **Method:** `PATCH`
- **Endpoint:** `/booking/:id/status`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menyetujui atau menolak ajuan booking dari *Customer*. `id` pada endpoint adalah id dari `booking`.

**Request Body:**
```json
{
  "status": "APPROVED" // Hanya boleh "APPROVED" atau "REJECTED"
}
```

---

## 🚨 Error Handling

Jika terjadi kesalahan (Autentikasi gagal / Role Terlarang / Data Invalid), Backend akan membuang response NestJS berbentuk:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```
*Gunakan response message ini di React Native Toast atau Snackbar untuk info bagi User.*
