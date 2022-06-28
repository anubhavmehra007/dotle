import React from 'react';
import './App.css';
import Row from './Row';
import wordList from './wordList';
import Header from './Header';
import Keyboard from './Keyboard';
function App() {
  let puzzleNumber;
  const wordGen = () => {
      const today = new Date();
      const wordlist = wordList();
      today.setHours(0,0,0);
      const epoch = new Date("June 19 2021");
      epoch.setHours(0,0,0);
      const seed = Math.round((today - epoch)/864e5);
      puzzleNumber = seed - 373;
      return wordlist[seed % wordlist.length];
  };
  const word = wordGen();
  const noOfTry = word.length;
  const elements = [];
  let divNum = 0;
  let rowNum = 0;
  let bannerText = "";
  let virtInput;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const [banners, setBanners] = React.useState([]);
  const [bannerData, setBannerData] = React.useState(`Dotle puzzle: #${puzzleNumber}`);
  const [over, setOver] = React.useState(false);
  

  async function checkRow(rowNum)
  {
    let correct = 0;
    const corr = [];
    const wrong =[]
    const maybe = [];
    const input = [];
    for(let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      const text = dom.textContent.toLowerCase();
      if(text === word[i])
      {
        correct += 1;
        corr.push(i);
      }
      else if(text !== word[i] && word.search(text) !== -1)
      {
        maybe.push(i);
      }
      else {
        wrong.push(i);
      }
      input.push(text);
    }
    const inputWord = input.join("");
    let answerLocal = []
    for(let i = 0 ; i < word.length; i++) {
      if(corr.includes(i) === false) {
          answerLocal.push(word[i]);
      }
    }
    const maybeTrue = []
    console.log(answerLocal);
    console.log(maybe);
    for(let i = 0; i < maybe.length; i++) {
      if(answerLocal.includes(inputWord[maybe[i]]) === true) {
        maybeTrue.push(maybe[i]);
        const index = answerLocal.indexOf(inputWord[maybe[i]]);

        answerLocal.splice(index, 1);
        console.log(answerLocal);
      }
    }
    for(let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      if(corr.includes(i))
      {
        dom.style.animation = "correct 1s forwards";
        bannerText += "🟩 ";
      }
      else if(maybeTrue.includes(i)) {
        dom.style.animation = "maybe 1s forwards";
        bannerText += "🟨 ";
      }
      else {
        dom.style.animation = "wrong 1s forwards";
        const virtDom = document.getElementById(input[i]);
        virtDom.style.backgroundColor = "#3a3a3c";
        virtDom.style.Color = "white";
        bannerText += "⬜ ";
      }
     await sleep(1000) ;
      }
      bannerText += "\n";
    return correct;
  }
  function createBanner() {
    setOver(true);
    const banner = document.getElementById("banner");
    const bannerLines = bannerText.split("\n");
    const bannersLocal = bannerLines.map(item => (
    <p key="key-paragraph">{item}</p>
    ));
    banner.style.display = "flex";
    banner.style.flexDirection = "column";
    banner.style.alignItems = "center";
    setBanners(bannersLocal);
    setBannerData(prevText => {return (prevText + "\n" + bannerText);});
    console.log(bannerData);

  }
   async function winner(rowNum) {
    for(let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      dom.style.animation = "win 0.25s linear forwards";
      await sleep(100) ;
      }
  }
  const processKey = async (key) => {
    if(key === "Enter" || key === "ENT") {
      if(divNum === word.length) {
      const correct = await checkRow(rowNum);
      if(correct === word.length) {
        await winner(rowNum);
        createBanner();
      }
      if(rowNum === noOfTry- 1) {
        createBanner();
      }
      else {
      rowNum++;
      divNum=0;
      }
    }
    }
    else if(key === "Backspace"  || key === "BCK") {
        const dom = document.getElementById(`row-${rowNum}-input-${divNum-1}`);
        dom.textContent = "";
        if(divNum > 0) {
            divNum--;
        }
    }
    else {
      if(key.length > 1) {
        console.log("invalid key ignoring");
      }
      else {
      if(divNum <= word.length - 1)
      {
        const dom = document.getElementById(`row-${rowNum}-input-${divNum}`);
        dom.textContent = key.toUpperCase();
      }
      if(divNum <= word.length - 1)
      {
      divNum++;
      }
    }
  }
  }
  const keyDown =   async function (event) {
   await processKey(event.key) ;
    
  }
  for(let i = 0; i < noOfTry; i++){
    elements.push(
      (<Row  key={`row-${i}`} answer={word} rowNum = {i} />)
    )
  }
  async function copyScore() {
    navigator.clipboard.writeText(bannerData);
    const dom = document.getElementById("copyScore");
    dom.style.animation = "clicked-score 0.125s";
    await sleep(125);
    dom.style.animation = "none";
  }
  const virtInputDo = async function (key) {
    const dom = document.getElementById(key);
    dom.style.animation ="clicked 0.125s";
    await sleep(125);
    await processKey(key);
  }
  console.log(over);
  if(over) {
    document.onkeydown = () => {};
    virtInput = null;
  }
  else {
    document.onkeydown = keyDown;
    virtInput = virtInputDo;
  }
  return (
    <div className="container">
      <Header />
      <div className='banner' id='banner'>
        <button id="bannerClose" onClick={() =>{
          const dom = document.getElementById("banner");
          dom.style.display = "none";
        }} className="closeButton">X</button>
        <div id="banner-data">
          <p>Dotle puzzle : #{puzzleNumber}</p> <br />
      {banners}
      </div>
      <button className="copyScore" id="copyScore" onClick={copyScore}>Copy Score</button>
      </div>
      <div className="maincontent" >
      {elements}<br />
      </div>
      <Keyboard virtInput={virtInput}/>
    </div>
  );

}

export default App;
