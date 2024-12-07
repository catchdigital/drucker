const path = require('path');

const lookUpDir = path.join(__dirname, '../docroot/{modules,themes}/custom/**');
const componentsDir = `${lookUpDir}/components`;

const getDest = (fileInfo) => {
  const currentPath = path.join(__dirname, '../docroot');
  if (fileInfo.chunk.name.startsWith('components')) {
    let name = fileInfo.chunk.name.split('+');
    // Remove unnecessary extension, folder and key
    name.splice(-2, 2);
    name.splice(0, 1);
    const folder = `/${name.join('/')}`.replace(`${currentPath}/`, '');
    return {
      folder: folder,
      name: name[name.length - 1],
    };
  }
  return {
    folder: 'themes/custom/sideshow/build',
    name: fileInfo.chunk.name,
  };
};

module.exports = {
  getDest,
  lookUpDir,
  componentsDir
};