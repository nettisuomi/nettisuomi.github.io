const vocabulary = require('./vocabulary.json').vocabulary

const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/vocabulary', (request, response) => {
  response.json(vocabulary)
})

app.get('/api/vocabulary/:keyword', (request, response) => {
  const keyword = request.params.keyword
  let word = vocabulary.find(word => word.word === keyword)

  if (word) response.json(word)

  const id = Number(keyword)
  word = vocabulary.find(word => word.id === id)

  if (word) response.json(word)
  else response.status(404).end()
})

app.get('/api/recordings/:keyword', (request, response) => {
  const keyword = request.params.keyword
  const filePath = path.join(__dirname, 'recordings', `${keyword}.wav`)

  response.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).end()
    }
  })
})

app.get('/api/recordings/:keyword', (req, res) => {
  const keyword = req.params.keyword
  const filePath = path.join(__dirname, 'recordings', `${keyword}.wav`)

  res.sendFile(filePath, (err) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(404).send('File not found')
    }
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)