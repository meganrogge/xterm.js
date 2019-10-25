const path = require('path');
const cp = require('child_process');
const fs = require('fs');

const PACKAGE_ROOT = path.join(__dirname, '..');

// install addon deps
const addonsPath = path.join(PACKAGE_ROOT, 'addons');
if (fs.existsSync(addonsPath)) {
  console.log('pulling addon dependencies...');

  // whether to use yarn or npm
  let hasYarn = false;
  try {
    cp.execSync('yarn --version').toString();
    hasYarn = true;
  } catch(e) {}

  // walk all addon folders
  fs.readdir(addonsPath, (err, files) => {
    files.forEach(folder => {
      const addonPath = path.join(addonsPath, folder);

      // install only if there are dependencies listed
      const packageJson = require(path.join(addonPath, 'package.json'));
      if ((packageJson.devDependencies && Object.keys(packageJson.devDependencies).length)
          || (packageJson.dependencies && Object.keys(packageJson.dependencies).length))
      {
        console.log('Preparing', folder);
        if (hasYarn) {
          cp.execSync('yarn', {cwd: addonPath});
        } else {
          cp.execSync('npm install', {cwd: addonPath});
        }
      } else {
        console.log('Skipped', folder);
      }
    });
  });
}
