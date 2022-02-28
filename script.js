let timer = false;
let botTimer = false;
const MAX = 6000;  //max 1 min
const HEADSTEP = 10;
const BOTSTEP = 100;
let current = 0;    //overall time spent in this game
let timeStep = 0;   //time spent in that round (girl head turns 360 degree as 1 round)
let playerState = true;
let started = false;
let noOfTurns = 0;
let botRounds = [];
let deadImg = ["images/botdead0.png", "images/botdead1.png"]

let overlay = document.querySelector(".overlay");
let playBtn = document.querySelector("#play");


/* GENERALIZED FUNCTIONS */

//generating a bot in SVG
function createBot(id, x, y, bothead) {
    return `<image id="${id}" x="${x}" y="${y}" href="images/${bothead}.png" height="30" botstate="A"/>`;
}

//clear all interval and variable
function stopGame() {
    playerState = false;
    timeStep = 0;

    clearInterval(timer);
    timer = false;
    current = 0;

    clearInterval(botTimer);
    botTimer = false;
}

//real time update the timer
function setClock() {
    let sec = MAX - current + 1;
    let clock = document.querySelector("#clock");
    clock.innerHTML = "TIME LEFT: " + sec.toString().padStart(4, "0").substring(0, 2) + ":" + sec.toString().padStart(4, "0").substring(2, 4);
    if (sec.toString().padStart(4, "0").substring(0, 2) == 10) { clock.classList.add("redClock"); }
}

//randomly assign the no. of turns each bot can play until dead
function randomBotRounds() {
    for (i = 1; i < 30; i++) {
        botRounds.push(Math.floor((Math.random() * 15) + 1));
    }
    //console.log("botRounds = " + botRounds);
}

//set random distance in two direction of bot movement 
function moveBots(id, range, dir) {
    let bot = document.querySelector("#bot" + id);
    let botDir = bot.getAttribute(dir);
    bot.setAttribute(dir, botDir - range);
}


/* GAME FUNCTIONS */

//Initialize everything when start a new game or reset
function init() {

    //initialize all the variables
    stopGame();

    //generate 30 bots in random positions in svg
    let bots = document.querySelector("#bots");
    let botOutput = "";
    let P = 30;

    for (let i = 1; i < P; i = i + 1) {
        botOutput += createBot("bot" + i, ((Math.random() * 20) + 1140), Math.floor((Math.random() * 550) + 1), "bothead");
    }
    bots.innerHTML = botOutput;

    //initialize linecolor
    document.querySelector("#rgline").setAttribute("stroke", "rgb(216, 67, 21)");

    //initialize head
    document.querySelector("#head").setAttribute("transform", 'rotate(0)');
    timeStep = 0;

    //initialize player
    playerState = true;
    document.querySelector("#player").outerHTML = '<image id="player" class="red" x="1150" y="300" href="images/456head.png" height="40" />';

    //initialize gameover message
    document.querySelector("#output").innerHTML = " ";
    started = false;

    //initialize clock
    let clock = document.querySelector("#clock");
    clock.innerHTML = `TIME LEFT: ${MAX / 100}:00`;
    clock.classList.remove("redClock");

    //initialize no of turns
    noOfTurns = 0;

    //initialize botRounds
    botRounds = [];
    randomBotRounds();

    //initialize the overlay
    overlay.classList.add("displayOverlay");

    //initialize the playBtn
    playBtn.innerHTML = `PLAY <i class="fas fa-play"></i>`;
}


