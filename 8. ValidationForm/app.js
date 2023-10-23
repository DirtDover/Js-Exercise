const inputsValidity = {                                    // objet qui contient les validation des différents champs. A chaque function de vérification 
    user: false,                                            // on modifiera l'objet en fonction de si il est validé ou non 
    email: false,
    password: false,
    passwordConfirmation: false
}

const form = document.querySelector("form");                                // selection du form et du container
const container = document.querySelector(".container");

form.addEventListener("submit", handleForm)                                 // au submit du form on lance la fonction handleForm

let isAnimating = false;
function handleForm(e){
    e.preventDefault()
    const keys = Object.keys(inputsValidity)            // //methode qui retourne un tableau avec les différentes propriétés de inputsValidity 
    const failedInputs = keys.filter(key => {           // on filtre le tableau pour trouver les input qui ne sont pas valide qui ne sont pas true dasn inputsValidity
        if(!inputsValidity[key]){                       // on retourne ceux qui ne sont donc pas true dans inputsValidity
            return key;                                                           
        }
    })
    if(failedInputs.length && !isAnimating) {           // si failedInput a une longueur donc si failedInput comporte un champ non valide
        isAnimating = true;
        container.classList.add("shake");                   // alors on passe isanimating en true et on ajoute la class shake. Class qui va animer le container
        setTimeout(()=> {
            container.classList.remove("shake")                 // dans 400ms lanimation s'arrète la class est enlever et on repasse isAnimating en false
            isAnimating = false
        }, 400)

        failedInputs.forEach(input => {                             // on cherche pour chaque input qi il est failed et du coup on passe par showValidation  pour afficher les icones
            const index = keys.indexOf(input)
            showValidation({index: index, validation: false})
          })
    } 
    else {
        alert("Données envoyées avec succès !")
    } 
}


const validationIcons = document.querySelectorAll(".icone_verif");  //  Selection icone + text d'error
const validationTexts = document.querySelectorAll(".error_msg");

const userInput = document.querySelector(".input_group:nth-child(1) input")  // selection des inputs pour le user

userInput.addEventListener("blur", userValidation)     // ecoute des évènement : Blur s'active quand un input est sélectionné et qu'on change d'input
userInput.addEventListener("input", userValidation)    // l'évènement input s'active au moment ou on écrit dans le champ

function userValidation(){                              // fonction qui verifie le premier champ de caractère : le nom du user
    if(userInput.value.length >= 3){
        validationIcons[0].style.display = "inline"      // le [0] c'est pour le premier champ du formulaire
        validationIcons[0].src = "ressources/check.svg"
        validationTexts[0].style.display = "none"
        inputsValidity.user = true;
    } else {
        validationIcons[0].style.display = "inline"
        validationIcons[0].src = "ressources/error.svg"
        validationTexts[0].style.display = "block"
        inputsValidity.user = false;
    }
}

function showValidation({index, validation}){                   // function qui va eviter que l'on se répète dans laquelle on rentre laffichage
                                                                 // des icones et du texte en fonction de si c'est validé et de l'index.
if(validation){                                             // méthode utilisé pour les prochains champs
validationIcons[index].style.display = "inline"      
validationIcons[index].src = "ressources/check.svg"                    
if (validationTexts[index]) validationTexts[index].style.display = "none"     // on vérifie si il y a un message d'erreur prévu pour le champs,;  si il y en a un il l'affiche sinon il ne se passe rien. et donc si il n'y en a pas, pas d'erreur dans la console.
} else {
validationIcons[index].style.display = "inline"
validationIcons[index].src = "ressources/error.svg"
if (validationTexts[index]) validationTexts[index].style.display = "block" 
}
}



const mailInput = document.querySelector(".input_group:nth-child(2) input")   // on change le child du coup c'est le second enfant du groupe des inputs

mailInput.addEventListener("blur", mailValidation)     
mailInput.addEventListener("input", mailValidation)

const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/              // methode qui verifie le mail
function mailValidation(){                                                  // fonction qui verifie le mail entré dans le champ
    if(regexEmail.test(mailInput.value)){
        showValidation({index: 1,validation: true})
        inputsValidity.email = true;                         // on utilise la seconde methode avec la function showValidation
    } else {                                                                // on pense a changer l'index ! 
        showValidation({index: 1,validation: false})
        inputsValidity.email = false;
    }
}


