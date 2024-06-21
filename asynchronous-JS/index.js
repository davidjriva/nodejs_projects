// Dog.ceo API: https://dog.ceo/api/breeds/image/random

const fs = require('fs');
const superagent = require('superagent');

// Custom function that asynchronously reads a file and returns a promise
const readFilePromise = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) reject('Error <READ>: Promise was rejected');
      resolve(data);
    });
  });
};

// Custom function that asynchronously writes a file and returns a promise
const writeFilePromise = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) reject(err);
      resolve('File written successfully.');
    });
  });
};

// Connects with Dog CEO website to get the http link for an image of a dog matching the breed of data listed in dog-img.txt

// Naive Solution: Stack callbacks using the basic methods found in the fs module

// Better Solution: Use promises to create a flat chain of calls
// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     return writeFilePromise('dog-img.txt', res.body.message);
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// Best Solution: Use the async/await features to further enhance code readability

// Code in this function will automatically run asynchronously without blocking the event loop and will return a promise
const getDogPic = async () => {
  try {
    // Stops code from running until promise returns then stores the promise into the data variable
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // Connect to API to get dog image
    const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    // Write link to dog image into a text file
    await writeFilePromise('dog-img.txt', res.body.message);
    console.log('Dog pic saved successfully!');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();
