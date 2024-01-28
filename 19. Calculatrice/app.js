const calculatorData = {                    // objet qui va contenir nos données
    calculation: "",
    result: "",
    displayedResults: false
}

//btn chiffre

const buttons = [...document.querySelectorAll("[data-action]")]   //tableau qui récupère tous les boutons [data-action]
const digitsBtns = buttons.filter(button => /[0-9]/.test(button.getAttribute("data-action")))  // filtre a travers les buttons avec un regex qui permet de récupérer les btn qui ont un chiffre dans leur data-action

digitsBtns.forEach(btn => btn.addEventListener("click", handleDigits)) // pour chaque btn on ecoute un addevenlistener la function handleDigits

const calculationDisplay = document.querySelector(".calculation")
const resultDisplay = document.querySelector(".result")

function handleDigits(e) {
    const buttonValue = e.target.getAttribute("data-action");           // on récupère la valeur du btn sur lequel on clique

    if(calculatorData.displayedResults){                                    // si des résultat sont affiché on reset
        calculationDisplay.textContent = "";
        calculatorData.calculation = "";
        calculatorData.displayedResults = false;    
    }
    if(calculatorData.calculation === "0" ) calculatorData.calculation = ""   // on évite de rajouter des 0 quand on commence par 0
    


    calculatorData.calculation += buttonValue;
    resultDisplay.textContent = calculatorData.calculation              // on l'affiche
}

//btn operators


const operatorsBtns = buttons.filter(button => /[\/+*-]/.test(button.getAttribute("data-action")))  // on fait pareil pour + - * /

operatorsBtns.forEach(btn => btn.addEventListener("click", handleOperators))

function handleOperators(e) {
    const buttonValue = e.target.getAttribute("data-action");

    if(calculatorData.displayedResults){                                    // si on clique avec un resultat affiché sur un operator on veut effacer l'écran mais garder le calcul en mémoir pour continuer le calcul
        calculationDisplay.textContent = "";
        calculatorData.calculation = calculatorData.result += buttonValue
        resultDisplay.textContent = calculatorData.calculation;
        calculatorData.displayedResults = false ;
        return;
    }
    else if(!calculatorData.calculation && buttonValue === "-"){                 // on veut afficher un - pour commencer, on veut commencer par un chiffre négatif
        calculatorData.calculation += buttonValue;
        resultDisplay.textContent = calculatorData.calculation;
        return ;
    }
    else if (!calculatorData.calculation) return ;                           // empeche de commencer pa un * ou un / ou un  +. Si rien n'est affiché a part un - on return si on clique sur un btn +, / ou * 
    else if (calculatorData.calculation.slice(-1).match(/[\/+*-]/) && calculatorData.calculation.length !== 1){        //si le dernier élément (slice(-1)) match avec un des opérateur on le change, on ajoute pas un autre opérateur. (slice(0, -1) + buttonValue)
        calculatorData.calculation = calculatorData.calculation.slice(0, -1) + buttonValue;
        resultDisplay.textContent = calculatorData.calculation;
    }
    else if(calculatorData.calculation.length !== 1) {
        calculatorData.calculation += buttonValue;                          // sinon on ajoute simplement l'opérator a la suite des touches précédement taper
        resultDisplay.textContent = calculatorData.calculation;
    }
}

//btn =

const equalBtn = document.querySelector("[data-action='=']")  // on sélec le =

equalBtn.addEventListener("click", handleEqualBtn);

function handleEqualBtn(){
    if(/[\/+*-.]/.test(calculatorData.calculation.slice(-1))){
        calculationDisplay.textContent = "Terminez le calcul par un chiffre."   // Erreur si on clique sur = alors que le dernier chiffre n'est aps un chiffre
        setTimeout(()=> {
            calculationDisplay.textContent = ""
        }, 2500)
        return;
    }
    else if(!calculatorData.displayedResults){
        calculatorData.result = customEval(calculatorData.calculation)
        resultDisplay.textContent = calculatorData.result;
        calculationDisplay.textContent = calculatorData.calculation;
        calculatorData.displayedResults = true;
      }
}

