function hapusKemunculanPertama(string, stringPencarian) {
  const index = string.indexOf(stringPencarian); // Cari indeks kemunculan pertama

  if (index !== -1) {
    // Jika string pencarian ditemukan
    return string.slice(0, index) + string.slice(index + stringPencarian.length);
  } else {
    // Jika string pencarian tidak ditemukan, kembalikan string asli
    return string;
  }
}