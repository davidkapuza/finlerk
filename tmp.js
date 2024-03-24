const testFolder =
  '/Users/davidkapuza/projects/qbick/libs/shadcn-ui/src/lib/ui';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  console.log(
    files
      .map((file) => {
        return file.split('.')[0];
      })
      .join(' '),
  );
});
