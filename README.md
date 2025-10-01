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