//Rotate the girl head per each turn in random speed, and trigger checking on win/lose
function moveHead() {
    let turnRate = Math.random() * (3 - 1) + 1;   //each turn will have different turning speed
    let pause = 360 / turnRate;     //calculate the time needed to turn 360 degree, i.e. reaching the forwarding position
    let pauseTime = 300;   //after each turn, the head will stay for 300ms
    if (!timer) {
        timer = setInterval(() => {
            setClock();
            let redGreenLine = document.querySelector("#rgline");
            let head = document.querySelector("#head");
            current++;
            timeStep++;

            if (timeStep > pause) {             //when the time reaches the pause time (i.e. red light status), stop the head and change line to red
                redGreenLine.setAttribute("stroke", "rgb(216, 67, 21)");

                for (let j = 1; j < 30; j++) {  //when it is red light, some bots will die (according to their randomly assigned no. of rounds to play till dead)
                    let bot = document.querySelector("#bot" + j);
                    let botState = bot.getAttribute("botstate");    //botstate is to define the bot is "A"- active, or "D"- dead
                    //let randomDeadImg = Math.random() * 2 >= 1;
                    if (botRounds[j - 1] <= noOfTurns && bot.getAttribute("x") > 105 && botState == "A") {  //if the bot reaches the max. no. of round to play, kill the bot
                        bot.setAttribute("botstate", "D");      //set botstate from "A"- active to "D"- dead
                        bot.setAttribute("href", deadImg[parseInt(Math.random() * deadImg.length)])//replace bot image by dead bot image, two versions of dead images will be used randomly
                        bot.setAttribute("height", "50");       //dead image's height is higher than normal bot image
                    }
                }
            }
            if (timeStep >= pause + pauseTime) {    //when the head stays for 300ms already, move the head again
                timeStep = 0;
                turnRate = Math.random() * (3 - 1) + 1;  //randomize the turn rate again
                pause = 360 / turnRate;     //recalculate the time needed to turn 360 degree
                //console.log("current" + current + " timeStep" + timeStep + " pause" + pause + " pauseTime" + pauseTime);
                noOfTurns++;
                //console.log("noOfTurns = " + noOfTurns);
                return;
            }
            if (timeStep <= pause) {        //before the time reaches the pause time, turn the girl head
                head.setAttribute("transform", 'rotate(' + timeStep * turnRate + ' 55 62)');
                redGreenLine.setAttribute("stroke", "green");
            }

            checkWinLose();
        }, HEADSTEP);
    }
}

//User click Play or Replay, start the game
function start() {
    init();
    moveHead();
    started = true;
    overlay.classList.remove("displayOverlay");

    //bots move randomly towards head
    if (!botTimer && playerState) {
        botTimer = setInterval(() => {
            let P = 30;
            for (let i = 1; i < P; i = i + 1) {
                let lineColor = document.querySelector("#rgline").getAttribute("stroke");
                let bot = document.querySelector("#bot" + i);
                let botState = bot.getAttribute("botstate");
                let shouldRun = Math.random() >= 0.5;
                // only move if not yet pass the line and line is green
                if (botState == "A" && shouldRun && lineColor == "green" && bot.getAttribute("x") > 90) {
                    moveBots(i, Math.floor((Math.random() * 13) + 1), "x");
                    moveBots(i, Math.floor(((Math.random() - 0.8) * 2) + 1), "y");
                }

                //check win or lose in case the bot crosses the line before the player
                checkWinLose();
            }
        }, BOTSTEP)
    }
}

//Check winning or losing criteria, L = lose, W = win
function checkWinLose() {
    let player = document.querySelector("#player");

    //time is up
    if (current > MAX + 1) {
        gameOver("L", "TIME IS UP!");
    }
    //player passed the line
    else if (player.getAttribute("x") < 100) {
        gameOver("W", "YOU WIN!");
    }

    //one bot reached the goal first
    let bots = document.querySelectorAll(`image[id^="bot"]`);
    for (let bot of bots) {
        if (bot.getAttribute("x") <= 100) {
            gameOver("L", "YOU ARE TOO SLOW!");
        }
    }

}

//User click on play area, player move and check if caught by the girl
function processGame() {
    let player = document.querySelector("#player");
    let x = player.getAttribute("x");
    let lineColor = document.querySelector("#rgline").getAttribute("stroke");

    //player move towards head per click
    if (playerState && started) {
        player.setAttribute("x", x - 11);
    }

    //girl caught player
    if (lineColor != "green" && output.innerHTML == " " && started) {
        gameOver("L", "SHE CAUGHT YOU!");
    }
}

/* INSTRUCTION TOGGLE */
let h2Button = document.querySelector("h2");
h2Button.addEventListener("click", openInstruction);

let close = document.querySelector("#close");
close.addEventListener("click", closeInstruction);

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