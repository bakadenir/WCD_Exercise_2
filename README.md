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

