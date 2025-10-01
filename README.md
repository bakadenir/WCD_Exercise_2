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

## 📌 1. server.js

```js
import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = 1000;

app.use(express.json());             // middleware untuk parsing JSON
app.use("/products", productRoutes); // semua endpoint produk dengan prefix /products

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### 🛠️ Alurnya
- `import express` → ambil library Express.  
- `productRoutes` → impor router khusus products.  
- `app.use(express.json())` → middleware supaya server bisa membaca request body dalam format JSON (`req.body`).  
- `app.use("/products", productRoutes)` → semua endpoint di router products otomatis punya prefix `/products`.  
  - `POST /products/` → bikin produk baru  
  - `GET /products/` → ambil semua produk  
  - `GET /products/:owner/:name` → ambil produk spesifik per toko  
  - `GET /products/:name` → ambil produk dengan nama tertentu  
- `app.listen(PORT, ...)` → jalankan server di `http://localhost:1000`.

---

## 📌 2. routes/productRoutes.js

```js
import { Router } from "express";
import {
  create,
  findAll,
  findByName,
  findByOwnerAndName,
} from "../controllers/productController.js";

const router = Router();

router.post("/", create);
router.get("/", findAll);
router.get("/:owner/:name", findByOwnerAndName);
router.get("/:name", findByName);

export default router;
```

### 🛠️ Alurnya
- `Router()` → bikin sub-router khusus untuk produk.  
- Routing di sini **tidak ada logika bisnis**, hanya mapping **endpoint → fungsi controller**.  
- Daftar route:
  - `POST /products/` → `create` (tambah produk baru).  
  - `GET /products/` → `findAll` (ambil semua produk).  
  - `GET /products/:owner/:name` → `findByOwnerAndName` (cari produk spesifik di toko tertentu).  
  - `GET /products/:name` → `findByName` (cari produk dengan nama tertentu, lintas toko).  
- `export default router` → router dikirim ke `server.js`.

---

## 📌 3. controllers/productController.js

```js
import { findByUsername } from "./userController.js";

// In-memory data (contoh awal, belum pakai database)
export const products = [
  {
    name: "Kopi Susu",
    category: "Beverage",
    price: 20000,
    description: "Kopi susu botolan 250ml",
    owner: "seller1", // toko A
  },
];

// Utils: normalisasi string untuk cek duplikat
const norm = (s) => String(s || "").trim().toLowerCase();

// CREATE: Tambah produk baru
export const create = (req, res) => {
  try {
    const { name, category, price, description, owner } = req.body || {};

    // Validasi field wajib
    if (!name || !owner) {
      return res.status(400).json({ error: "field 'name' dan 'owner' wajib diisi" });
    }

    // Validasi owner (harus ada & role = seller)
    const ownerUser = findByUsername(owner);
    if (!ownerUser) return res.status(400).json({ error: "owner tidak ditemukan di users" });
    if (String(ownerUser.role || "").toLowerCase() !== "seller") {
      return res.status(403).json({ error: "hanya seller yang boleh membuat produk" });
    }

    // Validasi price
    if (price !== undefined) {
      const num = Number(price);
      if (!Number.isFinite(num) || num < 0) {
        return res.status(400).json({ error: "price harus angka >= 0" });
      }
    }

    // Cegah duplikat nama produk di dalam 1 toko
    if (products.some((p) => norm(p.name) === norm(name) && norm(p.owner) === norm(owner))) {
      return res.status(409).json({ error: "produk dengan nama tersebut sudah ada di toko ini" });
    }

    // Buat produk baru
    const product = { name, category, price, description, owner };
    products.push(product);
    return res.status(201).json(product);
  } catch (err) {
    console.error("create product error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};

// GET /products → Ambil semua produk
export const findAll = (_req, res) => res.json(products);

// GET /products/:owner/:name → Ambil produk spesifik
export const findByOwnerAndName = (req, res) => {
  const { owner, name } = req.params;
  const item = products.find(
    (p) => norm(p.name) === norm(name) && norm(p.owner) === norm(owner)
  );
  if (!item) return res.status(404).json({ error: "produk tidak ditemukan" });
  return res.json(item);
};

// GET /products/:name → Ambil produk berdasarkan nama (lintas toko)
export const findByName = (req, res) => {
  const { name } = req.params;
  const items = products.filter((p) => norm(p.name) === norm(name));
  if (items.length === 0) return res.status(404).json({ error: "produk tidak ditemukan" });
  return res.json(items);
};
```

### 🛠️ Alurnya
- `products` → array penyimpanan sementara.  
- **create**:
  - Validasi field wajib (`name`, `owner`).  
  - Cek owner harus `seller`.  
  - Validasi `price` harus angka ≥ 0.  
  - Cegah duplikat nama produk di toko yang sama.  
  - Tambah produk baru → return `201 Created`.  
- **findAll**: return semua produk.  
- **findByOwnerAndName**: cari produk spesifik di 1 toko.  
- **findByName**: cari semua produk dengan nama sama lintas toko.  

---

## 📌 Testing API (contoh pakai curl)

```bash
# Tambah produk
curl -X POST http://localhost:1000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Es Teh","category":"Beverage","price":5000,"description":"Es teh manis","owner":"seller1"}'

# Ambil semua produk
curl http://localhost:1000/products

# Cari produk by owner + name
curl http://localhost:1000/products/seller1/Kopi%20Susu

# Cari produk by name (lintas toko)
curl http://localhost:1000/products/Kopi%20Susu
```

---

## ⚡ Kesimpulan
- `server.js` → entry point, pasang middleware & router.  
- `productRoutes.js` → mapping URL → controller.  
- `productController.js` → logika bisnis (validasi, tambah, ambil produk).  
- Endpoint sudah siap dites via **Postman / curl**.  
- Saat ini masih pakai **in-memory store**, langkah selanjutnya bisa diganti ke **database (MySQL/MongoDB)**.  


