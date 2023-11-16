let dataArray ;

async function getUsers(){                                      // récupération des users par API
    try {
        const response = await fetch("https://randomuser.me/api/?nat=fr&results=50")

        const {results} = await response.json()
        console.log(results);
        orderList(results)
        dataArray = results              // function qui va organisé le tableau
        createUserList(dataArray)
    }
    catch(error){
        console.log(error);
    }
}
getUsers()

function orderList(data){           // function qui va organisé les résultats
    data.sort((a,b) => {            // le tableau va etre trié par rapport au nom de famille (last) par ordre alphabétique 
        if(a.name.last < b.name.last) {
            return -1;
        }
        else if(a.name.last > b.name.last) {
            return 1;
        }
        else {
            return 0;
        }
    })
}

const tableResults = document.querySelector(".table-results")

function createUserList(array){                                 // fonction qui va créer la list de user d'après le tableau organisé précédement
    array.forEach(user => {
        const listItem = document.createElement("div");
        listItem.className ="table-item";

        listItem.innerHTML = `
        
          <p class="main-info">
            <img
              src=${user.picture.thumbnail}
              alt="avatar picture"
            />
            <span> ${user.name.last} ${user.name.first}</span>
          </p>
          <p class="email">${user.email}</p>
          <p class="phone">${user.phone}</p>
        `
        tableResults.appendChild(listItem)
    });
}

const searchInput = document.querySelector("#search");

searchInput.addEventListener("input", filterData);

function filterData(e){
    tableResults.textContent = "";

    const searchedString = e.target.value.toLowerCase().replace(/\s/g, "");         // on récupère la valeur dans le champ de recherche en enlevant les espace et en mettan en miniscule

    const filteredArr = dataArray.filter(userData => searchForOccurences(userData)) 

    function searchForOccurences(userData){                     // on va vérifier par rapport au prénom et nom quon met dans le champ de recherche
        const searchTypes = {
            firstname: userData.name.first.toLowerCase(),
            lastname: userData.name.last.toLowerCase(),
            firstAndLast: `${userData.name.first + userData.name.last}`.toLowerCase(),
            lastAndFirst: `${userData.name.last + userData.name.first}`.toLowerCase(),
        }
        for (const prop in searchTypes) {                                   // si ca retourne true, ca renverra les résultats un tableau filtré dans filteredArr
            if(searchTypes[prop].includes(searchedString)) {
                return true;
            }
        }
    }

    createUserList(filteredArr)         // on récré la list juste avec le tableau filtré
}