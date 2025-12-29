const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'..')));

const db = new sqlite3.Database('./database.sqlite', err => {
    if(err) console.error(err);
    else console.log('SQLite DB ready');
});

db.run(\CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invested REAL NOT NULL,
    expectedProfit REAL NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
)\);

app.get('/api/status', (req,res)=>{ res.json({status:'Backend running'}); });

app.post('/api/invest', (req,res)=>{
    const { amount } = req.body;
    if(!amount || isNaN(amount)) return res.status(400).json({error:'Invalid amount'});
    const profit = amount*0.04;
    db.run(\INSERT INTO investments (invested, expectedProfit) VALUES (?,?)\, [amount,profit], function(err){
        if(err) return res.status(500).json({error: err.message});
        res.json({ invested: amount, expectedProfit: profit });
    });
});

app.get('/api/investments', (req,res)=>{
    db.all(\SELECT * FROM investments ORDER BY createdAt DESC\, [], (err,rows)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(\Server running on port \3000\));
