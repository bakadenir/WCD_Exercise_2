# 📝 Catatan Git & GitHub Dasar

```bash
# Setup Repo Baru
echo "# NamaRepo" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/user/NamaRepo.git
git push -u origin main

# Branching & Workflow
git checkout -b feature/nama-fitur
git branch            # cek branch aktif (*)
git status            # lihat status file
git add .             # tambahkan semua perubahan
git commit -m "pesan perubahan"
git push -u origin feature/nama-fitur
git push              # push berikutnya cukup ini

# Pull Request (PR)
# buka GitHub → pilih branch baru → klik New Pull Request → arahkan ke main

# Update Perubahan
git switch feature/nama-fitur
git add .
git commit -m "perbaikan: bug xyz"
git push

# Sinkronisasi Repo
git clone <link-repo>
git pull

# 📦 Modul di JavaScript

Ada **2 jenis modul utama** dalam JavaScript:  
1. **CommonJS (CJS)**  
2. **ES Modules (ESM)**  

---

## 📌 Perbedaan CommonJS vs ES Modules

| Aspek   | CommonJS (CJS) | ES Modules (ESM) |
|---------|----------------|------------------|
| Sintaks | `require()` untuk import, `module.exports` untuk export | `import` / `export` |
| Default | Dipakai di Node.js versi lama | Standar resmi JavaScript (ES6), digunakan di browser & Node.js modern |

---

## 📝 Contoh Kode

```js
// CommonJS (CJS)
const fs = require("fs");

module.exports = {
  hello: function () {
    console.log("Hello dari CommonJS!");
  },
};

// ES Modules (ESM)
import fs from "fs";

export function hello() {
  console.log("Hello dari ES Modules!");
}
```

---

## ⚡ Ringkasan
CommonJS → require, module.exports, default di Node.js lama  
ES Modules → import, export, standar resmi JavaScript modern

---

# 🚀 Express Product API

Project ini adalah contoh sederhana REST API menggunakan **Express.js**.  
Arsitektur dipisah menjadi **server → routes → controllers** supaya rapi dan mudah dikembangkan.  
Data produk disimpan sementara di **in-memory array** (belum pakai database).

## 📝 Penjelasan Alur

### 🔹 Server (`server.js`)
Server adalah **gerbang utama** aplikasi.  
Semua request dari client masuk ke sini dulu, lalu diarahkan ke route yang sesuai.

- `import express` → ambil library Express.  
- `app.use(express.json())` → supaya bisa baca body JSON dari request.  
- `app.use("/products", productRoutes)` → semua permintaan yang menuju `/products` akan diteruskan ke routes produk.  
- `app.listen(...)` → nyalakan server di alamat `http://localhost:1000`.

---

### 🔹 Routes (`routes/productRoutes.js`)
Routes adalah **jalan atau rambu petunjuk**.  
Tugasnya menghubungkan URL tertentu ke fungsi yang ada di controller.

Contoh:
- `POST /products/` → arahkan ke controller `create`  
- `GET /products/` → arahkan ke controller `findAll`  
- `GET /products/:owner/:name` → arahkan ke controller `findByOwnerAndName`  
- `GET /products/:name` → arahkan ke controller `findByName`  

---

### 🔹 Controllers (`controllers/productController.js`)
Controllers adalah **otak** yang menjalankan logika.  
Di sini ada aturan apa yang harus dicek sebelum memberi jawaban.

Contoh fungsi:
- `create` → buat produk baru, validasi nama unik per toko, owner harus seller.  
- `findAll` → ambil semua produk.  
- `findByOwnerAndName` → ambil produk spesifik milik 1 owner.  
- `findByName` → cari produk berdasarkan nama (lintas toko).  

---

## 📌 Alur Sederhana
1. **Client** kirim request (misal `POST /products`).  
2. **Server** terima request.  
3. **Routes** cek URL dan method, lalu arahkan ke controller yang sesuai.  
4. **Controller** jalankan logika (validasi, cek data, dll).  
5. **Response** dikirim balik ke client dalam bentuk JSON.  

---

## ⚡ Ringkasan Awam
- **Server** = gerbang masuk  
- **Routes** = rambu jalan  
- **Controllers** = otak yang mengolah permintaan  

👉 Alurnya: `Request → Server → Routes → Controllers → Response`

---

## 📂 Struktur Project
```
project/
│
├─ server.js                # Entry point server
├─ routes/
│   └─ productRoutes.js     # Routing produk
└─ controllers/
    └─ productController.js # Logika bisnis produk
```

---

## 📌 1) server.js

```js
import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = 1000;

app.use(express.json());             // middleware parsing JSON body
app.use("/products", productRoutes); // pasang router products di prefix /products

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### 🛠️ Alur Singkat
- `import express` → ambil library Express.  
- `productRoutes` → impor router khusus products.  
- `app.use(express.json())` → enable baca `req.body` (JSON).  
- `app.use("/products", productRoutes)` → semua route produk diprefix `/products`:  
  - `POST /products/` → bikin produk  
  - `GET /products/` → ambil semua produk  
  - `GET /products/:owner/:name` → ambil produk spesifik per toko  
  - `GET /products/:name` → ambil produk dengan nama tertentu (lintas toko)  
- `app.listen(PORT, ...)` → jalankan server di `http://localhost:1000`.

---

## 📌 2) routes/productRoutes.js

```js
import { Router } from "express";
import {
  create,
  findAll,
  findByName,
  findByOwnerAndName,
} from "../controllers/productController.js";

const router = Router();

router.post("/", create);                   // POST   /products
router.get("/", findAll);                   // GET    /products
router.get("/:owner/:name", findByOwnerAndName); // GET /products/:owner/:name
router.get("/:name", findByName);           // GET    /products/:name

export default router;
```

