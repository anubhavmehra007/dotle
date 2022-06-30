import React from 'react';
import './App.css';
import Row from './Row';
import wordList from './WordList';
import Header from './Header';
import Keyboard from './Keyboard';

function App() {
  let puzzleNumber;
  let defaultState = {
    board: [],
    word: "",
    rowNum: 0,
    bannerData: "",
    date: new Date(),
    over: false,
    puzzleNumber: -1
  };
  defaultState.date.setHours(0, 0, 0);
  let state = {};
  const wordlist = wordList();
  let renderFromState = false;
  const setAlert = async function (message) {
    const dom = document.getElementById("alert");
    dom.textContent = message;
    dom.style.animation = "alert-notice 1s";
    await sleep(500);
    dom.style.animation = "none";

  }
  function renderFromStorage() {
    for (let row of state.board) {
      let rowNum = row.rowNum;
      for (let div of row.divs) {
        let divNum = div.divNum;
        let char = div.data;
        const tile = document.getElementById(`row-${rowNum}-input-${divNum}`);
        const key = document.getElementById(char);
        if (div.state === "correct") {
          tile.style.backgroundColor = "green";
        }
        else if (div.state === "maybe") {
          tile.style.backgroundColor = "#d3b703";
        }
        else if (div.state === "wrong") {
          key.style.backgroundColor = "#3a3a3c";
        }
        else { }
        tile.textContent = char.toUpperCase();
      }
      if (state.over) { createBanner(); }
    }
  }
  if (localStorage.state) {
    state = JSON.parse(localStorage.state);
    const today = new Date();
    const todayState = new Date(state.date);
    today.setHours(0, 0, 0);
    if (today.toDateString() === todayState.toDateString()) {
      renderFromState = true;

    }
    else {
      state = defaultState;
    }
  }
  else {
    state = defaultState;
  }
  const wordGen = () => {
    const today = new Date();
    today.setHours(0, 0, 0);
    const epoch = new Date("June 19 2021");
    epoch.setHours(0, 0, 0);
    const seed = Math.round((today - epoch) / 864e5);
    if (state.puzzleNumber === -1) {
      puzzleNumber = seed - 373;
      state.puzzleNumber = puzzleNumber;
    }
    return wordlist[seed % wordlist.length];
  };
  let word;
  if (state.word === "") {
    word = wordGen();
    state.word = word;
  }
  else {
    word = state.word;
    puzzleNumber = state.puzzleNumber;
  }
  const noOfTry = word.length;
  const elements = [];
  let divNum = 0;
  let rowNum = state.rowNum;
  let bannerText = state.bannerData;
  let virtInput;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const [banners, setBanners] = React.useState([]);
  const [bannerData, setBannerData] = React.useState(`Dotle puzzle: #${puzzleNumber}`);
  const [over, setOver] = React.useState(false);


  let row = {
    rowNum: 0,
    divs: []
  };
  async function checkRow(rowNum) {
    let correct = 0;
    const corr = [];
    const wrong = []
    const maybe = [];
    const input = [];
    for (let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      const text = dom.textContent.toLowerCase();
      if (text === word[i]) {
        correct += 1;
        corr.push(i);
      }
      else if (text !== word[i] && word.search(text) !== -1) {
        maybe.push(i);
      }
      else {
        wrong.push(i);
      }
      input.push(text);
    }
    const inputWord = input.join("");
    if (wordlist.indexOf(inputWord) === -1) { return -1; }
    let answerLocal = []
    for (let i = 0; i < word.length; i++) {
      if (corr.includes(i) === false) {
        answerLocal.push(word[i]);
      }
    }
    const maybeTrue = []
    for (let i = 0; i < maybe.length; i++) {
      if (answerLocal.includes(inputWord[maybe[i]]) === true) {
        maybeTrue.push(maybe[i]);
        const index = answerLocal.indexOf(inputWord[maybe[i]]);

        answerLocal.splice(index, 1);
      }
    }
    row.rowNum = rowNum;
    row.divs = [];
    for (let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      let div;
      if (corr.includes(i)) {
        dom.style.animation = "correct 1s forwards";
        div = {
          divNum: i,
          state: "correct",
          data: input[i]
        }

        bannerText += "🟩 ";
      }
      else if (maybeTrue.includes(i)) {
        dom.style.animation = "maybe 1s forwards";
        bannerText += "🟨 ";
        div = {
          divNum: i,
          state: "maybe",
          data: input[i]
        }
      }
      else {
        dom.style.animation = "wrong 1s forwards";
        const virtDom = document.getElementById(input[i]);
        virtDom.style.backgroundColor = "#3a3a3c";
        virtDom.style.Color = "white";
        bannerText += "⬜ ";
        div = {
          divNum: i,
          state: "wrong",
          data: input[i]
        }
      }
      row.divs.push(div);
      await sleep(1000);
    }
    bannerText += "\n";
    state.bannerData = bannerText;
    return correct;
  }
  function createBanner() {
    setOver(true);
    state.over = true;
    const banner = document.getElementById("banner");
    const bannerLines = bannerText.split("\n");
    const bannersLocal = bannerLines.map(item => (
      <p key={`para-${bannerLines.indexOf(item)}`}>{item}</p>
    ));
    banner.style.display = "flex";
    banner.style.flexDirection = "column";
    banner.style.alignItems = "center";
    setBanners(bannersLocal);
    setBannerData(prevText => { return (prevText + "\n" + bannerText); });

  }
  async function winner(rowNum) {
    for (let i = 0; i < word.length; i++) {
      const dom = document.getElementById(`row-${rowNum}-input-${i}`);
      dom.style.animation = "win 0.25s linear forwards";
      await sleep(100);
    }
  }
  const processKey = async (key) => {
    if (key === "Enter" || key === "ENT") {
      if (divNum === word.length) {
        const correct = await checkRow(rowNum);
        if (correct === -1) {
          await setAlert("Not in List");
          return;
        }
        if (correct === word.length) {
          await winner(rowNum);
          createBanner();
        }
        if (rowNum === noOfTry - 1) {
          await setAlert(word);
          createBanner();
        }
        else {
          rowNum++;
          divNum = 0;
          console.log(row);
          state.board.push({ ...row });
          state.rowNum = rowNum;
        }
        localStorage.setItem("state", JSON.stringify(state));
      }
    }
    else if (key === "Backspace" || key === "BCK") {
      const dom = document.getElementById(`row-${rowNum}-input-${divNum - 1}`);
      dom.textContent = "";
      if (divNum > 0) {
        divNum--;
      }
    }
    else {
      if (key.length > 1) {
        console.log("invalid key ignoring");
      }
      else {
        if (divNum <= word.length - 1) {
          const dom = document.getElementById(`row-${rowNum}-input-${divNum}`);
          dom.textContent = key.toUpperCase();
        }
        if (divNum <= word.length - 1) {
          divNum++;
        }
      }
    }
  }
  const keyDown = async function (event) {
    await processKey(event.key);

  }
  for (let i = 0; i < noOfTry; i++) {
    elements.push(
      (<Row key={`row-${i}`} answer={word} rowNum={i} />)
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
    dom.style.animation = "clicked 0.125s";
    await sleep(125);
    dom.style.animation = "none";
    await processKey(key);
  }
  if (over) {
    document.onkeydown = () => { };
    virtInput = null;
  }
  else {
    document.onkeydown = keyDown;
    virtInput = virtInputDo;
  }
  return (
    <div className="container" onLoad={() => { if (renderFromState) { renderFromStorage(); } }}>
      <Header />
      <div className="alert" id="alert" ></div>
      <div className='banner' id='banner'>
        <button id="bannerClose" onClick={() => {
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
      <Keyboard virtInput={virtInput} />
    </div>
  );

}

export default App;
