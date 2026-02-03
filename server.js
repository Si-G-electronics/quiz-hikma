const express = require("express");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();

/* 🔥 IMPORTANT */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const FILE = "participants.xlsx";

app.post("/save", (req, res) => {
    console.log("RECU :", req.body); // DEBUG

    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Aucune donnée reçue" });
    }

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

    // AUTO WIDTH
    const cols = Object.keys(oldData[0]).map(key => ({
        wch: Math.max(
            key.length,
            ...oldData.map(row => row[key] ? row[key].toString().length : 10)
        ) + 2
    }));
    newSheet["!cols"] = cols;

    workbook.Sheets["Participants"] = newSheet;
    XLSX.writeFile(workbook, FILE);

    res.json({ ok: true });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Serveur lancé sur le réseau");
});
