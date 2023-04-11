import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [startTime, setStartTime] = React.useState(()=>{
        let start = new Date()
        return start
        })
        
    const [time, setTime] = React.useState(0);
    const [timerOn, setTimerOn] = React.useState(false);
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setTimerOn(false)
            
            // The time record tracker part
            let end = new Date();
            let duration = end - startTime;
            console.log(`You take ${duration/1000} second`);
            let oldDuration = JSON.parse(localStorage.getItem("duration")) || 10000000000;
            if(duration < oldDuration){
                localStorage.setItem("duration", JSON.stringify(duration));
                console.log(`New time record! ${duration/1000} second`);
                alert(`New time record! ${duration/1000} second`);
            }
            // The rolls record tracker part
            let oldRollsRecrd = JSON.parse(localStorage.getItem("rolls")) || 100000;
            console.log(`You did it in ${rolls} rolls`);
            if(rolls < oldRollsRecrd){
                localStorage.setItem("rolls", JSON.stringify(rolls));
                console.log(`New rolls record! ${rolls} rolls`);
                alert(`New rolls record! ${rolls} rolls`);
            }
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(prevRolls => prevRolls+1)
            setTimerOn(true)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setTime(0)
            let start = new Date();
            setStartTime(start);
        }
    }
    
    function holdDice(id) {
        setTimerOn(true)
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    React.useEffect(() => {
        let interval = null;

        if (timerOn) {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime + 10);
        }, 10);
        } else if (!timerOn) {
        clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOn]);
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            
            <p className="timer">Timer</p>
            <div className="display">
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}

// Features could be added:
// Add the number of rolls in the screen
// notify in the screen when a new record happend
