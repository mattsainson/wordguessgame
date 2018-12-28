var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var gameWords = ['apple', 'chicken', 'coffee', 'salmon', 'pork'];

var myObj = {
    wordList: gameWords,
    currentWord: '',
    maxGuesses: 10,
    guessCnt: 0,
    usedWords: [],
    cntWins: 0,
    cntLosses: 0,
    usedLetters: [],
    lettersRemaining: 0,
    started: false,
    ended: false,
    startGame: function() { // get a random word from the list
        this.initGame();
    },
    initGame: function() {
        this.wordList = gameWords;
        this.usedWords = [];
        this.cntWins = 0;
        this.cntLosses = 0;
        document.getElementById('wins').innerText = 'Wins: 0';
        document.getElementById('losses').innerText = 'Losses: 0';
        // this.initWord();
    },
    initWord: function () {
        this.started = true;
        this.ended = false;
        this.currentWord = '';
        this.guessCnt = 0;
        this.usedLetters = [];
        this.lettersRemaining = 0;
        this.cleanupHTML();
        document.getElementById('guessedLetters').innerText = "Please guess a letter by typing it's key";
        this.startWord();
    },
    cleanupHTML: function() {
        var letterbox = null;
        var l = 0; 
        do {
            letterbox = document.getElementById('l'+l);
            if(letterbox===null) {
            } else {
                letterbox.parentNode.removeChild(letterbox);
                l++;
            }
        } while (letterbox!=null);
    },
    startWord: function(){
        var i = Math.floor(Math.random()*this.wordList.length);
        this.currentWord = this.wordList[i];
        this.origWord = this.currentWord;
        console.log(this.currentWord);
        // remove word from wordList array
        this.wordList.splice(i,1);
        // add word to used words array
        this.usedWords.push(this.currentWord);
        this.lettersRemaining = this.currentWord.length; //letter to guess set to all
        this.createLetterBoxes(this.currentWord.length);
    },
    createLetterBoxes: function(n) { //create the letter boxes
        for(var i=0;i<n;i++) {
            var div = document.createElement('div');//create the div
            div.setAttribute('id','l'+i);
            div.setAttribute('class','letter');
            div.innerHTML = '*';
            // console.log(div);
            var wordBox = document.getElementById('wordBox');
            // console.log(wordBox);
            wordBox.appendChild(div);
        }
    },
    doKey: function(event) {

        //get the key letter from the event and lowercase it
        var key = event.key;
        key = key.toLowerCase(key);
        console.log(key);
        //cases for key typed
        //enter/return we want to start
        if (event.keyCode === 13) {
            document.getElementById('startButton').click();
        } else if(this.started!=true) {
            // don't respond
            console.log('not started yet');
        } else if(this.ended) {
            console.log('the word ended');
        } else if(alphabet.indexOf(key)===-1){
            // this.beep();
            console.log(key + ' is not in the alphabet');
        } else if (this.usedLetters.indexOf(key)===-1) {
            this.processLetter(key);
        } else {
            // this.beep();
            console.log(key + ' has already been used ');
        }
    },
    processLetter: function(key) {
        console.log('processing letter: '+key);
        this.guessCnt++; //add to guessCnt
        this.usedLetters.push(key); //add to usedLetters
        console.log(this.usedLetters);
        document.getElementById('guessedLetters').innerText = this.usedLetters;
        //make a copy for replacing letters with *
        var wordCopy = this.currentWord;
        var charidx = -1;
        do {
            //look for letter in current word
            charidx = wordCopy.indexOf(key); 
            console.log(charidx);
            if(charidx === -1) {
                console.log('not found: '+key);
            } else {
                this.fillLetterDivs(charidx);
                wordCopy = wordCopy.replace(key,"*"); //update the word
                console.log('current word: '+wordCopy);
                this.lettersRemaining--; //subtract 1 for each letter guessed
                console.log('guesses left: '+this.lettersRemaining);
            }
        } while (charidx != -1);

        //if no more letters remaining, then we won
        if(this.lettersRemaining===0) {
            console.log('you won');
            this.doWeWon();
        } else if (this.guessCnt===this.maxGuesses) {
            //if guessCnt = maxGuesses then end word
            console.log('you lost');
            this.doWeLost();
        } else {
            //continue
            console.log('keep going');
        }
    },
    fillLetterDivs: function(m) {
            var letter = document.getElementById('l'+m);
            letter.innerText = this.currentWord.charAt(m);
            letter.style.color = 'green';
    },
    doWeWon: function() {
        this.cntWins++;
        document.getElementById('wins').innerHTML = 'Wins: '+this.cntWins;
        var myhead = document.getElementById('header').style.color = 'green';
        var thisWord = document.getElementById('wordsDone');
        var li = document.createElement('li');
        li.style.color = 'green';
        li.innerText = this.currentWord;
        thisWord.appendChild(li);
        this.stopGame('Winner!');
    },
    doWeLost: function() {
        this.cntLosses++;
        document.getElementById('losses').innerHTML = 'Losses: '+this.cntLosses;
        var myhead = document.getElementById('header').style.color = 'red';
        this.finishWord();
        var thisWord = document.getElementById('wordsDone');
        var li = document.createElement('li');
        li.style.color = 'red';
        li.innerText = this.currentWord;
        thisWord.appendChild(li);
        this.stopGame('Bummer!');
    },
    finishWord: function() {
        for(var i=0;i<this.currentWord.length;i++) {
            var letter = document.getElementById('l'+i);
            if(letter.innerText==='*') {
                letter.style.color = 'red';
            }
            letter.innerText = this.currentWord.charAt(i);
        }
    },
    stopGame: function(mess){
        this.ended = true;
        var myhead = document.getElementById('header').innerHTML = mess;
    }
    // beep: function() {
    //     var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    //     snd.play();
    // }
};

//start the game
myObj.startGame();

//set start button method
var myStart = document.getElementById('startButton');myStart.addEventListener('click',function(){myObj.initWord();});

//trap for keys
document.addEventListener('keyup',function(){myObj.doKey(event);});
