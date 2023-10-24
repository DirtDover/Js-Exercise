const imagesList = document.querySelector(".image_list");                       // selection des containers 
const errorMsg = document.querySelector(".error_msg");
let searchQuery = "random";                                                     // mise en place des variables de recherches et du nombre de pages
let pageIndex = 1;

async function fetchData(){                                                     // function qui récupère les images
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchQuery}&client_id=IBjqH_uGHD7SF1kE6zyB0fvtfac-H2bjEGVYQ7aY02I`)
    
        if(!response.ok){                                                       // si le status n'est pas ok alors envoie de l'erreur 
            throw new Error(`Erreur : ${response.status}`)
        }
    
        const data = await response.json();
    
        if(!data.total){                                                        // si la recherche ne contient pas d'images. Si le mot que l'on a rentré dans le champ de recherche ne retourne aucun résultat
            imagesList.textContent = "";
            throw new Error("Oops, aucun résulta dans notre base de données... tentez un autre mot clé plus précis !")
        }

        createImages(data.results)
    }
    catch(error){
        errorMsg.textContent = `${error}`;
    }
}
fetchData();

function createImages(data){                                                    // on boucle pour que sur chaque data recus on crée une image 
    data.forEach(img => {
        const newImg = document.createElement("img");
        newImg.src = img.urls.small;
        imagesList.appendChild(newImg);
    })
}

const observer = new IntersectionObserver(handleIntersect, {rootMargin: "50%"})             // funvtion qui relance un fetch + ajout des images au dom quanbd on atteint 50% de la page
observer.observe(document.querySelector(".infinite_marker"))

function handleIntersect(entries){
    if(window.scrollY > window.innerHeight && entries[0].isIntersecting){
        pageIndex++;
        fetchData();
    }
}

const input = document.querySelector("#search");                                   
const form = document.querySelector("form");

form.addEventListener("submit", handleSearch)                                                // envoie du formulaire

function handleSearch(e){                                               
    e.preventDefault();

    imagesList.textContent = "";
    if(!input.value){
        errorMsg.textContent = "L'objet de la recherche ne peut être vide."
        return;
    }

    errorMsg.textContent = "";
    searchQuery = input.value;
    pageIndex = 1;
    fetchData()
}

const scrollToTop = document.querySelector(".scroll_to_top")                                // selection button pour remonter en haut de la page

scrollToTop.addEventListener("click", pushToTop);

function pushToTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}