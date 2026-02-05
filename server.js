const express = require("express");
const fs = require("fs");
const XLSX = require("xlsx");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, "participants.xlsx");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/save", (req, res) => {
  try {
    const data = req.body;

    // --- CETTE LIGNE AJOUTE L'AFFICHAGE DANS LES LOGS RENDER ---
    console.log("RECU :", data);
    // ----------------------------------------------------------

    let workbook;
    let worksheet;

    if (fs.existsSync(FILE)) {
      workbook = XLSX.readFile(FILE);
      worksheet = workbook.Sheets["Participants"];
    } else {
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    }

    const oldData = XLSX.utils.sheet_to_json(worksheet);
    oldData.push(data);

    const newSheet = XLSX.utils.json_to_sheet(oldData);
    workbook.Sheets["Participants"] = newSheet;

    XLSX.writeFile(workbook, FILE);

    res.json({ ok: true });
  } catch (err) {
    console.log("ERREUR :", err);
    res.status(500).send("Erreur serveur");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur lancé sur le port " + PORT);
});