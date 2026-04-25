# 🗨️ Chat Realtime Feature - Planning Document

Dokumen ini menjelaskan rencana implementasi fitur chat antara **Customer** dan **Owner** menggunakan **NestJS (Backend)** dan **Socket.io**.

---

## 🏗️ 1. Arsitektur Teknis
- **Backend Gateway**: NestJS WebSockets (`@nestjs/websockets`).
- **Engine**: Socket.io.
- **Persistence**: TypeORM (MySQL/PostgreSQL) untuk menyimpan riwayat chat.
- **Protocol**: WebSocket untuk pengiriman pesan, REST API untuk riwayat chat.

---

## 🗄️ 2. Skema Database (Entity)

### A. Conversation (Percakapan)
Tujuan: Menampung unik ID antara dua orang yang mengobrol.
- `id`: UUID (Primary Key)
- `customerId`: UUID (Relation to User)
- `ownerId`: UUID (Relation to User)
- `lastMessage`: Text (Preview pesan terakhir)
- `updatedAt`: Timestamp (Untuk sorting daftar chat terbaru)

### B. Message (Pesan)
Tujuan: Menyimpan setiap detail pesan yang dikirim.
- `id`: UUID (Primary Key)
- `conversationId`: UUID (Relation to Conversation)
- `senderId`: UUID (Relation to User)
- `text`: LongText (Konten pesan)
- `isRead`: Boolean (Default: false)
- `createdAt`: Timestamp

---

## 📡 3. WebSocket Events (Socket.io)

| Event Name | Sender | Deskripsi |
| :--- | :--- | :--- |
| `connection` | Client | Melakukan autentikasi via JWT saat user baru online. |
| `joinRoom` | Client | User masuk ke room ID tertentu (Conversation ID). |
| `sendMessage` | Client | Mengirim pesan (payload: text, conversationId). |
| `receiveMessage`| Server | Server memancarkan pesan ke penerima di room yang sama. |
| `typing` | Client | Mengirim status "User is typing...". |

---

## 🛣️ 4. API Endpoints (REST)

### 4.1 Get List Chat
- **Endpoint:** `GET /chat`
- **Tujuan:** Menampilkan daftar orang/kost yang pernah di-chat.

### 4.2 Get Chat History
- **Endpoint:** `GET /chat/:conversationId`
- **Tujuan:** Mengambil riwayat pesan lama saat pertama kali buka ruang chat.

### 4.3 Create/Find Conversation
- **Endpoint:** `POST /chat/start`
- **Request Body:** `{ ownerId: string }`
- **Tujuan:** Membuat percakapan baru atau mengembalikan ID percakapan jika sudah pernah ada.

---

## 🎨 5. Rencana UI (Frontend - mobile-kost)
1. **Layar Daftar Chat**: List percakapan yang masuk (di Tab baru atau Profile).
2. **Layar Chat Room**: 
   - Bubble chat (Kiri: Penerima, Kanan: Pengirim).
   - Input field + Tombol Kirim.
   - Indikator status (Online, sedang mengetik, atau pesan dibaca).
3. **Tombol di Detail Kost**: Menambahkan tombol "Chat Pemilik" untuk memicu `chat/start`.

---

## 🛠️ 6. Langkah Implementasi
1. **Fase 1 (Backend)**: Setup entities, migrations, dan gateway sederhana.
2. **Fase 2 (Backend)**: Hubungkan logika simpan ke DB dan proteksi JWT pada socket.
3. **Fase 3 (Frontend)**: Integrasi Socket.io-client di React Native.
4. **Fase 4 (Frontend)**: Pembuatan UI Screen Chat Room.
