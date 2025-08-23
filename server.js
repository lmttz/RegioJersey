const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // tu carpeta con index.html

const DATA_FILE = "catalogo.json";

// Obtener todos los jerseys
app.get("/api/jerseys", (req, res) => {
  const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
  res.json(data);
});

// Guardar jersey
app.post("/api/jerseys", (req, res) => {
  const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
  data.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));