const { userInfo } = require('os');
const Products = require('../models/products');

exports.create = (req, res, next) => {
    const { name, price, vat, description, image, stock } = req.body;
    if (!name || !price || !vat || !description || !image || !stock) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }
    Products.create({
        name: name,
        price: price,
        vat: vat,
        description: description,
        image: image,
        stock: stock,
    })
        .then(() => { res.status(201).json({ message: 'Product created' });
        })
        .catch(error => { res.status(400).json({ error: 'An error was occured when creation attenpt' });
        });
};

exports.delete = (req, res, next) => {
    Products.findOne({where: {id: req.params.id}})
        .then(product =>{
            if(product.stock >= 1){
                return res.status(403).json({error: 'Action prohibited'})
            }else{
                Products.destroy
                    .then(()=> res.status(200).json({Message : 'Product deleted'}))
                    .catch(error => res.status(401).json({error: error.message}));
            }
        })
    .catch(error=>res.status(500).json({error, message: error.message}))
};

exports.update = (res, req, next) =>{
    Products.findOne({where: {id: req.params.id}})
        .then((product =>{
            if(user.isAdmin === req.token.isAdmin){
                
            }
        }))
}