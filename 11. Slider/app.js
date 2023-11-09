const slides = [...document.querySelectorAll(".slide")]  // selection des élément dans mles slides

const sliderData ={                                         // tableau qui contient les infos de la slide. direction + index 
    locked: false,
    direction: 0,
    slideOutIndex: 0,
    slideInIndex: 0
}

const directionButtons = [...document.querySelectorAll(".direction_btn")];  // selection des btn de direction

directionButtons.forEach(btn => btn.addEventListener("click", handleClick)) // a chaque click sur les bouttons on lance la fonction handleslick

function handleClick(e){  
  
  if(sliderData.locked) return;
  sliderData.locked = true;

getDirection(e.target)
slideOut();
}

function getDirection(btn){                                                
  
  sliderData.direction = btn.className.includes("right") ? 1 : -1           // direction du slide si le bouton a la class right on fait +1 sinon -1 
  
  sliderData.slideOutIndex = slides.findIndex(slide => slide.classList.contains("active")) 

  if(sliderData.slideOutIndex + sliderData.direction > slides.length -1) {    //si on est sur la dernière slkide on revient au début a 0
    sliderData.slideInIndex = 0;
  }
  else if(sliderData.slideOutIndex + sliderData.direction < 0) {    //si on est sur la première slkide on va à la dernière
    sliderData.slideInIndex = slides.length -1;
  }
  else {
    sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction;    // si on est pas dans les cas de figure précédent ca incrémente de 1 pour afficher la suivante
  }

}

function slideOut(){                                      // fonction de la slide qui disparait avec toutes les animations

  slideAnimation({
    el: slides[sliderData.slideInIndex],
    props: {
      display: "flex",
      transform: `translateX(${sliderData.direction < 0 ? "100%" : "-100%"})`,
      opacity: 0
    }
  })

  slideAnimation({
    el: slides[sliderData.slideOutIndex],
    props: {
      transition: "transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out",
      transform: `translateX(${sliderData.direction < 0 ? "-100%" : "100%"})`,
      opacity: 0,
    }
  })

slides[sliderData.slideOutIndex].addEventListener("transitionend", slideIn)  // a la fin de l'animation de slideOut on envoie slideIn
}

function slideAnimation(animationObject){
  for(const prop in animationObject.props){
    animationObject.el.style[prop] = animationObject.props[prop]
  }
}

function slideIn(e){

  slideAnimation({
    el: slides[sliderData.slideInIndex],
    props: {
      transition: "transform 0.4s ease-out, opacity 0.6s ease-out",
      transform: "translateX(0%)",
      opacity: 1,
    }
  })
  slides[sliderData.slideInIndex].classList.add("active");
  slides[sliderData.slideOutIndex].classList.remove("active");
  e.target.removeEventListener("transitionend" ,slideIn)
  slides[sliderData.slideOutIndex].style.display = "none";

  setTimeout(() => {
    sliderData.locked = false;
  }, 400)
}
