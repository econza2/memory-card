//Notes
// 1. You Need Winning Logic To Determine When A Game Has Been Won

import { useState, useEffect } from "react";
import "./MemoryCard.css";

function ParentContainer() {
  const [hideInput, setHideInput] = useState(false);
  const [hideCards, setHideCards] = useState(true);
  const [exportMemoryNumber, setExportMemoryNumber] = useState(1);

  function CreatingCards({ cardsNumber }) {
    const [cardsArray, setCardsArray] = useState([]);
    const [cardsPlayedArray, setCardsPlayedArray] = useState([]);
    const [counter, setCounter] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showSetCards, setShowSetCards] = useState(true);
    const [isWin, setIsWin] = useState(false);

    useEffect(() => {
      if (counter > bestScore) {
        setBestScore(counter);
      }
    }, [counter, bestScore]);

    useEffect(() => {
      setBestScore(0);
    }, [cardsNumber]);

    let tempCardsNumberArray = [];

    for (let i = 0; i < cardsNumber; i++) {
      let imageBackground = "";
      let imageName = "";

      fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`, {
        mode: "cors",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          imageBackground = response["sprites"]["back_default"];
          imageName = response["name"];

          tempCardsNumberArray.push({
            name: imageName,
            id: crypto.randomUUID(),
            image: imageBackground,
          });
        });
    }

    let setCardsToDivs = function () {
      setCardsArray(tempCardsNumberArray);
      setShowSetCards(false);
    };

    let shuffleCards = function (e) {
      setShowSetCards(false);

      let currentArrangement = cardsArray;
      let shuffledArray = [];
      let shuffledArrayWithObjects = [];

      while (shuffledArray.length < cardsNumber) {
        let randomNumber = Math.floor(Math.random() * cardsNumber);
        if (shuffledArray.indexOf(randomNumber) === -1) {
          shuffledArray.push(randomNumber);
        }
      }

      for (let i = 0; i < cardsNumber; i++) {
        shuffledArrayWithObjects[i] = currentArrangement[shuffledArray[i]];
      }

      setCardsArray(shuffledArrayWithObjects);

      let currentClick = e.target.textContent;

      if (cardsPlayedArray.indexOf(currentClick) === -1) {
        setCardsPlayedArray([...cardsPlayedArray, currentClick]);

        setCounter((count) => count + 1);
      } else {
        setCardsPlayedArray([]);

        setIsGameOver(true);
      }
    };

    let handleReplay = function () {
      setIsGameOver(false);
      setCounter(0);
      setShowSetCards(false);
    };

    let handleEnterInputAgain = function () {
      setHideInput(false);
      setHideCards(true);
    };

    return (
      <>
        {isWin ? (
          <div>
            YOU WIN<button>Play Again?</button>
          </div>
        ) : isGameOver ? (
          <div className="game-over-container">
            <div className="game-over">GAME OVER</div>
            <div className="game-over-scores">
              <div>Your Score: {counter}</div>
              <div>High Score: {bestScore}</div>
            </div>
            <button onClick={handleReplay}>Replay?</button>
            <button onClick={handleEnterInputAgain}>Enter Input Again</button>
          </div>
        ) : (
          <div className="gameplay-component">
            <div className="scores">
              <div>Your Current Score: {counter}</div>
              <div>High Score: {bestScore}</div>
              <div>Number of Cards Selected: {cardsNumber}</div>
            </div>
            {showSetCards ? (
              <button className="set-playing-button" onClick={setCardsToDivs}>
                Set Playing Cards
              </button>
            ) : (
              ""
            )}
            <div className="cards-container">
              {cardsArray.length > 0 ? (
                cardsArray.map((cards) => (
                  <>
                    <div
                      className="cards"
                      key={cards.id}
                      style={{
                        backgroundImage: `url(${cards.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={shuffleCards}
                    >
                      {cards.name}
                    </div>
                  </>
                ))
              ) : (
                <div className="set-cards-instructions">
                  SET THE PLAYING CARDS TO START THE GAME
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  function InputNumber() {
    const [memoryNumber, setMemoryNumber] = useState(1);

    let handleMemoryNumberChange = function (e) {
      setMemoryNumber(e.target.value);
    };

    let handleSelectNumberOfTiles = function () {
      setHideCards(false);
      setHideInput(true);
      setExportMemoryNumber(memoryNumber);
    };

    return (
      <>
        {hideInput ? (
          ""
        ) : (
          <div className="input-component">
            <label className="input-label">
              Enter The Number Of Memory Cards To Play With
              <input
                className="input-entry"
                type="number"
                value={memoryNumber}
                onChange={handleMemoryNumberChange}
              />
            </label>
            <button
              className="select-tiles-button"
              onClick={handleSelectNumberOfTiles}
            >
              Select Number Of Tiles
            </button>
          </div>
        )}

        {hideCards ? (
          ""
        ) : (
          <>
            <CreatingCards cardsNumber={exportMemoryNumber} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <InputNumber />
    </>
  );
}

export default function MemoryCard() {
  return (
    <>
      <ParentContainer />
    </>
  );
}
