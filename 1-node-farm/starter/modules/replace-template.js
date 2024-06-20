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

module.exports = { replaceTemplate }