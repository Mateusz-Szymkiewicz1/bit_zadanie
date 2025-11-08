const express = require('express')
const session = require('express-session')
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')

MySQLStore = require('connect-mysql')(session)
const app = express().use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(session({
  secret: "sesja",
  saveUninitialized: false,
  resave: false,
  cookie: { 
    maxAge: 1000*60*60*48,
  },
  store: new MySQLStore({
    config: {
      user: 'root', 
      password: '',
      database: 'bit_zadanie',
    },
    cleanup: true
  }) 
}))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bit_zadanie',
  timezone: 'Z'
})

app.post('/login', (req,res) => {
  if(req.session.user){
    connection.query(`SELECT * FROM pracownicy WHERE login = ?`,[req.session.user], (err, rows, fields) => {
      res.send([{login: rows[0].login, admin: rows[0].admin}])
    })
  }else{
    connection.query(`SELECT * FROM pracownicy WHERE login = ?`,[req.body.login], (err, rows, fields) => {
      if(rows && rows.length == 1){
        if(bcrypt.compareSync(req.body.pass, rows[0].haslo)){
          req.session.user = rows[0].login
          res.send([{login: rows[0].login, admin: rows[0].admin}])
        }else{
          res.send({ status: 0, text: "Niepoprawne dane logowania!"})
        }
      }else{
        res.send({ status: 0, text: "Niepoprawne dane logowania"})
      }
    })
  }
})

app.post('/signout', (req,res) => {
  req.session.destroy()
  res.json("done")
})

app.post('/user_reservations', (req,res) => {
  if(!req.session.user) return
  connection.query(`SELECT pracownicy.login, rezerwacje.dzien, rezerwacje.miejsce,rezerwacje.id, miejsca.uwagi FROM pracownicy INNER JOIN rezerwacje ON rezerwacje.pracownik = pracownicy.id INNER JOIN miejsca ON miejsca.id = rezerwacje.miejsce WHERE pracownicy.login = ?`,[req.session.user], (err, rows, fields) => {
    res.send(rows)
  })
})

app.post('/parking', (req,res) => {
  if(!req.session.user) return
  connection.query(`SELECT miejsca.*, rezerwacje.id AS rezerwacja FROM miejsca LEFT JOIN rezerwacje ON rezerwacje.miejsce = miejsca.id AND rezerwacje.dzien = CURDATE();`, (err, rows, fields) => {
    res.send(rows)
  })
})

app.post('/cancel', (req,res) => {
  if(!req.session.user) return
  connection.query(`DELETE FROM rezerwacje WHERE id = ?`,[req.body.id], (err, rows, fields) => {
    res.json("done")
  })
})

app.post('/reserve', (req,res) => {
  if(!req.session.user) return
  connection.query(`SELECT * FROM rezerwacje WHERE miejsce = ? AND dzien = ?`,[req.body.miejsce,req.body.dzien], (err, rows, fields) => {
    if(rows.length > 0){
      res.send({ status: 0, text: "Termin jest już zajęty!"})
    }else{
      const date = new Date(req.body.dzien)
      const dayOnly = date.toISOString().split('T')[0]
      connection.query(`INSERT INTO rezerwacje (pracownik,miejsce,dzien) VALUES ((SELECT id FROM pracownicy WHERE login = ?),?,?)`,[req.session.user,req.body.miejsce,dayOnly], (err, rows, fields) => {
        res.json("done")
      })
    }
  })
})

app.listen(3000)