**Catatan penting urutan route**: `/:owner/:name` harus didefinisikan **sebelum** `/:name`, agar path dinamis tidak tertangkap oleh yang lebih “umum”.

---

## 📌 3) controllers/productController.js (ringkas)

```js
import { findByUsername } from "./userController.js";

export const products = [
  { name:"Kopi Susu", category:"Beverage", price:20000, description:"Kopi susu botolan 250ml", owner:"seller1" }
];

const norm = (s) => String(s || "").trim().toLowerCase();

export const create = (req, res) => {
  try {
    const { name, category, price, description, owner } = req.body || {};

    if (!name || !owner) return res.status(400).json({ error: "field 'name' dan 'owner' wajib diisi" });

    const ownerUser = findByUsername(owner);
    if (!ownerUser) return res.status(400).json({ error: "owner tidak ditemukan di users" });
    if (String(ownerUser.role || "").toLowerCase() !== "seller")
      return res.status(403).json({ error: "hanya user dengan role 'seller' yang boleh membuat produk" });

    if (price !== undefined) {
      const num = Number(price);
      if (!Number.isFinite(num) || num < 0) return res.status(400).json({ error: "price harus angka >= 0" });
    }

    if (products.some(p => norm(p.name) === norm(name) && norm(p.owner) === norm(owner)))
      return res.status(409).json({ error: "produk dengan nama tersebut sudah ada di toko ini" });

    const product = { name: String(name).trim(), category: category ?? null, price: price ?? null, description: description ?? null, owner: String(owner).trim() };
    products.push(product);
    return res.status(201).json(product);
  } catch (err) {
    console.error("create product error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const findAll = (_req, res) => res.json(products);

export const findByOwnerAndName = (req, res) => {
  const { owner, name } = req.params;
  const item = products.find(p => norm(p.name) === norm(name) && norm(p.owner) === norm(owner));
  if (!item) return res.status(404).json({ error: "produk tidak ditemukan" });
  return res.json(item);
};

export const findByName = (req, res) => {
  const { name } = req.params;
  const items = products.filter(p => norm(p.name) === norm(name));
  if (items.length === 0) return res.status(404).json({ error: "produk tidak ditemukan" });
  return res.json(items);
};
```

---

## 🧭 Endpoints

**Base URL**: `http://localhost:1000`  
**Prefix**: semua endpoint di-mount di `/products` (lihat `server.js`)

| Method | Path                         | Deskripsi                                           |
|-------:|------------------------------|-----------------------------------------------------|
| POST   | `/products/`                 | Buat produk baru (hanya untuk owner ber-role seller)|
| GET    | `/products/`                 | Ambil **semua** produk                              |
| GET    | `/products/:owner/:name`     | Ambil **1 produk spesifik** milik `owner` tertentu  |
| GET    | `/products/:name`            | Ambil **semua produk** dengan `name` tertentu (lintas toko) |

### 🧩 Detail Parameter & Body

- **POST `/products/`**
  - Body JSON:
    ```json
    {
      "name": "Es Teh",
      "category": "Beverage",
      "price": 5000,
      "description": "Es teh manis",
      "owner": "seller1"
    }
    ```
  - Aturan:
    - `name` (wajib), `owner` (wajib & harus user valid dengan role `seller`)
    - `price` opsional, jika ada wajib angka `>= 0`
    - Nama produk **unik per owner** (boleh sama di owner lain)

  - Status:
    - `201 Created` → sukses
    - `400 Bad Request` → field wajib kurang / price invalid / owner tidak ada
    - `403 Forbidden` → owner bukan seller
    - `409 Conflict` → duplikat nama di toko yang sama
    - `500 Internal Server Error` → error tak terduga

- **GET `/products/`**
  - Response: `200 OK` → array produk

- **GET `/products/:owner/:name`**
  - Path params:
    - `owner` → username pemilik toko
    - `name`  → nama produk
  - Response:
    - `200 OK` → objek produk
    - `404 Not Found` → tidak ketemu

- **GET `/products/:name`**
  - Path param: `name`
  - Response:
    - `200 OK` → **array** produk (bisa >1 toko)
    - `404 Not Found` → tidak ketemu

> ⚠️ **Catatan routing**: karena ada dua route dinamis, urutan di `productRoutes.js` penting. `/:owner/:name` harus didefinisikan **sebelum** `/:name`.

---

## 🧪 Contoh Testing (cURL)

```bash
# 1) Tambah produk (POST /products)
curl -X POST http://localhost:1000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Es Teh","category":"Beverage","price":5000,"description":"Es teh manis","owner":"seller1"}'

# 2) Ambil semua produk (GET /products)
curl http://localhost:1000/products

# 3) Cari produk spesifik (GET /products/:owner/:name)
curl "http://localhost:1000/products/seller1/Kopi%20Susu"

# 4) Cari produk berdasarkan nama lintas toko (GET /products/:name)
curl "http://localhost:1000/products/Kopi%20Susu"
```

**Contoh respons sukses (POST /products)**
```json
{
  "name": "Es Teh",
  "category": "Beverage",
  "price": 5000,
  "description": "Es teh manis",
  "owner": "seller1"
}
```

**Contoh error (duplikat)**
```json
{ "error": "produk dengan nama tersebut sudah ada di toko ini" }
```

---

## ⚡ Ringkasan
- `server.js` → mount router di `/products` dan enable JSON body.  
- `productRoutes.js` → definisikan endpoint & mapping ke controller.  
- `productController.js` → validasi, anti-duplikat per toko, dan pengambilan data.  
- Endpoints lengkap: `POST /products`, `GET /products`, `GET /products/:owner/:name`, `GET /products/:name`.  



