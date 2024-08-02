require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Fruit = require('./models/fruit.js')
const MONGO_URI = process.env.MONGO_URI
const logger = require('morgan')
const methodOverride = require('method-override')

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(logger('tiny'))
app.use(methodOverride('_method'))
app.use('/assets', express.static('public'))

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('its connected')
})

mongoose.connection.on('error', () => {
    console.log('connection error')
})

app.post('/fruits', async (req, res) => {
  req.body.isReadyToEat === 'on' || req.body.isReadyToEat === true? 
  req.body.isReadyToEat = true : 
  req.body.isReadyToEat = false
  try {
      const createdFruit = await Fruit.create(req.body)
      res.redirect(`/fruits/${createdFruit._id}`)
  } catch (error) {
      res.status(400).json({ msg: error.message })
  }
})

app.get('/fruits/new', (req, res) => {
  res.render('new.ejs')
})

app.get('/fruits', async (req, res) => { 
  try{
      const foundFruits = await Fruit.find({})
      res.render('index.ejs', {
          fruits: foundFruits
      })
  } catch (error) {
      res.status(400).json({ msg: error.message })
  }
})

app.get('/fruits/:id', async (req, res) => {
  try {
      const foundFruit = await Fruit.findOne({ _id: req.params.id })
      res.render('show.ejs', {
          fruit: foundFruit
      })
  } catch (error) {
     res.status(400).json({ msg: error.message })
  }
})

app.put('/fruits/:id', async (req, res) => {
    req.body.isReadyToEat === 'on' || req.body.isReadyToEat === true? 
    req.body.isReadyToEat = true : 
    req.body.isReadyToEat = false
  try {
      const updatedFruit = await Fruit.findOneAndUpdate({ _id: req.params.id} , req.body, { new: true })
      res.redirect(`/fruits/${updatedFruit._id}`)
  } catch (error) {
      res.status(400).json({ msg: error.message})
  }
})

app.get('/fruits/:id/edit', async (req, res) => {
  try {
      const foundFruit = await Fruit.findOne({ _id: req.params.id })
      res.render('edit.ejs', {
          fruit: foundFruit
      })
  } catch (error) {
      res.status(400).json({ msg: error.message })
  }
})

app.delete('/fruits/:id', async (req, res) => {
  try {
      await Fruit.findOneAndDelete({ _id: req.params.id })
      .then((fruit) => { 
          res.redirect('/fruits')
      })
  } catch (error) {
      res.status(400).json({ msg: error.message })
  }
})

app.listen(3000, ()=> console.log('I see connected apps'))