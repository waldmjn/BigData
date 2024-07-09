const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Pool-Konfiguration
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Yugioh46!?',
  database: 'product_logs',
  connectionLimit: 5
});

// Route für die Hauptseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Logging-Route
app.post('/logClick', async (req, res) => {
  const product = req.body.product;
  console.log('Empfangener Produktklick:', product); // Debugging-Ausgabe
  try {
    const conn = await pool.getConnection();
    const query = 'INSERT INTO logs (product, timestamp) VALUES (?, ?)';
    const values = [product, new Date()];
    await conn.query(query, values);
    conn.release();
    console.log('Log erfolgreich gespeichert'); // Debugging-Ausgabe
    res.send('Log gespeichert');
  } catch (err) {
    console.error('Fehler beim Speichern des Logs:', err);
    res.status(500).send('Fehler beim Speichern des Logs');
  }
});

// Route zum Abrufen der Logs
app.get('/getLogs', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const logs = await conn.query('SELECT * FROM logs');
    conn.release();
    res.json(logs);
  } catch (err) {
    console.error('Fehler beim Abrufen der Logs:', err);
    res.status(500).send('Fehler beim Abrufen der Logs');
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
  console.log(`Admin-Seite: http://localhost:${port}/admin.html`);
  console.log(`Diagramm-Seite: http://localhost:${port}/chart.html`);
});
