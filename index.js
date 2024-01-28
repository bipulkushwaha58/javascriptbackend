require('dotenv').config()

const express = require('express')
const app = express()
const port = 4000
const jsondata= [
    '{{repeat(5, 7)}}',
    {
      _id: '{{objectId()}}',
      isActive: '{{bool()}}',
      balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
      age: '{{integer(20, 40)}}',
      eyeColor: '{{random("blue", "brown", "green")}}',
      name: '{{firstName()}} {{surname()}}',
      gender: '{{gender()}}',
      company: '{{company().toUpperCase()}}',
      email: '{{email()}}',
      phone: '+1 {{phone()}}',
      friends: [
        '{{repeat(3)}}',
        {
          id: '{{index()}}',
          name: '{{firstName()}} {{surname()}}'
        }
      ],
      favoriteFruit: function (tags) {
        var fruits = ['apple', 'banana', 'strawberry'];
        return fruits[tags.integer(0, fruits.length - 1)];
      }
    }
  ]
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/twitter',(req,res)=>{
    res.send("jhon")
})
app.get('/login',(req,res)=>{
    res.send('<h1>please login</h1>')
})
app.get('/youtube',(req,res)=>{
    res.send('<h2>youtube</h2>')
})
app.get('/github',(req,res)=>{
    res.json(jsondata)
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})