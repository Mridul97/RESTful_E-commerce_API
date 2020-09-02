module.exports = (app) => {
    const products = require('../controllers/product.controller.js');

    // Create a new Product
    app.post('/products', products.create);

    // Retrieve all Products
    app.get('/products', products.findAll);

    // Retrieve a single Product with productID
    app.get('/products/:productId', products.findOne);

    // Update a Product with productID
    app.put('/products/:productId', products.update);

    // Delete a Product with productID
    app.delete('/products/:productId', products.delete);
}