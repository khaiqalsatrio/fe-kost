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

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Akses:** Public
- **Deskripsi:** Mengautentikasi kredensial pengguna dan mengembalikan JWT Access Token serta status onboarding (`hasKost`).

**Response Success (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "Budi Santoso",
    "role": "OWNER",
    "hasKost": false // PENTING: Jika false, arahkan OWNER ke layar Onboarding Kost
  }
}
```

### 1.3 Get My Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Akses:** Private (Header Authorization Wajib)
- **Deskripsi:** Mendapatkan informasi profile user yang sedang login beserta status kepemilikan kost.

**Response Success:**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "Budi Santoso",
  "role": "OWNER",
  "hasKost": true
}
```

---

## 🔍 2. Modul Kost (Pencarian & Manajemen)

### 2.1 Get Semua Kost (Explore)
- **Method:** `GET`
- **Endpoint:** `/kost`
- **Akses:** Public
- **Deskripsi:** Menampilkan daftar semua kost. Mendukung *filtering* via query params (`?city=xxx&maxPrice=5000000`).

### 2.2 Get Detail Kost
- **Method:** `GET`
- **Endpoint:** `/kost/:id`
- **Akses:** Public
- **Deskripsi:** Mengambil informasi spesifik dan detail tentang suatu properti kos, termasuk daftar tipe kamar (`rooms`).

**Response Success:**
```json
{
  "id": "uuid-kost-1",
  "name": "Kost Ceria",
  "rooms": [
    {
      "id": "uuid-room-1",
      "name": "Kamar Mandi Dalam",
      "price_per_month": 1200000,
      "available_rooms": 3
    }
  ],
  "owner": { "name": "Bapak Kos", "email": "..." }
}
```

### 2.3 Create Kost Baru (Khusus Owner - Onboarding)
- **Method:** `POST`
- **Endpoint:** `/kost`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Membuat pendaftaran tawaran kos baru. **Setiap Owner hanya boleh memiliki 1 Kost.** Jika sudah punya, akan return error 409 Conflict.

### 2.4 Get My Kost (Dashboard Owner)
- **Method:** `GET`
- **Endpoint:** `/kost/my`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menampilkan data kost milik sendiri beserta daftar kamarnya.

### 2.5 Update Kost (Khusus Owner)
- **Method:** `PATCH`
- **Endpoint:** `/kost/:id`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Mengupdate informasi Kost utama.

---

## 🏗️ 3. Modul Kamar / Rooms (Detail Unit)

### 3.1 Create Tipe Kamar (Khusus Owner)
- **Method:** `POST`
- **Endpoint:** `/kost/rooms`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menambahkan jenis/tipe kamar ke dalam profil Kost milik owner.

**Request Body:**
```json
{
  "name": "Kamar AC & KM Dalam",
  "description": "Kamar luas 3x4, AC Daikin, Springbed",
  "price_per_month": 1500000,
  "total_rooms": 10,
  "available_rooms": 10,
  "facilities": ["AC", "WiFi", "Kamar Mandi Dalam"]
}
```

### 3.2 Update Tipe Kamar (Khusus Owner)
- **Method:** `PATCH`
- **Endpoint:** `/kost/rooms/:roomId`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Mengupdate detail unit kamar spesifik.

### 3.3 Delete Tipe Kamar (Khusus Owner)
- **Method:** `DELETE`
- **Endpoint:** `/kost/rooms/:roomId`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menghapus unit kamar tertentu. **(Catatan: Kost utama tidak dapat dihapus, hanya Unit Kamar yang boleh dihapus).**

---

## 💼 4. Modul Booking / Pesanan Sewa

### 4.1 Create Booking / Pesan Kost (Khusus Customer)
- **Method:** `POST`
- **Endpoint:** `/booking`
- **Akses:** Private, **Harus Role `CUSTOMER`**
- **Deskripsi:** Transaksi pengajuan sewa. Status otomatis menjadi `PENDING`.

### 4.2 Update Status Booking (Khusus Owner)
- **Method:** `PATCH`
- **Endpoint:** `/booking/:id/status`
- **Akses:** Private, **Harus Role `OWNER`**
- **Deskripsi:** Menyetujui (`APPROVED`) atau menolak (`REJECTED`) ajuan sewa.

---

## 🗨️ 5. Modul Chat Realtime (Socket.io)

Layanan Chat menggunakan **WebSocket** untuk pesan instan dan **REST API** untuk riwayat.

### 5.1 Memulai Chat
- **Method:** `POST`
- **Endpoint:** `/chat/start`
- **Body:** `{ "ownerId": "uuid-owner" }`
- **Deskripsi:** Membuat atau mengambil ID percakapan.

### 5.2 Get Daftar Chat
- **Method:** `GET`
- **Endpoint:** `/chat`
- **Deskripsi:** List orang yang pernah di-chat (untuk halaman inbox).

### 5.3 Get Riwayat Pesan
- **Method:** `GET`
- **Endpoint:** `/chat/:conversationId`
- **Deskripsi:** Riwayat bubble chat saat masuk ke room.

### 5.4 Socket Messaging (Events)
- **Host:** Base URL Backend
- **Auth:** Kirim JWT di `handshake.auth.token`
- **Events:**
  - `joinRoom`: Emit `conversationId` saat buka room.
  - `sendMessage`: Emit `{ conversationId, text }` untuk kirim pesan.
  - `receiveMessage`: Server akan emit ini ke client saat ada pesan masuk.
  - `typing`: Emit `{ conversationId, isTyping }` untuk status mengetik.

---

## 🚨 Error Handling
Backend menggunakan response standar NestJS:
```json
{
  "statusCode": 400,
  "message": ["message error"],
  "error": "Bad Request"
}
```
*Gunakan response message ini di React Native Toast atau Snackbar untuk info bagi User.*