// Custom eval
customEval("5500+10");
function customEval(calculation) {
    if(!/[\/+*-]/.test(calculation.slice(1))) return calculation;               // si il n'y a pas d'operator au début (slice(1)) on return le calcul 

    let operator;
    let operatorIndex;

    if(/[\/*]/.test(calculation.slice(1))){                                 // on cherche un * ou un / en enlevant le premier chiffre. On boucle sur tous les chiffres et on récupère l'opérator et sa place dans le calcul( operator et operatorIndex)
        for(let i =1; i<calculation.length; i++){
            if(/[\/*]/.test(calculation[i])){
                operator = calculation[i]
                operatorIndex = i;
                break;
            }
        }
    } else {
        for(let i =1; i<calculation.length; i++){                           // si on ne trouve pas de * ou / c'est quon cherche des + et - donc on fait la même chose pour ces deux operator la 
            if(/[+-]/.test(calculation[i])){
                operator = calculation[i]
                operatorIndex = i;
                break;
            }
        }
    }

    const operandsInfo = getIndexes(operatorIndex, calculation)
    
    // différent cas en fonction de l'operator

    let currentCalculationResult;

    switch(operator){                           // opperand de gauche + celui de droite. le Number sert a transformé la chaine de caractère en nombre
        case "+":           
            currentCalculationResult = Number(operandsInfo.leftOperand) + Number(operandsInfo.rightOperand)
            break;
        case "-":           
            currentCalculationResult = Number(operandsInfo.leftOperand) - Number(operandsInfo.rightOperand)
            break;
        case "*":           
            currentCalculationResult = Number(operandsInfo.leftOperand) * Number(operandsInfo.rightOperand)
            break;
        case "/":           
            currentCalculationResult = Number(operandsInfo.leftOperand) / Number(operandsInfo.rightOperand)
            break;     
    }

    // calcul intermédiaire quand il y a plusieurs operator 
    let updatedCalculation = calculation.replace(calculation.slice(operandsInfo.startIntervalIndex, operandsInfo.lastRightOperandCharacter), currentCalculationResult.toString())

    if(/[\/+*-]/.test(updatedCalculation.slice(1))) {
      customEval(updatedCalculation)
    }
  
    console.log(updatedCalculation.split("."));
    if(updatedCalculation.includes(".")) {
      if(updatedCalculation.split(".")[1].length === 1){
        return Number(updatedCalculation).toString();
      }
      else if(updatedCalculation.split(".")[1].length > 1) {
        return Number(updatedCalculation).toFixed(2).toString();
      }
    }
    else {
      return updatedCalculation;
    }
  }

// operand de gauche et de droite

function getIndexes(operatorIndex, calculation){

    let rightOperand = "";
    let lastRightOperandCharacter;
  
    for(let i = operatorIndex + 1; i <= calculation.length; i++) {
      if(i === calculation.length) {
        lastRightOperandCharacter = calculation.length;
        break;
      }
      else if(/[\/+*-]/.test(calculation[i])) {
        lastRightOperandCharacter = i;
        break;
      }
      else {
        rightOperand += calculation[i];
      }
    }
  
    let leftOperand = "";
    let startIntervalIndex;
  
    for(let i = operatorIndex - 1; i >= 0; i--) {
      if(i === 0 && /[-]/.test(calculation[i])) {
        startIntervalIndex = 0;
        leftOperand += "-";
        break;
      }
      else if(i === 0){
        startIntervalIndex = 0;
        leftOperand += calculation[i];
        break;
      }
      else if(/[\/+*-]/.test(calculation[i])) {
        startIntervalIndex = i + 1;
        break;
      }
      else {
        leftOperand += calculation[i];
      }
    }
  
    leftOperand = leftOperand.split("").reverse().join("");
  
    return {
      leftOperand,
      rightOperand,
      startIntervalIndex,
      lastRightOperandCharacter
    }
  
  }

// btn reset 

const resetButton = document.querySelector("[data-action='c']");

resetButton.addEventListener("click", reset);

function reset(){
    calculatorData.calculation = "";
    calculatorData.displayedResults = false;
    calculatorData.result = "";
    resultDisplay.textContent = "0";
    calculationDisplay.textContent = ""
}

// Btn CE

const clearEntryButton = document.querySelector("[data-action='ce']");

clearEntryButton.addEventListener("click", clearEntry);

function clearEntry(){

    if(!calculatorData.displayedResults){                               // si il n'y a pas de result affiché
        if(resultDisplay.textContent[0] === "0") return;                // si on affiche 0 on return
        else if(resultDisplay.textContent.length === 1 ){               // si il n'y a qu'un élément affiché on repasse a 0
            calculatorData.calculation = "0"
        }
        else {
            calculatorData.calculation = calculatorData.calculation.slice(0, -1)     // sinon on slice le dernier élément
        }
        resultDisplay.textContent = calculatorData.calculation;
    }
}