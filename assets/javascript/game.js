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
        this.showGuessCnt();
        this.usedLetters = [];
        this.lettersRemaining = 0;
        this.cleanupHTML();
        var instr = document.getElementById('instructions');
        instr.style.color = 'black';
        document.getElementById('guessedLetters').innerText = 'Guessed Letters: '+this.usedLetters;
        instr.innerText = "Guess a letter by typing it's key.";
        this.startWord();
        var wordImg = document.getElementById('wordImg');
        wordImg.setAttribute('src', '');
        wordImg.setAttribute('alt', '');
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
        if(this.wordList.length === 0) {
            document.getElementById('startButton').innerText = 'Game Over (no more words)';
        } else {
        var i = Math.floor(Math.random()*this.wordList.length);
        this.currentWord = this.wordList[i];
        // so we can manipulate the word
        this.origWord = this.currentWord;
        console.log(this.currentWord);
        // remove word from wordList array
        this.wordList.splice(i,1);
        // add word to used words array
        this.usedWords.push(this.currentWord);
        this.lettersRemaining = this.currentWord.length; //letter to guess set to all
        this.createLetterBoxes(this.currentWord.length);
        }
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
            console.log(event.keyCode);
            document.getElementById('startButton').click();
        } else if(this.started!=true) {
            // don't respond
            console.log('not started yet');
        } else if(this.ended) {
            console.log('the word ended');
        } else if(alphabet.indexOf(key)===-1){
            // this.beep();
            console.log(key + ' is not in the alphabet');
            console.log(event.keyCode);
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
        this.showGuessCnt();
        this.usedLetters.push(key); //add to usedLetters
        console.log(this.usedLetters);
        document.getElementById('guessedLetters').innerText = 'Guessed Letters: '+this.usedLetters;
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
    showGuessCnt: function() {
        document.getElementById('guessesLeft').innerText = 'Guesses: '+ (this.maxGuesses-this.guessCnt);
        document.getElementById('guessedLetters').innerText = 'Guessed Letters: '+this.usedLetters;
    },
    fillLetterDivs: function(m) {
            var letter = document.getElementById('l'+m);
            letter.innerText = this.currentWord.charAt(m);
            letter.style.color = 'green';
    },
    doWeWon: function() {
        this.cntWins++;
        document.getElementById('wins').innerHTML = 'Wins: '+this.cntWins;
        var myhead = document.getElementById('instructions').style.color = 'green';
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
        var myhead = document.getElementById('instructions').style.color = 'red';
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
        var myhead = document.getElementById('instructions').innerHTML = mess;
        // var wordFig = document.getElementById('wordFig');
        var wordImg = document.getElementById('wordImg');
        wordImg.setAttribute('src', 'assets/images/'+this.currentWord+'.jpg');
        wordImg.setAttribute('alt', this.currentWord);
        // wordImg.setAttribute('class','wordImg');
        // wordFig.appendChild(wordImg);
    }
};

//start the game
myObj.startGame();

//set start button method
var myStart = document.getElementById('startButton');myStart.addEventListener('click',function(){myObj.initWord();});

//trap for keys
document.addEventListener('keyup',function(){myObj.doKey(event);});
