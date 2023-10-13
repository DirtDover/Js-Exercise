// Récupération des infos et création des cookies

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {                               // Pour tous les inputs on va effectuer la fonction fléché : le addEventListener. Et du coup handleValidation
    input.addEventListener("invalid", handleValidation)
    input.addEventListener("input", handleValidation)
})

function handleValidation(e) {
    if(e.type === "invalid"){                           // si le champs est invalid (vide ou mal remplit) alors message d'erreur
        e.target.setCustomValidity("Ce champ ne peut être vide.")
    }else if (e.type === "input") {                     // si on ecrit dedans le message disparait
        e.target.setCustomValidity("")
    }
}

const cookieForm = document.querySelector("form");
cookieForm.addEventListener("submit", handleForm);

function handleForm(e) {
    e.preventDefault()

    const newCookie = {};

    inputs.forEach(input => {
        const nameAttribute = input.getAttribute("name")            // Pour chaque input on récupère son name et on récupère ppour chaque namme
        newCookie[nameAttribute] = input.value;                     // la valeur que l'utilisateur a rentré. le name est donné a l'input dans l'index.html
    })
    newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);  // Création de la date d'expiration du cookie. une semaine de cookie

    createCookie(newCookie);                                // création du cookie avec les infos des input en paramètre.

    cookieForm.reset();                                         // reset les champs du formulaire

}

function createCookie(newCookie){
              
    if(doesCookieExist(newCookie.name)){        // est ce que le cookie existe avec son nom comme paramètre
        createToast({name: newCookie.name, state: "modifié", color: "orangered"})           // du coup si il existe on le modifie
    } else {
        createToast({name: newCookie.name, state: "créé", color: "green"})           
                                                // toast = petit message en bas de la page ( Cookie créé ou cookie modifié ou supprimé)
    }                                           // sinon on le créé
    
                                                    // encodage  du cookie 
    document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expire=${newCookie.expires.toUTCString()}`

    if(cookieList.children.length){             //si on ajoute un cookie pdt qu'on les affiche le dom se mettra a jour automatiquement et l'affichera
        displayCookies()
    }

}

function doesCookieExist(name){

    const cookies = document.cookie.replace(/\s/g, "").split(";");  // on récup tous nos cookies en enlevant les espaces vide et en les séparant au niveau des ;
    const onlyCookiesName = cookies.map(cookie => cookie.split("=")[0]) // on ne veut que les noms dont on map (on fait un tableau) de cookies. on coupe au niveau du = et on veut le premier élément du tablea d'ou le 0
    
    const cookiePresence = onlyCookiesName.find(cookie => cookie === encodeURIComponent(name)); // on cherche un cookie qui aurait le même nom 
    return cookiePresence;
}

const toastContainer = document.querySelector(".toasts_container")

function createToast({name, state, color}){   // on déstructure l'objet qu'on va lui passer en paramètre 
    
    const toastInfo = document.createElement("p");   // on crée un p
    toastInfo.className = "toast";

    toastInfo.textContent = `Cookie ${name} ${state}.` // on passe les paramètres
    toastInfo.style.backgroundColor = color;

    toastContainer.appendChild(toastInfo);

    setTimeout(()=>{                  // fonction qui retire le toast au bout de 2500 ms  
        toastInfo.remove()
    }, 2500)
}

// Affichage et suppression des cookies

const cookieList = document.querySelector(".cookies_list");
const displayCookieBtn = document.querySelector(".display_cookie_btn");
const infoTxt = document.querySelector(".info_txt");

displayCookieBtn.addEventListener("click", displayCookies)  // quand on clique sur le btn on appelle la function displayCookies qui va afficher les cookies

let lock = false;
function displayCookies(){
    
    if(cookieList.children.length) {
        cookieList.textContent = "";  }  // si des cookies sont déja affiché, remet la liste a 0 et réaffiche. Pour pas avoir les même cookies qui s'affiche plusieurs fois
    
    const cookies = document.cookie.replace(/\s/g, "").split(";").reverse(); // On récup la liste des cookies avec le plus récent en premier

    if(!cookies[0]){            // si c'est false c'est quil ny a pas de cookies

        if(lock) return;
        
        lock = true;
        infoTxt.textContent = " Pas de Cookie, créez-en un !"
        
        setTimeout(()=>{                    
            infoTxt.textContent = "";
            lock= false
        }, 1500)
        return ;
    }
    createElements(cookies);            // sinon on créé l'élément cad on affiche l'élément avec les infos rentré dans le form
}

function createElements(cookies){

    cookies.forEach(cookie => {
        const formatCookie = cookie.split("=")   // pour chaque élément, on enlève le = , on récup un tableau propre des cookies
        const listItem = document.createElement("li");
        const name = decodeURIComponent(formatCookie[0]);   // on décode le nom du cookie. Le [0] c'est pour le premier élément du tableau soit le nom 
        listItem.innerHTML = `
        <p>
            <span>Nom</span> : ${name}
        </p>
        <p>
            <span>Valeur</span> : ${decodeURIComponent(formatCookie[1])}
        </p>
        <button>X</button>    
        `
        listItem.querySelector("button").addEventListener("click", e => {           // évènement sur le button supprimé X de l'affichage du cookie 
            createToast({name: name, state: "supprimé", color: "crimson"})
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`         // methode pour supprimé le cookie
            e.target.parentElement.remove()
        })
        cookieList.appendChild(listItem);
    })



}