const fs = require('fs');
const slugify = require('slugify');

// Read data file synchronously (blocking call)
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// Read HTML files
const cardTemplate = fs.readFileSync('./templates/card.html', 'utf-8');
const overviewTemplate = fs.readFileSync('./templates/overview.html', 'utf-8');
const productTemplate = fs.readFileSync('./templates/product.html', 'utf-8');

// Generate slugs: (replace id in URL with the formatted product name)
const slug_map = dataObj.reduce((acc, item) => {
  acc[item.id] = slugify(item.productName, { lower: true, replacement: '-' });
  return acc;
}, {});

function renderHomePage(res) {
  // Message contains HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });

  // Save all card HTML to an array
  const cardsHTML = dataObj.map((item) => replaceTemplate(cardTemplate, item));

  // Replace all cards placeholder with the HTML to render the cards
  const overviewHTML = overviewTemplate.replace(
    /{%PRODUCT_CARDS%}/g,
    cardsHTML
  );
  res.end(overviewHTML);
}

function renderProductPage(res, id) {
  const productName = id.replaceAll('-', ' '); // Translate slug into original name of the product
  const productObj = dataObj.find(
    (item) => item.productName.toLowerCase() === productName
  );

  if (productObj) {
    renderValidProduct(res, productObj);
  } else {
    // No product was found with the given ID
    renderErrorPage(res);
  }
}

function renderValidProduct(res, product) {
  const productHTML = replaceTemplate(productTemplate, product);

  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(productHTML);
}

function renderTestPage(res) {
  // Writing JSON data to HTTP response
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(data);
}

function renderErrorPage(res) {
  // Default error message
  res.writeHead(404, {
    'Content-type': 'text/html',
    'my-own-header': 'hello-world',
  });
  res.end('<h1> Page not found! </h1>');
}

// Function to fill in the HTML templates
const replaceTemplate = (template, product) => {
  let output = template
    .replace(/{%PRODUCT_NAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, `$${product.price}`)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%ID%}/g, slug_map[product.id]); // Use slug_map for cleaner rendering of product id's as the product name

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

module.exports = {
  renderHomePage,
  renderProductPage,
  renderTestPage,
  renderErrorPage,
};
