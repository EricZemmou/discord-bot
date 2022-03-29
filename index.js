var Discord = require("discord.js");

var Client = new Discord.Client({intents :[]})

const prefix = "!";
let isGameStarted = false;
const words = ['ZEMMOUR','BONBON','ARABE','TRIK','MARINE','ABANDON','ABBERANT','PINCETTE','REMOBILISERAIT'];
let currentWord = {
    solution:null,
    mystery: null,
    displayMystery:null
};
let lettersSaid = [];
const defaultTries = 5;
let tries = defaultTries;

Client.on("ready", () => { 
    Client.user.setActivity("triker des meufs !! ")
    console.log("bot operationnel");

});
Client.on("message", message => { 
   
    if(isGameStarted === false){
        if(message.content.startsWith("!pendu") === true){ 
            message.channel.send('le jeu va demarrer dans 5 secondes ! ');
            currentWord= getRandomWord();
            setTimeout(() => {
                message.channel.send(`Le mot a deviner est : ${getDisplayText(currentWord.mystery)}`);
            }, 5000);
            isGameStarted = true;
            }
            return;
    }
    if(message.content.length > 1 && message.content.split(' ').length === 1){
        if(currentWord.solution === message.content.toUpperCase()){
            message.channel.send(`Bravo ! Le mot  a ete trouver par : [${message.author}]`);
                restartGame();
        }
    }
    if(message.content.length === 1){
        const letter = (message.content.toUpperCase());
        if(letter.charCodeAt(0) < 65 || letter.charCodeAt(0)> 90){
            message.reply(`Le caractere [${letter}] n'est pas reconnue ,veuillez tapez une lettre `)
return;
        }
      
        if(isLetterInWord(letter) === true){
            message.channel.send(`${(currentWord.mystery)}`);
            if(currentWord.mystery.match(/\?/) === null){
                message.channel.send(`Bravo ! La derniere  lettre a ete trouver par : [${message.author}]`);
                restartGame();
            }
        }else{
            if(lettersSaid.includes(letter)  === false){
                lettersSaid.push(letter);
                tries--;
                message.channel.send(`la lettre [${(letter)}] n'est pas dans le mot .Essaie restant ${tries} / ${defaultTries}`);
            }
               
                
            
                if(tries === 0){
                  
                    message.channel.send(`PERDU ! le mot etait : ${currentWord.solution}`);
                    restartGame();
                }
                
        }
    }

});

const getDisplayText = (text) =>{
   const message = [];
   text.split('').forEach((letter) => {
       let  emoji = `:regional_indicator_${letter.toLowerCase()}:`;
       if(letter === '?'){
        emoji = `:grey_question:`;
       }
      
    message.push(emoji);
});
return message.join(" ");

};
const getMysteryFromSolution = (word) =>{
    const wordsArr = word.split('');
const mystery = wordsArr.map((letter, index)=>{
if(index === 0 || index === wordsArr.length -1 ){
return letter;
}
return '?';

});
return mystery.join("");
};
const getRandomInt = (max)=>{
    return Math.floor(Math.random()* Math.floor(max));
}
const getRandomWord = ()=>{
    const rand = getRandomInt(words.length -1);
    console.log('rand', rand);
    const solution = words[rand];

    const mystery = getMysteryFromSolution(solution);
    console.log("mystery", mystery);
    return {
        solution,
        mystery,
    }
};
const isLetterInWord = (letter)=>{

const isPresent= currentWord.solution.match(new RegExp(letter, 'i')) !== null;
if(isPresent === false){
return isPresent;
}
const mysteryArr = currentWord.mystery.split("");
const solutionArr = currentWord.solution.split("");
currentWord.mystery = mysteryArr.map((mLetter, index) =>{
    const sLetter = solutionArr[index] ;
if(mLetter !== "?"){
return mLetter;
}

if(sLetter === letter){
return sLetter;
}
return "?";
}).join("");
return isPresent;
};
const restartGame = () =>{
    isGameStarted = false;
    tries= defaultTries;
    lettersSaid = [];
}







Client.login(process.env.TOKEN);




