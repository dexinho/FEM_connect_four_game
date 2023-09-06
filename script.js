const firstColumn = document.querySelectorAll('.first-column')
const secondColumn = document.querySelectorAll('.second-column')
const thirdColumn = document.querySelectorAll('.third-column')
const fourthColumn = document.querySelectorAll('.fourth-column')
const fifthColumn = document.querySelectorAll('.fifth-column')
const sixthColumn = document.querySelectorAll('.sixth-column')
const seventhColumn = document.querySelectorAll('.seventh-column')
const insideTheHole = document.querySelectorAll('.inside-the-hole')
const timerCountSpan = document.querySelector('.timer-count')
const playerTurnSpan = document.querySelector('.player-turn')

const PLAY_MATRIX = []
const ALL_COLUMNS_ARR = [firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn, sixthColumn, seventhColumn]

let PLAYER_ONE_COLOR = 'indianred'
let PLAYER_TWO_COLOR = 'yellow'
let CURRENT_COLOR = true
const TIMEOUT_IDS = []

let MAX_SECONDS_PER_MOVE = 10

function createMatrix() {
    const randomArr = []
    for (let index = 0; index < 9; index++) {
        randomArr.push(Array.from({ length: 10 }, (el, index) => Math.random() * 1000))
    }

    return randomArr
}

PLAY_MATRIX.push(...createMatrix())

console.log(PLAY_MATRIX)

const ALL_COLUMNS_OBJ = {
    'first-column': '0',
    'second-column': '1',
    'third-column': '2',
    'fourth-column': '3',
    'fifth-column': '4',
    'sixth-column': '5',
    'seventh-column': '6',
}


function delay(ms) {
    return new Promise(res => {
        TIMEOUT_IDS.push(setTimeout(res, ms))
    })
}

function startTimer() {
    let counter = MAX_SECONDS_PER_MOVE
    function updateTimer() {
        if (counter >= 0) {
            TIMEOUT_IDS.push(setTimeout(updateTimer, 1000))
            timerCountSpan.innerText = counter--
        }
        else if (ALL_COLUMNS_ARR.length > 0) {
            let randomIndex = Math.floor(Math.random() * ALL_COLUMNS_ARR.length)
            addCircle(ALL_COLUMNS_ARR.at(randomIndex), ALL_COLUMNS_OBJ[ALL_COLUMNS_ARR.at(randomIndex)[0].classList[1]])
        }
    }
    updateTimer()
}

function clearTimeoutIDs() {
    for (const id of TIMEOUT_IDS) clearTimeout(id)
    TIMEOUT_IDS.length = 0
}

function checkIfThereIsAWinner() {
    let playerWhoWon = null
    let wonAtRow = null

    outerLoop: for (let i = 0; i < PLAY_MATRIX.length - 3; i++) {
        for (let j = 0; j < PLAY_MATRIX[0].length - 3; j++) {
            if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j]) {
                playerWhoWon = PLAY_MATRIX[i][j]
                break outerLoop
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 3]) {
                playerWhoWon = PLAY_MATRIX[i][j]
                break outerLoop
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j - 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j - 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j - 3]) {
                playerWhoWon = PLAY_MATRIX[i][j]
                break outerLoop
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j + 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j + 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j + 3]) {
                playerWhoWon = PLAY_MATRIX[i][j]
                break outerLoop
            }
        }
    }

    console.log('player who won: ', playerWhoWon)
}

// setTimeout(checkIfThereIsAWinner, 12000);

function addCircle(column, matrixIndex) {
    clearTimeoutIDs()

    for (let i = column.length - 1; i >= 0; i--) {
        if (column[i].style.backgroundColor !== PLAYER_ONE_COLOR && column[i].style.backgroundColor !== PLAYER_TWO_COLOR) {
            column[i].style.backgroundColor = CURRENT_COLOR ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR
            column[i].parentElement.style.backgroundColor = CURRENT_COLOR ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR
            column[i].parentElement.style.outline = '1px solid black'
            column[i].parentElement.style.borderTop = '2px solid rgba(0, 0, 0, 0.5)'

            playerTurnSpan.innerText = CURRENT_COLOR ? 'PLAYER 2' : 'PLAYER 1'

            if (i === 0) {
                ALL_COLUMNS_ARR.splice(ALL_COLUMNS_ARR.indexOf(column), 1)
            }

            
            PLAY_MATRIX[i][matrixIndex] = CURRENT_COLOR ? 'red' : 'yellow'
            console.log(PLAY_MATRIX)
            checkIfThereIsAWinner()

            CURRENT_COLOR = !CURRENT_COLOR
            break;
        }
    }

    startTimer()
}

insideTheHole.forEach(hole => {
    hole.addEventListener('click', (e) => {
        let column = ''

        if (e.target.classList.contains('first-column')) {
            column = firstColumn
            index = 0
        }
        else if (e.target.classList.contains('second-column')) {
            column = secondColumn
            index = 1
        }
        else if (e.target.classList.contains('third-column')) {
            column = thirdColumn
            index = 2
        }
        else if (e.target.classList.contains('fourth-column')) {
            column = fourthColumn
            index = 3
        }
        else if (e.target.classList.contains('fifth-column')) {
            column = fifthColumn
            index = 4
        }
        else if (e.target.classList.contains('sixth-column')) {
            column = sixthColumn
            index = 5
        }
        else if (e.target.classList.contains('seventh-column')) {
            column = seventhColumn
            index = 6
        }

        addCircle(column, index)
    })
})

