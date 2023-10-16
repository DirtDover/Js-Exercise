let workTime = 1800;
let restTime = 300;

function formattedTime(time){                   // function qui formatte l'affichage du temps de la façon dont on le veux.
    return `${Math.trunc(time/60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60} `
}

const displayWork = document.querySelector(".work_display_time");               // affichage de l'heure
const displayPause = document.querySelector(".pause_display_time");

displayWork.textContent = formattedTime(workTime)
displayPause.textContent = formattedTime(restTime)

const togglePlayBtn = document.querySelector(".toggle_btn");                // button start pause
togglePlayBtn.addEventListener("click", togglePomodoro);

let currentInterval = false;
let timerID;


function togglePomodoro(){                                              
    handlePlayPause();

    if(currentInterval) return;
    currentInterval = true;

    workTime --;
    displayWork.textContent = formattedTime(workTime)
    timerID = setInterval(handleTicks, 1000)
}

let pause = true;                                                               // changement de l'image du button 
function handlePlayPause(){
    if(togglePlayBtn.getAttribute("data_toggle") === "play"){
        pause = false;
        togglePlayBtn.firstElementChild.src = "ressources/pause.svg";
        togglePlayBtn.setAttribute("data_toggle", "pause")

        if(workTime){
            handleClassAnimation({work: true, rest: false})
        }else {
            handleClassAnimation({work: false, rest: true})
        }
    }else {
        pause = true;
        togglePlayBtn.firstElementChild.src = "ressources/play.svg";
        togglePlayBtn.setAttribute("data_toggle", "play")
    }
}

function handleClassAnimation(itemState){                   // fonction qui ajout la class active pour le css pour les animations
    for(const item in itemState){
        if(itemstate[item]){
            document.querySelector(`.${item}`).classList.add("active")
        }else {
            document.querySelector(`.${item}`).classList.remove("active")
        }
    }
}



const cycles = document.querySelector(".cycles");               // function qui décrémente le temps en fonction de ce qui se passe + gère l'affichage des cycles 
let cyclesNumber = 0;

function handleTicks(){

    if (!pause && workTime > 0){
        workTime--;
        displayWork.textContent = formattedTime(workTime)
        handleClassAnimation({work: true, rest: false})
    }
    else if (!pause && !workTime && restTime > 0) {
        restTime--;
        displayPause.textContent = formattedTime(restTime);
        handleClassAnimation({work: false, rest: true})
    }
    else if (!pause && !worktime && !restTime){
        workTime = 1800;
        restTime = 300;
        displayWork.textContent = formattedTime(workTime)
        displayPause.textContent = formattedTime(restTime)
        handleClassAnimation({work: true, rest: true})

        cyclesNumber++;
        cycles.textContent = `Cycle(s) : ${cyclesNumber}`
    }
}

const resetBtn = document.querySelector(".reset_btn");               // btn reset
resetBtn.addEventListener("click", reset);

function reset(){                                                   // function qui reset le temps quand on appuie sur le boutton
    workTime = 1800;
    restTime = 300;

    displayWork.textContent = formattedTime(workTime)
    displayPause.textContent = formattedTime(restTime)

    cyclesNumber = 0;
    cycles.textContent = `Cycle(s) : 0`

    clearInterval(timerID);
    currentInterval = false;
    pause = true;

    togglePlayBtn.setAttribute("data_toggle", "play")
    togglePlayBtn.firstElementChild.src = "ressources/play.svg";
}