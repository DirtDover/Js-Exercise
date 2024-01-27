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

    if(calculatorData.calculation === "0" ) calculatorData.calculation = ""   // on évite de rajouter des 0 quand on commence par 0
    


    calculatorData.calculation += buttonValue;
    resultDisplay.textContent = calculatorData.calculation              // on l'affiche
}

//btn operators


const operatorsBtns = buttons.filter(button => /[\/+*-]/.test(button.getAttribute("data-action")))  // on fait pareil pour + - * /

operatorsBtns.forEach(btn => btn.addEventListener("click", handleOperators))

function handleOperators(e) {
    const buttonValue = e.target.getAttribute("data-action");

    if(!calculatorData.calculation && buttonValue === "-"){                 // on veut afficher un - pour commencer, on veut commencer par un chiffre négatif
        calculatorData.calculation += buttonValue;
        resultDisplay.textContent = calculatorData.calculation;
        return ;
    }
    else if (!calculatorData.calculation) return ;                           // empeche de commencer pa un * ou un / ou un  +. Si rien n'est affiché a part un - on return si on clique sur un btn +, / ou * 
    else if (calculatorData.calculation.slice(-1).match(/[\/+*-]/)){        //si le dernier élément (slice(-1)) match avec un des opérateur on le change, on ajoute pas un autre opérateur. (slice(0, -1) + buttonValue)
        calculatorData.calculation = calculatorData.calculation.slice(0, -1) + buttonValue;
        resultDisplay.textContent = calculatorData.calculation;
    }
    else {
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
    else if (!calculatorData.displayedResults){                                 // si le résultat n'est aps affiché , on affiche le résultat
        calculatorData.result = customEval(calculatorData.calculation)
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

    const operands = getIndexes(operatorIndex, calculation)
    console.log(operands);
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