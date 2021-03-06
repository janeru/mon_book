const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(express.static(__dirname + '/../public/'))
app.use(bodyParser.json())
// DB
const mongoose = require('mongoose')
// mongoose.Promise = global.mongoose
mongoose.connect('mongodb://localhost:27017/book_db')

const { Book } = require('./models/books.js')
const { Store } = require('./models/stores.js')

// POST 
app.post('/api/add/store', (req, res) => {
    // console.log('Getting a post request')
    // console.log(req.body)
    // 要將資料存到store的Model裡面，並在Schema裡面做驗證
    const store = new Store({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    })

    // 有了model就可以到資料庫存取東西
    store.save((err, doc) => {
        if (err) res.status(400).send(err)
        res.status(200).send()
    })


})

app.post('/api/add/books', (req, res) => {
    console.log(req.body)
    const books = new Book({
        name: req.body.name,
        author: req.body.author,
        pages: req.body.pages,
        price: req.body.price,
        stores: req.body.stores
    })

    books.save((err, doc) => {
        if (err) res.status(400).send(err)
        res.status(200).send()
    })

})

// GET
app.get('/api/stores', (req, res) => {
    // 到Store裡面去抓資料
    Store.find((err, doc) => {
        // console.log(doc)
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})

app.get('/api/books', (req, res) => {
    // 抓取url query的limit
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    // 抓取url query的ord
    let ord = req.query.ord ? req.query.ord : 'asc'
    // 因為mongo 的id 是timestamp
    Book.find().limit(limit).sort({ _id: ord }).exec((err, doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
    // Book.find((err, doc) => {
    //     if (err) res.status(400).send(err)
    //     res.send(doc)
    // })
})

app.get('/api/books/:id', (req, res) => {
    Book.findById(req.params.id, (err, doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})

// 更新修改後的書籍
app.patch('/api/add/books/:id', (req, res) => {
    Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
// DELETE
app.delete('/api/delete/books/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, doc) => {
        if (err) res.status(400).send(err)
        res.status(200).send()
    })
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Started a port ${port}`)
})