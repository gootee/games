// const secretWords = ["homework", "bootcamp", "topless", "available", "strategic", "flimflam", "impeachment"];
const gallowsPhotos = [
  "/images/gallows.jpg",
  "/images/gallows+head.jpg",
  "/images/gallows+head+torso.jpg",
  "/images/gallows+head+torso+leg.jpg", 
  "/images/gallows+head+torso+2leg.jpg",
  "/images/gallows+head+torso+2leg+arm.jpg",  
  "/images/gallows+head+torso+2leg+2arm.jpg"
]
let ourWord, ourWordIndex = 0, badGuessCount = 0;
const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

function letterButtonClicked(event) {
  let goodGuess = false;
  const ourButton = event.target
  const ourButtonDiv = ourButton.parentElement
  const isGuessed = ourButtonDiv.classList.contains("isGuessed")

  if (!isGuessed) {
    // const allAnswersCorrect = true;
    ourButtonDiv.classList.add("isGuessed")
    ourButton.classList.remove("btn-default")
    ourButton.classList.add("btn-danger")

    const ourLetter = ourButtonDiv.id
    const ourGuessLetters = document.querySelectorAll(".guessLetter");
    for (let i = 0; i < ourGuessLetters.length; i++) {
      if (ourGuessLetters[i].id === ourLetter) {
        ourGuessLetters[i].querySelector(".letterDisplay").innerHTML = ourLetter.toUpperCase();
        goodGuess = true;
        ourGuessLetters[i].classList.add("isCorrect")
      }
    }

    const resetButton = document.querySelector(".resetButton")
    if (goodGuess) {
      if ( puzzleIsComplete() ) {
        document.querySelector(".userMessage").innerHTML = "You win!"
        resetButton.setAttribute("style", "display:inline")
      }
    } else{
      badGuessCount++;
      setPhoto();
      if (badGuessCount >= 6) {
        document.querySelector(".userMessage").innerHTML = "You lose! The secret word was '" + ourWord + "'"
        resetButton.setAttribute("style", "display:inline")
      }
    }
  }
} 

function resetGame() {
  badGuessCount = 0;
  if (ourWordIndex < ourWord.length - 1) {
    ourWordIndex++;
    load();
  } else {
    document.querySelector(".userMessage").innerHTML = "Sorry, no more games available"
  }
}

function puzzleIsComplete() {
  const ourGuessLetters = document.querySelectorAll(".guessLetter");

  for (let i = 0; i < ourGuessLetters.length; i++) {
    if (!ourGuessLetters[i].classList.contains("isCorrect")) {
      return false;
    }
  }
  return true;
}

function setPhoto() {
  if (badGuessCount <= 6) {
    document.querySelector(".gallowsPhoto").setAttribute("src", gallowsPhotos[badGuessCount])
  }
}

function setLetterButtons() {
  const alphabetBox = document.querySelector(".alphabetBox")
  let htmlString  
  if (alphabetBox.childElementCount > 0) {
    alphabetBox.querySelectorAll(".letter").forEach(letter => {
      letter.classList.remove("isGuessed")
      const ourButton = letter.querySelector(".btn")
      ourButton.classList.remove("btn-danger")
      ourButton.classList.add("btn-default")
    })
  } else {
    alphabet.forEach(letter => {
      // htmlString = 
      //   "<div id='" + 
      //   letter +
      //   "' class= 'letter'><button class='btn btn-default' type='button'>" +
      //   letter.toUpperCase() +
      //   "</button></div>"   
        htmlString = 
        "<div id='" + 
        letter +
        "'><button class='letter' type='button'>" +
        letter.toUpperCase() +
        "</button></div>" 
        alphabetBox.insertAdjacentHTML('beforeend', htmlString);    
    })
  }
}

function setLetterSpaces() {
  const guessLetters = document.querySelector(".guessLetters")
  const currentLetters = guessLetters.querySelectorAll(".guessLetter")
  let htmlString 

  if (currentLetters.length > 0) { //delete all the current spaces
    for (letter of currentLetters) {
      guessLetters.removeChild(letter)
     }
  }
 
  for(let i = 0; i < ourWord.length; i++ ) {
    htmlString = 
      "<div id='" + 
      ourWord[i] + 
      "' class='guessLetter'><p class='letterDisplay'></p></div>"

    document.querySelector(".guessLetters").insertAdjacentHTML('beforeend', htmlString);    
  }
}

function load() {
  document.querySelector(".userMessage").innerHTML = "Choose letters one at a time.  Guess the word before guk.. guk.. gmmmp..."
  // ourWord = secretWords[ourWordIndex].split('');
  ourWord = word

  setPhoto();
  setLetterButtons();
  document.querySelectorAll(".letter").forEach(
    letter => {letter.addEventListener('click', letterButtonClicked)}
  )  
  setLetterSpaces();
}

document.querySelector(".resetButton").addEventListener('click', resetGame)
load();