const pswInput = document.querySelector(".input_group:nth-child(3) input")   

pswInput.addEventListener("blur", passwordValidation)     
pswInput.addEventListener("input", passwordValidation)

const passwordVerification = {
    length: false,
    symbol: false,
    number: false
}   

const regexList = {
    symbol: /[^a-zA-Z0-9\s]/,  // tout ce qui est un chiffre une minuscule ou une maj sera rejeté
    number: /[0-9]/             // simple list des numéro de 0 a 9 
}

let passwordValue;              // variable qui stocke le mdp pour le réutiliser pour le champ confirmation mdp

function passwordValidation(e){                                 // function qui verif le mdp
    passwordValue = pswInput.value;
    let validationResult = 0;                                   // on créer une variable nombre qu'on incrémente quand on passe les test pour réutiliser plus tard pour la force du mdp et laffichage d'icone
    
    for(const prop in passwordVerification){                // pour chaque propriété passwordVerification( lenght/ symbol/ number) on boucle sur chaque élément du mot de passe
        if(prop === "length"){                               // pour la longueur
            if(passwordValue.length < 6){
                passwordVerification.length = false;
            } else {
                passwordVerification.length = true;
                validationResult++;
            }
            continue;                                               
        }
        if(regexList[prop].test(passwordValue)){                        // le mdp passe a traver la regexlist, si elle est respecter ca retourne true
            passwordVerification[prop] = true;
            validationResult++;                          // et ca pour les deux prop ( number et symbol)
        } else {
            passwordVerification[prop] = false;
        }                               
    }

    if(validationResult != 3){
        showValidation({index: 2, validation: false})
        inputsValidity.password = false;               // si le mdp ne passe pas les trois propriété la validation est false
    } else {
        showValidation({index: 2, validation: true})
        inputsValidity.password = true;
    }
    passwordStrength()                              // fonction qui va afficher la force du mdp, les lignes de couleurs
}


const lines = document.querySelectorAll(".lines div")               // selection des lignes


function passwordStrength(){                                        // function qui va afficher les lignes
    const passwordLength = pswInput.value.length;                   // variable qui prend la longeur du mdp

    if(!passwordLength){                                            // si le champ est vide, pas de ligne
        addLines(0)
    }
    else if (passwordLength > 9 && passwordVerification.symbol && passwordVerification.number){
        addLines(3)                                                 // si le mdp fais plus de 9 élément + respecte symbol et number alors ajout de 3 lignes        
    }
    else if (passwordLength > 6 && passwordVerification.symbol || passwordVerification.number ){
        addLines(2)                                              // si le mdp fais plus de 6 élément + respecte symbol ou number alors ajout de 2 lignes
    } 
    else {
        addLines(1)
    }

    function addLines(numberofLines){                       // function qui ajoute les lignes. Tant que l'index qui démarre a 0 est inférieur au nombre de ligne
        lines.forEach((el, index) => {                      // en paramètre, la function affiche la ligne. et ca boucle jusqua que ce na soit plus vrai que l'index
            if(index < numberofLines){                      // soit inférieur au nombre de ligne
                el.style.display = "block";
            } else {
                el.style.display = "none";
            }
        })
    }

    if(validationIcons[3].style.display === "inline") {                     // si le mdp est validé on lance la function qui vérifie si les mdps sont identiques
        confirmPassword()
      }
}

const confirmInput = document.querySelector(".input_group:nth-child(4) input")          // on récupère le champs de verif de mdp

confirmInput.addEventListener("blur", confirmPassword)                  
confirmInput.addEventListener("input", confirmPassword)

function confirmPassword(){                                             // function qui confirme que les mdp soient identique
  const confirmedValue = confirmInput.value;

  if(!confirmedValue && !passwordValue) {                               // si  le champs est vide on n'affiche rien 
    validationIcons[3].style.display = "none";
  }
  else if(confirmedValue !== passwordValue) {                           // si les deux champs sont différents
    showValidation({index: 3, validation: false})
    inputsValidity.passwordConfirmation = false;
  }
  else {
    showValidation({index: 3, validation: true})                        // si les champs sont identique 
    inputsValidity.passwordConfirmation = true;
  }
}