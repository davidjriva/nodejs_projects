const fs = require('fs');
const http = require('http');
const url = require('url');

// Read data file synchronously (blocking call)
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Read HTML files
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

// Function to fill in the HTML templates
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName)
                    .replace(/{%IMAGE%}/g, product.image)
                    .replace(/{%QUANTITY%}/g, product.quantity)
                    .replace(/{%PRICE%}/g, `$${product.price}`)
                    .replace(/{%FROM%}/g, product.from)
                    .replace(/{%NUTRIENTS%}/g, product.nutrients)
                    .replace(/{%DESCRIPTION%}/g, product.description)
                    .replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

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

const server = http.createServer((req, res) => {
    const protocol = req.encrypted ? 'https' : 'http';
    const baseURL = `${protocol}://${req.headers.host}/`;
    const url = new URL(req.url, baseURL);

    const pathname = url.pathname;
    const id = url.searchParams.get('id');

    if (pathname === '/' || pathname === '/overview') {
        renderHomePage(res);
    } else if (pathname === '/product') {
        renderProductPage(res, id);
    }else if (pathname === '/test') {
        renderTestPage(res);
    } else {
        renderErrorPage(res);
    }
});

// Listening on current computer (local host --> 127.0.0.1)
server.listen(8000, () => {
    console.log('Listening to requests on port 8000...');
});