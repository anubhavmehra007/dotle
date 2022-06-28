import React from 'react';
import './App.css';
import Row from './Row';
import wordList from './wordList';
import Header from './Header';
import Keyboard from './Keyboard';
function App() {
  const wordGen = () => {
      const today = new Date();
      const wordlist = wordList();
      today.setHours(0,0,0);
      const epoch = new Date("June 19 2021");
      epoch.setHours(0,0,0);
      const seed = Math.round((today - epoch)/864e5);
      console.log(today);
      console.log(epoch);
      console.log(seed);
      console.log(seed % wordlist.length);
      return wordlist[seed % wordlist.length];
  };
  const word = wordGen();
  const noOfTry = word.length;
  const elements = [];
  let divNum = 0;
  let bannerText = "";
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const [banners, setBanners] = React.useState([]);
  const [bannerData, setBannerData] = React.useState("");

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
    const banner = document.getElementById("banner");
    const bannerLines = bannerText.split("\n");
    const bannersLocal = bannerLines.map(item => (
    <p key="key-paragraph">{item}</p>
    ));
    banner.style.display = "flex";
    banner.style.flexDirection = "column";
    banner.style.alignItems = "center";
    setBanners(bannersLocal);
    setBannerData(bannerText);

  }
   async function winner(rowNum) {
    for(let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      dom.style.animation = "win 0.25s linear forwards";
      await sleep(100) ;
      }
  }
  let rowNum = 0;
  document.onkeydown =  async function (event) {
    if(event.key === "Enter") {
      if(divNum === word.length) {
      const correct = await checkRow(rowNum);
      if(correct === word.length) {
        document.onkeydown = null; 
        await winner(rowNum);
        createBanner();
      }
      if(rowNum === noOfTry- 1) {
        document.onkeydown = null;
        createBanner();
      }
      else {
      rowNum++;
      divNum=0;
      }
    }
    }
    else if(event.key === "Backspace") {
        const dom = document.getElementById(`row-${rowNum}-input-${divNum-1}`);
        dom.textContent = "";
        if(divNum > 0) {
            divNum--;
        }
    }
    else {
      if(event.key.length > 1) {
        console.log("invalid key ignoring");
      }
      else {
      if(divNum <= word.length - 1)
      {
        const dom = document.getElementById(`row-${rowNum}-input-${divNum}`);
        dom.textContent = event.key.toUpperCase();
      }
      if(divNum <= word.length - 1)
      {
      divNum++;
      }
    }
  }
    
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
  async function virtInput(key) {
    const dom = document.getElementById(key);
    dom.style.animation ="clicked 0.125s";
    await sleep(125);
    dom.style.animation = "none";
    if(key === "ENT") {

      if(divNum === word.length) {
      const correct = await checkRow(rowNum);
      if(correct === word.length) {
        document.onkeydown = null; 
        await winner(rowNum);
        createBanner();
      }
      if(rowNum === noOfTry- 1) {
        document.onkeydown = null;
        createBanner();
      }
      else {
      rowNum++;
      divNum=0;
      }
    }
    }
    else if(key === "BCK") {
        const dom = document.getElementById(`row-${rowNum}-input-${divNum-1}`);
        dom.textContent = "";
        if(divNum > 0) {
            divNum--;
        }
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
  return (
    <div className="container">
      <Header />
      <div className='banner' id='banner'>
        <button id="bannerClose" onClick={() =>{
          const dom = document.getElementById("banner");
          dom.style.display = "none";
        }} className="closeButton">X</button>
        <div id="banner-data">
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
