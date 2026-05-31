const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace orange with blue for most things, but maybe red for buttons
  // Let's just make everything Domino's Red for main brand color (orange -> red)
  // And change slate-900 to blue-900 
  content = content.replace(/orange-500/g, 'red-600');
  content = content.replace(/orange-600/g, 'red-700');
  content = content.replace(/orange-50/g, 'red-50');
  content = content.replace(/orange-100/g, 'red-100');
  content = content.replace(/orange-200/g, 'red-200');
  content = content.replace(/orange-400/g, 'red-500');
  content = content.replace(/slate-900/g, 'blue-900');
  content = content.replace(/slate-800/g, 'blue-800');
  content = content.replace(/Pizza Palace/g, 'Dominoze Bizza');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
      replaceInFile(filePath);
    }
  }
};

walk(directoryPath);
