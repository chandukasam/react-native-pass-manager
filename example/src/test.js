const fs = require('fs');
const path =
  '/Users/chanduka/Library/Developer/CoreSimulator/Devices/15B70EF0-465E-4D9D-B1DE-19E5F9298063/data/Containers/Data/Application/4AAA84CE-BF6F-4721-B7FA-24F7880446D9/Documents/8002025628.pkpass';

fs.readFile(path, { encoding: 'base64' }, (err, data) => {
  if (err) {
    console.error('An error occurred:', err);
  } else {
    console.log(data);
  }
});
