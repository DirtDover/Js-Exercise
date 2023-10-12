// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

const form =document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error_msg");
const loader = document.querySelector(".loader")
const resultdisplay = document.querySelector(".result_display")  // la ou vont aller les cards


form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
    e.preventDefault();
  
    if(input.value === ""){                                 // message d'erreur en cas de champ vide
        errorMsg.textContent = "Veuillez remplir le champ de recherche !";
        return ;
    } else {
        errorMsg.textContent = "";
        loader.style.display = "flex"
        resultdisplay.textContent = ""
        wikiApiCall(input.value);
    }
  }

  async function wikiApiCall(searchInput) {                 // récupération des données et traduction en json
    
    try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)
    
    if(!response.ok) {                                      // si il y a une erreur 404 elle sera géré et afficher pour le client. Si la reponse na pas un status ok.
        throw new Error(`${response.status}`)
    }
    
    const data = await response.json()
    createCards(data.query.search)                  // création des cards des résultats du fetch
    }
    
    catch(error){
        errorMsg.textContent = `${error}`;
        loader.style.display = "none";
    }                           
  }


  function createCards(data) {                                  // création des cards

if(data.length === 0) {                                            // erreur en cas de non résultat
    errorMsg.textContent = "Woops, aucun résultat."
    loader.style.display = "none"
    return;
}
data.forEach(el => {                                                // création des cards par rapport aux infos fetch
    const url = `https://en.wikipedia.org/?curid=${el.pageid}`
    const card = document.createElement("div")
    card.className = "result_item";
    card.innerHTML = `
        <h3 class="result_title">
            <a href = ${url} target = "_blank">${el.title}</a>
        </h3>
        <a href=${url} class="result_link" target="_blank">${url}</a>
        <span class="result_snippet">${el.snippet}</span>><br />
    `
    resultdisplay.appendChild(card);
    
})
    loader.style.display = "none"
  }