const BMIData = [
  { name: "Maigreur", color: "midnightblue", range: [0, 18.5] },
  { name: "Bonne santé", color: "green", range: [18.5, 25] },
  { name: "Surpoids", color: "lightcoral", range: [25, 30] },
  { name: "Obésité modérée", color: "orange", range: [30, 35] },
  { name: "Obésité sévère", color: "crimson", range: [35, 40] },
  { name: "Obésité morbide", color: "purple", range: 40 },
];


const height = document.querySelector(".height_input");
const weight = document.querySelector(".weight_input");
const result = document.querySelector(".bmi_value")

function calcul() {
 const result_imc =  height.value * weight.value;
 return result_imc;
 console.log(result_imc);
} 

const calculImc = document.querySelector(".btn_form")
calculImc.addEventListener("click", ()=> {
const imc = calcul()
resultElement.textContent = imc
console.log(imc);
});


// IMC = poids en kg / taille² en m
