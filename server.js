const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const XLSX = require("xlsx");

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONNEXION À TA BASE MONGODB ATLAS ---
const MONGO_URI = "mongodb+srv://sidali_admin:sidali.561@cluster0.50vs1m8.mongodb.net/hikma_db?retryWrites=true&w=majority";
// Note : J'ai ajouté /hikma_db dans le lien pour créer automatiquement le nom de la base.

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas avec succès !"))
  .catch(err => console.log("❌ Erreur de connexion MongoDB :", err));

// --- STRUCTURE DES DONNÉES (MODÈLE) ---
const ParticipantSchema = new mongoose.Schema({
  name: String,
  func: String,
  place: String,
  email: String,
  score: Number,
  answers: Array,
  date: { type: Date, default: Date.now }
});

const Participant = mongoose.model("Participant", ParticipantSchema);

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- SAUVEGARDE DES RÉSULTATS ---
app.post("/save", async (req, res) => {
  try {
    const data = req.body;
    
    // Affiche dans les logs de Render pour vérification visuelle
    console.log("RECU :", data);

    // Enregistre dans MongoDB Atlas (Traçabilité permanente)
    const newParticipant = new Participant(data);
    await newParticipant.save();

    res.json({ ok: true });
  } catch (err) {
    console.log("ERREUR LORS DE LA SAUVEGARDE :", err);
    res.status(500).send("Erreur serveur");
  }
});

// --- ROUTE SECRÈTE POUR TÉLÉCHARGER L'EXCEL ---
// Tape l'adresse de ton site + /download-results pour l'avoir
app.get("/download-results", async (req, res) => {
  try {
    const data = await Participant.find({}).lean();
    
    // Transformation simple pour l'Excel
    const excelData = data.map(p => ({
      Nom: p.name,
      Fonction: p.func,
      Lieu: p.place,
      Email: p.email,
      Score: p.score,
      Date: p.date
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=resultats_hikma.xlsx");
    res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).send("Erreur lors de l'exportation");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Serveur lancé sur le port " + PORT);
});