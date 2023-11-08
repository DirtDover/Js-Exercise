const slides = [...document.querySelectorAll(".slide")]  // selection des élément dans mles slides

const sliderData ={
    direction: 0,
    slideOutIndex: 0,
    slideInIndex: 0
}

const directionButtons = [...document.querySelectorAll(".direction_btn")];  // selection des btn de direction

directionButtons.forEach(btn => btn.addEventListener("click", handleClick)) // a chaque click sur les bouttons on lance la fonction handleslick

function handleClick(e){                    

getDirection(e.target)
}

function getDirection(btn){                                                 // 
  
  sliderData.direction = btn.className.includes("right") ? 1 : -1
}
