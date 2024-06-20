const fs = require('fs');
const { replaceTemplate } = require('./replace-template');

// Read data file synchronously (blocking call)
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// Read HTML files
const cardTemplate = fs.readFileSync('./templates/card.html', 'utf-8');
const overviewTemplate = fs.readFileSync('./templates/overview.html', 'utf-8');
const productTemplate = fs.readFileSync('./templates/product.html', 'utf-8');

function renderHomePage(res) {
    // Message contains HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // Save all card HTML to an array
    const cardsHTML = dataObj.map((item) => replaceTemplate(cardTemplate, item));
    
    const overviewHTML = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
    res.end(overviewHTML);
}

function renderProductPage(res, id) {
    const product = dataObj.find(item => item.id == id);

    if (product){
        renderValidProduct(res, product);
    } else {
        // No product was found with the given ID
        renderErrorPage(res);
    }
}

function renderValidProduct(res, product) {
    const productHTML = replaceTemplate(productTemplate, product);

    res.writeHead(200, {'Content-type': 'text/html'});
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
        'my-own-header': 'hello-world'
    });
    res.end('<h1> Page not found! </h1>');
}

module.exports = { renderHomePage, renderProductPage, renderTestPage, renderErrorPage }