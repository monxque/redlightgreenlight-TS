let overlay = document.querySelector(".overlay");
let playBtn = document.querySelector("#play");
let h2Btn = document.querySelector("h2");
h2Btn.addEventListener("click", openInstruction);

let closeBtn = document.querySelector("#close");
closeBtn.addEventListener("click", closeInstruction);

//open instruction modal only when the overlay is present
function openInstruction() {
    let output = document.querySelector("#output");
    if (overlay.classList.contains("displayOverlay")) {
        let instruction = document.querySelector(".instruction");
        instruction.classList.add("displayInstruction");
        playBtn.classList.add("hide");
        output.classList.add("hide");
    }
}

//close instruction modal
function closeInstruction() {
    let output = document.querySelector("#output");
    let instruction = document.querySelector(".instruction");
    instruction.classList.remove("displayInstruction");
    playBtn.classList.remove("hide");
    output.classList.remove("hide");
}

//display result in an overlay to user
function gameOver(result, reason) {
    let output = document.querySelector("#output");
    let playBtn = document.querySelector("#play");
    overlay.classList.add("displayOverlay");
    playBtn.innerHTML = `REPLAY <i class="fas fa-redo-alt"></i>`;
    if (result == "L") {
        output.outerHTML = `<div id="output"><span class="gameover">GAMEOVER</span> <br><br> <span class="lose">${reason}<span></div>`;
        document.querySelector("#player").setAttribute("href", "images/456dead.png");
        document.querySelector("#player").setAttribute("height", "60");
    } else {
        '<div id="output"><span class="congrats">CONGRATULATIONS!</span> <br><br> <span class="win">YOU WIN!<span></div>'
    }
    stopGame();
}