function getRandomNumber(min, max){                                               
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0]  // crypto.getRandomValues est une méthode pour avoir un choffre aléatoire 
                                                                        // uint32Arrayu cré un tableau qui pren 1 veleur ( le (1)) et qui a une taille de 32bit.
    randomNumber = randomNumber / 4294967296                            // on divise le chiffre par la taille max du tableau (32 bit donc 4 milliard quelquechose) pour avoir un chiffre du type 0.quelquechose

    return Math.trunc(randomNumber * (max - min +1)) + min;             // on enlève les chiffres derrière la virgule et ca devient un nombre compris dans l'intervalle ( min max) 
}

console.log(getRandomNumber(0,5));

function addASet(fromCode, toCode){                                 // function qui va aléatoirement prendre des lettres maj, min et les symbols
    let charactersList = ""                                         // on initie la characterList comme vide, on la remplit après

    for(let i = fromCode; i <= toCode; i++){            // on va boucler pour chaque fois ou i est < a toCode( on va donner un interval, tant qu'on est dans l'interval on va boucler et récupérer les charactères)
        charactersList += String.fromCharCode(i)    //fromCharcode récupère le nimbre(code) lié a chaque caractère. chaque maj ou min ou symbole est lié a un chifffre. A = 65 b = 98 par exemple 
    }

    return charactersList;
}

const charactersSet = {
    lowercaseChars : addASet(97,122),       //les minuscules
    upperCaseChars : addASet(65,90),        // les majs
    numbers : addASet(48,57),
    symbols : addASet(33,47) + addASet(58,64) + addASet(91,96) + addASet(123,126),
  }

const range = document.querySelector("input[type='range']");            // on récupère la range du mot de passe ( la taille)
const rangeLabel = document.querySelector(".range-group label");

rangeLabel.textContent = `Taille du mot de passe : ${range.value}`
let passwordLength = range.value;

const passwordContent = document.querySelector(".password-content");        // on récupère tout ce dont on a besoin 
const errorMsg = document.querySelector(".error-msg");
const generateBtn = document.querySelector(".generate-password-btn");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

generateBtn.addEventListener("click", createPassword)

function createPassword(){
    const checkedDataSets = checkedSets()       // un tableau qui contient tous les élément qu'on a coché pour notre mot de passe ( min maj number et symbol)

    if(!checkedDataSets.length){                    // si le tableau est vide ( si on a coché aucune checkbox)
        errorMsg.textContent = " Au moins une case doit être cochée !"
        return;
    } else {
        errorMsg.textContent = ""
    }
    const concatenatedDataSets = checkedDataSets.reduce((acc, cur) => acc + cur)  // on va collé tout le tableau. Ca nous donne une chaine de caractère qui contient l'emsembles des ensembles qui on été coché

    let password = ""                   //initialisation du password

    let passwordBase = [];
    for(let i =0; i <checkedDataSets.length; i++){
        passwordBase.push(checkedDataSets[i][getRandomNumber(0,checkedDataSets[i].length -1)])  // on s'assure d'avoir au moin un élément de chaque gros groupe que l'on a coché ( une min une maj un nombre et un symbole en fonction de ce que l'on a coché)
    }

    for(let i = checkedDataSets.length; i< passwordLength; i++){                                // on ajoute les éléments random du mdps en fonction de la longueur du mot de passe
        password += concatenatedDataSets[getRandomNumber(0, concatenatedDataSets.length -1)]
    }

    passwordBase.forEach((item, index) => {                         // on mélange au hasard les deux boucles précédentes ( au moins un elément de chaque + les reste du mdp)
        const randomIndex = getRandomNumber(0, passwordLength);
        password = password.slice(0,randomIndex) + passwordBase[index] + password.slice(randomIndex);

    })

    passwordContent.textContent = password;    // on affiche le password sur la page

}
createPassword();
function checkedSets(){             // function qui va vérifié ce qui est coché comme checkbox
    const checkedSets= []           // initialisation du tableau vide que l'on va remplir
    checkboxes.forEach(checkbox => checkbox.checked && checkedSets.push(charactersSet[checkbox.id]));   // pour chaque checkbox on va vérifier si elle est coché et si c'est true alors (&& dans ce cas) on va remplir le tableau (push) avec l'ensemnble correspondant a la chackbox (checkbox.id et l'ensemble c'est les majs et mins de tout à l'heure)

    return checkedSets

}

console.log(checkedSets());

range.addEventListener("input", handleRange)

function handleRange(e){                                                // affichage dynamique de la range du mdp
  passwordLength = e.target.value;
  rangeLabel.textContent = `Taille du mot de passe : ${passwordLength}`
}

const copyBtn = document.querySelector(".copy-btn");        
copyBtn.addEventListener("click", copyPassword)             

let locked = false;
function copyPassword(){                                            // copy du mdp
  navigator.clipboard.writeText(passwordContent.textContent);

  if(!locked) {
    copyBtn.classList.add("active")
    locked = true;

    setTimeout(() => {
      copyBtn.classList.remove("active")
      locked = false;
    }, 600)
  }
}