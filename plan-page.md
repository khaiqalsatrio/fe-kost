# 🏠 Kost App — Frontend Planning (React Native)

## 📌 Overview
Aplikasi mobile untuk mencari dan menyewa kost berbasis React Native, terintegrasi dengan REST API backend.

Pendekatan:
- Clean Architecture
- BLoC State Management
- Role-based UI (Customer & Owner)

---

# 🎯 1. Tujuan Aplikasi

- Customer dapat mencari dan booking kost
- Owner dapat mengelola kost dan menerima booking
- Sistem berbasis token (JWT Authentication)

---

# 🧱 2. Struktur Halaman (Screens)

---

## 🔐 AUTH MODULE

### 1. Login Screen
- Input: email, password
- API: POST /auth/login
- Output: accessToken

---

### 2. Register Screen
- Input:
  - name
  - email
  - password
  - role (CUSTOMER / OWNER)
- API: POST /auth/register

---

### 3. Profile Screen
- Menampilkan data user
- API: GET /auth/me

---

## 🏡 CUSTOMER MODULE

### 4. Home / Explore Screen
- Menampilkan list kost
- API: GET /kost
- Features:
  - Search by city
  - List card kost

---

### 5. Detail Kost Screen
- Menampilkan detail kost
- API: GET /kost/:id
- Features:
  - Image
  - Description
  - Facilities
  - Price
  - Button Booking

---

### 6. Booking Screen
- Form booking:
  - startDate
  - durationMonths
- API: POST /booking

---

### 7. Riwayat Booking Screen
- Menampilkan semua booking user
- API: GET /booking
- Status:
  - PENDING
  - APPROVED
  - REJECTED

---

## 🧑‍💼 OWNER MODULE

### 8. Dashboard Owner
- Menampilkan kost milik sendiri
- API: GET /kost/my

---

### 9. Create Kost Screen
- Form:
  - name
  - description
  - address
  - city
  - price
  - facilities
  - images
- API: POST /kost

---

### 10. Edit Kost Screen
- Update data kost
- API: PATCH /kost/:id

---

### 11. Incoming Booking Screen
- List booking masuk
- API: GET /booking/incoming

---

### 12. Approval Booking
- Approve / Reject booking
- API: PATCH /booking/:id/status

---

# 🧭 3. Navigation Structure

## 📱 Customer
- Home
- Booking History
- Profile

## 📱 Owner
- Dashboard Kost
- Incoming Booking
- Profile

---

# 🧩 4. Arsitektur Folder (Clean Architecture)
