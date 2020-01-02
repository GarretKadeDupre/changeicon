# changeicon
Change the icon and metadata of executable files. Fast. Easy.

# installation

`npm i changeicon`
 
# usage
 
```javascript
const changeIcon = require('changeicon');
```

**change icon**

```javascript
(async () => { await changeIcon('program.exe', 'picture.png'); })();
```

**change metadata**

```javascript
(async () => {
  await changeIcon.changeMetaData('program.exe', {
    CompanyName: 'Legit Tax Haven, LLC',
    FileDescription: 'An innocent file that will not harm your computer. Double-click to read more.',
    FileVersion: '1.3.3.7',
    LegalCopyright: 'Copyright 2021, all my rights are belong to me.',
    OriginalFilename: 'virus.exe',
    ProductName: 'Not A Virus',
    ProductVersion: '1.2.3.4'
  });
})();
```

**both**

```javascript
(async () => {
  await changeIcon('program.exe', 'picture.png');
  await changeIcon.changeMetaData('program.exe', {
    CompanyName: 'Legit Tax Haven, LLC',
    FileDescription: 'An innocent file that will not harm your computer. Double-click to read more.',
    FileVersion: '1.3.3.7',
    LegalCopyright: 'Copyright 2021, all my rights are belong to me.',
    OriginalFilename: 'virus.exe',
    ProductName: 'Not A Virus',
    ProductVersion: '1.2.3.4'
  });
})();