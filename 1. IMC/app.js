const BMIData = [
  { name: "Maigreur", color: "midnightblue", range: [0, 18.5] },
  { name: "Bonne santé", color: "green", range: [18.5, 25] },
  { name: "Surpoids", color: "lightcoral", range: [25, 30] },
  { name: "Obésité modérée", color: "orange", range: [30, 35] },
  { name: "Obésité sévère", color: "crimson", range: [35, 40] },
  { name: "Obésité morbide", color: "purple", range: 40 },
];


const form = document.querySelector(".form_imc");  // élément du DOM à récup

form.addEventListener("submit", handleForm)  // Eventlistener + callback function handleForm

function handleForm(e) {
  e.preventDefault();

  calculateBMI()
}

const inputs = document.querySelectorAll("input");  // on récupère les inputs du form

function calculateBMI(){
  const height = inputs[0].value;
  const weight = inputs[1].value;

  if(!height  || !weight || height <= 0 || weight <= 0 ){ // on vérifie sir les champs ne sont pas vide ou si les valeurs remplie ne sont pas négatives.
    handleError();
    return;
  }

const BMI = (weight / Math.pow(height / 100, 2)).toFixed(1);  // Formule pour calculer l'imc ( Math.pow = formule mathématique et toFixed(1) = on garde un chiffre après la virgule)
showResult(BMI)                                               // function qui va afficher le résultat
}

const displayBMI = document.querySelector(".bmi_value");   // sélection des éléments du DOM
const result = document.querySelector(".result");

function handleError(){                                   // modification du texte en cas d'erreur
  displayBMI.textContent = "Woops";
  displayBMI.style.color = "inherit"
  result.textContent = "Remplissez correctement les inputs."

}


function showResult(BMI){
const rank = BMIData.find(data => {
  if(BMI >= data.range[0] && BMI < data.range[1])  // va retourner l'élement du tableau qui correspond. A la fois supérieur a la petite valeur et inférieur a la grosse valeur. dans la mêm ligne
  return data
  else if (typeof data.range === "number" && BMI >= data.range) // c'estpour la dernière ligne du tableau qui n'est plus une range mais juste un nombre 
  return data;
})

displayBMI.textContent = BMI;                                 // Affichage du résultat
displayBMI.style.color = `${rank.color}`;
result.textContent = ` Résultat : ${rank.name}`;
}
// IMC = poids en kg / taille² en m
