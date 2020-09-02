const Product = require('../models/product.model')

const calculateAggregrateRating = (reviews) => {
    
    let sum = 0, flag = 0;
    reviews.forEach(review => {
        if(review.rating){
            sum += review.rating;
            flag = 1;
        }
    })
    if(flag)
        return sum/reviews.length;
    return "No Ratings Available"
}

// Create and Save a new Product
exports.create = (req, res) => {

    // Validate request
    if(!req.body.name){
        return res.status(400).send({
            message: "Product name cannot be empty"
        })
    }

    if(!req.body.price){
        return res.status(400).send({
            message: "Product price cannot be empty"
        })
    }

    // Create a Product
    const product = new Product({
        name: req.body.name,
        description: req.body.description || "No Description Provided",
        image: req.body.image || "No Image Available",
        price: req.body.price,
        reviews: req.body.reviews || []
    });

    // Save Product in the database
    product.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating the Product."
        });
    });

};

// Retrieve and return all products from the database
exports.findAll = (req, res) => {
    Product.find()
    .then(products => {
        let results = []
        products.forEach(product => {
            results.push({
                "id": product._id,
                "name": product.name,
                "image": product.image,
                "price": product.price,
                "aggregrate rating": calculateAggregrateRating(product.reviews)
            })
        })
        res.send(results);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving products."
        });
    });
};

// Find a single product with a productID
exports.findOne = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send({
            "id": product._id,
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "price": product.price,
            "reviews": product.reviews,
            "aggregrate rating": calculateAggregrateRating(product.reviews)
        });
    }).catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: "Product not find with id " + req.params.productId
            });
        }
        return res.status(500).send({
            message: "Error retrieving product with id " + req.params.productId
        });
    });
};

// Updating a product identified by the productId in the request
exports.update = (req, res) => {
    
    // Validate Request
    if(!req.body.name){
        return res.status(400).send({
            message: "Product name cannot be empty"
        });
    }

    if(!req.body.price){
        return res.status(400).send({
            message: "Product price cannot be empty"
        });
    }

    Product.findByIdAndUpdate(req.params.productId, {
        name: req.body.name,
        description: req.body.description || "No Description Provided",
        image: req.body.image || "No Image Available",
        price: req.body.price,
        reviews: req.body.reviews || []
    }, {new: true})
    .then(product => {
        if(!product){
            return res.status(404).send({
                message:"Product not found with id" + req.params.productId
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            })
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.productId
        });
    });

};

// Delete a product with the specified productId in the request
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
    .then(product => {
        if(!product){
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'Not Found'){
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId 
            });
        }
        return res.status(500).send({
            message: "Could not delete product with id " + req.params.productId
        });
    });
};

