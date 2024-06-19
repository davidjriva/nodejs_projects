// Loading file system module
const fs = require('fs');

// Reads text file into a string
const input = fs.readFileSync("./txt/input.txt", "utf-8");
const textOut = `This is avocado: ${input}.\nCreated on ${Date.now()}`;
console.log(textOut);

// Writing out to a new file
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File Written!');

// Better: Reading file asynchronously (non-blocking)
const filePath = './txt/start.txt'
const fileContents = fs.readFile(filePath, 'utf-8', (err, data) => {
    console.log(data);
});
