# Exercise 2 - Web Client Developer

Proyek ini berisi lima fungsi JavaScript yang berbeda untuk latihan pengembangan web client.

## Daftar File

* `cmToKm.js`: Fungsi untuk mengonversi sentimeter (cm) ke kilometer (km).
* `fahrenheitToCelsius.js`: Fungsi untuk mengonversi suhu Fahrenheit ke Celsius.
* `isOdd.js`: Fungsi untuk memeriksa apakah suatu angka ganjil.
* `isPalindrome.js`: Fungsi untuk memeriksa apakah suatu string adalah palindrom.
* `removeOccurrence.js`: Fungsi untuk menghapus semua kemunculan karakter tertentu dari sebuah string.

## Deskripsi Fungsi

### `cmToKm.js`

```javascript
function cmToKm(cm) {
  // 1 km = 100.000 cm
  let km = cm / 100000;
  return km;
}

Fungsi ini menerima satu argumen, yaitu panjang dalam sentimeter (cm), dan mengembalikan panjang yang setara dalam kilometer (km).
