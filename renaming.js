'use strict';

const path = require('path');
const fs = require('fs');

const listDir = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = listDir(path.join(dir, file), fileList);
    } else {
      if(/\.tsx$/.test(file)) {
        const name = file.split('.')[0] + '.ts';
        const src = path.join(dir, file);
        const newSrc = path.join(dir, name);
        fileList.push({
          oldSrc: src,
          newSrc: newSrc
        });
      }
    }
  });
  
  return fileList;
};

const foundFiles = listDir( './src/utils');
foundFiles.forEach(f => {
  fs.renameSync(f.oldSrc, f.newSrc);
});