const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\soory\\.gemini\\antigravity-ide\\brain\\75d1361f-1323-485a-9755-5f73b94051c1';
const destDir = 'c:\\Users\\soory\\OneDrive\\Desktop\\TerrafitBackend\\frontend\\public\\images';

const filesToCopy = [
  {
    src: 'casual_shoes_1779440462913.png',
    dest: 'casual_shoes.png'
  },
  {
    src: 'casual_womens_edit_1779440517150.png',
    dest: 'casual_womens_edit.png'
  },
  {
    src: 'casual_flat_lay_1779440551304.png',
    dest: 'casual_flat_lay.png'
  }
];

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file.src);
  const destPath = path.join(destDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} to ${file.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
