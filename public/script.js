const questions = [
  {
    q: "Depuis combien d’années notre laboratoire accompagne les professionnels de santé ?",
    a: ["Depuis plus de 30 ans.", "Depuis plus de 10 ans.", "Depuis plus de 20 ans."],
    correct: ["A"]
  },
  {
    q: "Amoclan est disponible en Algerie sous ces formes:",
    a: ["Suspension.", "Comprimé.", "Sachet.", "Toutes ces réponses sont justes."],
    correct: ["D"]
  },
  {
    q: "Quel est le principal avantage clinique de Bilaxten chez le patient allergique actif ?",
    a: [
      "Effet sédatif réduisant le prurit.",
      "Action rapide avec absence d’effet sur la vigilance",
      "Effet prolongé nécessitant une prise biquotidienne",
      "Action anti-inflammatoire"
    ],
    correct: ["B"]
  },
  {
    q: "Comment conseiller la prise du Dexilant ?",
    a: [
      "À prendre au même moment que les antiacides pour augmenter l’effet.",
      "À avaler entier, avec ou sans nourriture.",
      "À croquer pour un effet plus rapide.",
      "À prendre seulement en cas de douleur."
    ],
    correct: ["B"]
  },
  {
    q: "Prospan®, c’est l’allié des voies respiratoires parce qu’il:",
    a: [
      "Dégage les bronches.",
      "Calme la toux.",
      "Aide à mieux respirer.",
      "Réduit l’inflammation.",
      "Toutes ces réponses."
    ],
    correct: ["E"]
  }
];

let current = 0;
let userAnswers = [];
let finalScore = 0;

function load() {
  const q = document.getElementById("question");
  const a = document.getElementById("answers");
  const c = document.getElementById("counter");

  q.innerText = questions[current].q;
  a.innerHTML = "";
  c.innerText = `Question ${current + 1} / ${questions.length}`;

  questions[current].a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.className = "btn animate__animated animate__fadeIn";
    btn.dataset.letter = String.fromCharCode(65 + i);
    btn.onclick = () => btn.classList.toggle("selected");
    a.appendChild(btn);
  });
}

function next() {
  const buttons = document.querySelectorAll("#answers .btn");
  const selected = [];

  buttons.forEach(btn => {
    if (btn.classList.contains("selected")) {
      selected.push(btn.dataset.letter);

      if (questions[current].correct.includes(btn.dataset.letter)) {
        btn.classList.add("good");
      } else {
        btn.classList.add("bad");
      }
    }
  });

  userAnswers[current] = selected;

  setTimeout(() => {
    current++;
    if (current < questions.length) load();
    else showEnd();
  }, 700);
}

function showEnd() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("end").classList.remove("hidden");

  finalScore = 0;
  questions.forEach((q, i) => {
    if (
      userAnswers[i] &&
      userAnswers[i].length === q.correct.length &&
      userAnswers[i].every(v => q.correct.includes(v))
    ) finalScore++;
  });

  document.querySelector("#end h1").innerText =
    `Merci ! Votre score : ${finalScore} / ${questions.length}`;
}

function restart() {
  current = 0;
  userAnswers = [];
  finalScore = 0;

  document.getElementById("name").value = "";
  document.getElementById("function").value = "";
  document.getElementById("place").value = "";
  document.getElementById("email").value = "";

  document.getElementById("end").classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");

  load();
}

function send() {
  const name = document.getElementById("name").value;
  const func = document.getElementById("function").value;
  const place = document.getElementById("place").value;
  const email = document.getElementById("email").value;

  fetch("/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name,
      func,
      place,
      email,
      score: finalScore,
      answers: userAnswers,
      date: new Date()
    })
  })
  .then(() => alert("Merci pour votre participation !"))
  .catch(() => alert("Erreur d'envoi"));
}

load();
