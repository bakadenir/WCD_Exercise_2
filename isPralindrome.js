function isPalindrome(str) {
  // Hilangkan spasi dan ubah ke huruf kecil
  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Balik string
  const reversedStr = str.split('').reverse().join('');

  // Bandingkan string asli dengan string yang dibalik
  return str === reversedStr;
}