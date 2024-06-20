const http = require('http');
require('url');
const { renderHomePage, renderProductPage, renderTestPage, renderErrorPage } = require('../modules/render-pages');

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