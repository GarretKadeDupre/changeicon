# change-icon
Change the icon and metadata of executable files.  Fast.  Easy.

# installation

`npm i change-icon`
 
# usage
 
```javascript
const changeIcon = require('change-icon');
(async () => {
  await changeIcon('program.exe', 'picture.png');

  let myMetaData = {
    CompanyName: 'Offshore Tax Shelter LLC',
    FileDescription: 'A pretty cool file. Does some great stuff.',
    FileVersion: '1.3.3.7',
    LegalCopyright: 'Copyright 2012, All my rights are belong to me.',
    OriginalFilename: 'notavirus.exe',
    ProductName: 'Second Best Program Ever',
    ProductVersion: '1.2.3.4'
  }
  await changeIcon.changeMetaData('program.exe', myMetaData);
})()
```