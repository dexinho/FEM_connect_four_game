// connect four script

const firstColumn = document.querySelectorAll('.first-column')
const secondColumn = document.querySelectorAll('.second-column')
const thirdColumn = document.querySelectorAll('.third-column')
const fourthColumn = document.querySelectorAll('.fourth-column')
const fifthColumn = document.querySelectorAll('.fifth-column')
const sixthColumn = document.querySelectorAll('.sixth-column')
const seventhColumn = document.querySelectorAll('.seventh-column')
const ALL_COLUMNS_ARR = [firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn, sixthColumn, seventhColumn]
const insideTheHole = document.querySelectorAll('.inside-the-hole')
const timerCountSpan = document.querySelector('.timer-count')
const playerTurnSpan = document.querySelector('.player-turn')

let PLAYER_ONE_COLOR = 'indianred'
let PLAYER_TWO_COLOR = 'yellow'
let CURRENT_COLOR = true
let MAX_SECONDS_PER_MOVE = 1
const TIMEOUT_IDS = []


function delay(ms) {
    return new Promise(res => {
        let id = setTimeout(() => {
            res()
        }, ms);
        TIMEOUT_IDS.push(id)
    })
}


function startTimer() {
    let counter = MAX_SECONDS_PER_MOVE
    
    function updateTimer(){
        if (counter >= 0) {
            timerCountSpan.innerText = counter
            counter--
            TIMEOUT_IDS.push(setTimeout(updateTimer, 1000))
        }
        else if (ALL_COLUMNS_ARR.length > 0){
            addCircle(ALL_COLUMNS_ARR.at(Math.floor(Math.random() * ALL_COLUMNS_ARR.length)))
        }
    }
   updateTimer()
}

function clearTimeoutIDs(){
    for (const id of TIMEOUT_IDS) clearTimeout(id)
    TIMEOUT_IDS.length = 0
}

async function addCircle(column) {
    clearTimeoutIDs()
    
    for (let i = column.length - 1; i >= 0; i--) {
        if (column[i].style.backgroundColor !== PLAYER_ONE_COLOR && column[i].style.backgroundColor !== PLAYER_TWO_COLOR) {
            column[i].style.backgroundColor = CURRENT_COLOR ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR
            playerTurnSpan.innerText = CURRENT_COLOR ? 'PLAYER 2' : 'PLAYER 1'
            if (i === 0) {
                ALL_COLUMNS_ARR.splice(ALL_COLUMNS_ARR.indexOf(column), 1)
            }

            CURRENT_COLOR = !CURRENT_COLOR
            break;
        }
    }
    startTimer() 
}

insideTheHole.forEach(hole => {
    hole.addEventListener('click', (e) => {
        let column = ''

        if (e.target.classList.contains('first-column')) column = firstColumn
        else if (e.target.classList.contains('second-column')) column = secondColumn
        else if (e.target.classList.contains('third-column')) column = thirdColumn
        else if (e.target.classList.contains('fourth-column')) column = fourthColumn
        else if (e.target.classList.contains('fifth-column')) column = fifthColumn
        else if (e.target.classList.contains('sixth-column')) column = sixthColumn
        else if (e.target.classList.contains('seventh-column')) column = seventhColumn

        addCircle(column)
    })
})

