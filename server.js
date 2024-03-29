const express = require('express');
const mongoose = require('mongoose')
const Product = require('./models/productModel')

const app = express();
const PORT = 3000;
const uri = 'mongodb+srv://Jaiprakash:tj952920@testcluster.vbndu4a.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json())
// urlencoded is use to allow the form element updation 
app.use(express.urlencoded({extended: false}))

// routes
app.get('/',(req, res) =>{
    res.send('Hello World');
})


app.get("/products", async(req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/products/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/product', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.put('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body)
        // if the product is not available with that particular then return 404 message
        // otherwise update the product with relative to id
        if(!product){
            return res.status(404).json({message: `cannot find any product by ${id}`})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).json({message: `cannot find any product with this ${id}`})
        }
        res.status(200).json({message : `product is deleted buy this id ${id}`})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

mongoose.set("strictQuery", false)
mongoose.connect(uri)
.then(() => {
    app.listen(PORT, () => {
        console.log(`App listening port ${PORT}`);
    })
    console.log("connect to mongodb")
} 
).catch((error) => {
    console.log(error)
})
