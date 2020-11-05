// Implement a small command line node app called fetcher.js which should take a URL as a command-line argument as well as a local file path and download the resource to the specified path.

// Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.

'use strict';

const REQUEST = require('request');
const FS = require('fs');
const readline = require('readline');


const URL = process.argv.slice(2, process.argv.length - 1).toString(); // get only the first argument
const OutFILE = process.argv.slice(3).toString();
console.log(URL);
console.log(OutFILE);

const RL = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//check for file existence
console.log(FS.existsSync(OutFILE));

const fileOperation = function() {
  REQUEST(URL, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    // write to file
    FS.writeFile(OutFILE, body, (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        console.log(`Downloaded and saved ${getFilesizeInBytes(OutFILE)} bytes to ${OutFILE}`);
        process.exit();
      }
    });
  });
};

const getFilesizeInBytes = (OutFILE) => {
  const stats = FS.statSync(OutFILE);
  const fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
};

try {
  if (FS.existsSync(OutFILE)) {
    //file exists
    RL.question('Output File Exists. Overwrite (Yes /No) ', (answer) => {
      if (answer === "Yes" || answer === 'yes' || answer === "Y" || answer === "y") {
        fileOperation();
      } else {
        RL.close();
        console.log("program aborted");
        return;
      }
      RL.close();
    });
  } else {
    console.log('file does not exist...');
    fileOperation();
  }
} catch (err) {
  console.error(err);
}


// create a function to host the request and write



