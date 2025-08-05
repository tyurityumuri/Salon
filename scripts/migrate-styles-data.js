const fs = require('fs');
const path = require('path');

// 古いデータを読み込む
const oldDataPath = path.join(__dirname, '../src/data/styles.json');
const oldData = JSON.parse(fs.readFileSync(oldDataPath, 'utf8'));

// 新しい形式に変換
const newData = oldData.map(style => ({
  id: style.id,
  url: style.src, // src -> url に変更
  alt: style.alt,
  category: style.category,
  stylistId: style.stylistName, // stylistName -> stylistId に変更
  tags: style.tags,
  height: style.height,
  // マルチアングル画像は初期値として空
  frontImage: undefined,
  sideImage: undefined,
  backImage: undefined
}));

// 新しいデータを保存
fs.writeFileSync(oldDataPath, JSON.stringify(newData, null, 2));

console.log('✅ styles.json を新しい形式に移行しました');
console.log(`  - ${newData.length} 件のスタイルを変換`);
console.log('  - src → url');
console.log('  - stylistName → stylistId');
console.log('  - マルチアングル画像プロパティを追加');