const firstColumn = document.querySelectorAll('.first-column')
const secondColumn = document.querySelectorAll('.second-column')
const thirdColumn = document.querySelectorAll('.third-column')
const fourthColumn = document.querySelectorAll('.fourth-column')
const fifthColumn = document.querySelectorAll('.fifth-column')
const sixthColumn = document.querySelectorAll('.sixth-column')
const seventhColumn = document.querySelectorAll('.seventh-column')
const holes = document.querySelectorAll('.hole')
const timerCountSpan = document.querySelector('.timer-count')
const playerTurnSpan = document.querySelector('.player-turn')
const endingDialog = document.querySelector('.ending-dialog')
const whoWonSpan = document.querySelector('#who-won-span')
const scorePlayerOne = document.querySelector('.score-player-one')
const scorePlayerTwo = document.querySelector('.score-player-two')
let PLAYER_WHO_WON = null

const PLAY_MATRIX = []
const ALL_COLUMNS_ARR = [firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn, sixthColumn, seventhColumn]

let PLAYER_ONE_COLOR = 'var(--player-one-color)'
let PLAYER_TWO_COLOR = 'var(--player-two-color)'
let BACKGROUND_COLOR = 'var(--background-color)'
let CURRENT_COLOR = true
const TIMEOUT_IDS = []

let MAX_SECONDS_PER_MOVE = 1

function createRandomMatrix() {
    const randomArr = []
    for (let index = 0; index < 9; index++) {
        randomArr.push(Array.from({ length: 10 }, (el, index) => Math.random() * 10000))
    }

    return randomArr
}

PLAY_MATRIX.push(...createRandomMatrix())

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
        if (counter > 0) {
            TIMEOUT_IDS.push(setTimeout(updateTimer, 1000))
            timerCountSpan.innerText = --counter
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

function getCorrectColumn(index) {
    switch (index) {
        case 0: return firstColumn
        case 1: return secondColumn
        case 2: return thirdColumn
        case 3: return fourthColumn
        case 4: return fifthColumn
        case 5: return sixthColumn
        case 6: return seventhColumn
    }
}

async function highlightWinningCombo(rowIndexes, columnIndexes) {
    for (let i = 3; i >= 0; i--) {
        let correctColumn = getCorrectColumn(columnIndexes[i])
        correctColumn[rowIndexes[i]].style.transition = 'outline 0.2s ease-in'
        correctColumn[rowIndexes[i]].style.outline = '3px solid blue'
        await delay(250)
    }
}

function checkIfThereIsAWinner() {

    for (let i = 0; i < PLAY_MATRIX.length - 3; i++) {
        for (let j = 0; j < PLAY_MATRIX[0].length - 3; j++) {
            if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j]) {
                PLAYER_WHO_WON = PLAY_MATRIX[i][j]
                highlightWinningCombo([i, i + 1, i + 2, i + 3],
                    [j, j, j, j])
                return true
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i][j + 3]) {
                PLAYER_WHO_WON = PLAY_MATRIX[i][j]
                highlightWinningCombo([i, i, i, i],
                    [j, j + 1, j + 2, j + 3])
                return true
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j - 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j - 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j - 3]) {
                PLAYER_WHO_WON = PLAY_MATRIX[i][j]
                highlightWinningCombo([i, i + 1, i + 2, i + 3],
                    [j, j - 1, j - 2, j - 3])
                return true
            }
            else if (PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 1][j + 1]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 2][j + 2]
                && PLAY_MATRIX[i][j] === PLAY_MATRIX[i + 3][j + 3]) {
                PLAYER_WHO_WON = PLAY_MATRIX[i][j]
                highlightWinningCombo([i, i + 1, i + 2, i + 3],
                    [j, j + 1, j + 2, j + 3])
                return true
            }
        }
    }
}

async function addCircle(column, matrixIndex) {
    clearTimeoutIDs()

    for (let i = column.length - 1; i >= 0; i--) {
        if (column[i].style.backgroundColor !== PLAYER_ONE_COLOR && column[i].style.backgroundColor !== PLAYER_TWO_COLOR) {
            column[i].style.backgroundColor = CURRENT_COLOR ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR
            column[i].style.outline = '1px solid black'
            column[i].style.borderTop = '2px solid rgba(0, 0, 0, 0.5)'
            column[i].firstElementChild.style.backgroundColor = CURRENT_COLOR ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR

            playerTurnSpan.innerText = CURRENT_COLOR ? 'PLAYER 2' : 'PLAYER 1'

            if (i === 0) {
                ALL_COLUMNS_ARR.splice(ALL_COLUMNS_ARR.indexOf(column), 1)
            }


            PLAY_MATRIX[i][matrixIndex] = CURRENT_COLOR ? true : false
            console.log(PLAY_MATRIX)


            CURRENT_COLOR = !CURRENT_COLOR
            break;
        }
    }

    if (checkIfThereIsAWinner()) {

        addOrRemovePointerEvents(holes, true)
        whoWonSpan.innerText = PLAYER_WHO_WON ? "RED" : "YELLOW"
        whoWonSpan.style.color = PLAYER_WHO_WON ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR
        whoWonSpan.style.fontSize = '20px'

        if (PLAYER_WHO_WON) scorePlayerOne.textContent++
        else scorePlayerTwo.textContent++

        await delay(1500)

        endingDialog.classList.remove('animate-margin-up')
        endingDialog.showModal()
        endingDialog.classList.add('animate-margin-down')
    } else startTimer()
}

holes.forEach(hole => {
    hole.addEventListener('click', (e) => {
        let column = ''
        let holeClicked = e.target

        if (holeClicked.classList.contains('inside-the-hole')) {
            holeClicked = e.target.parentElement
        }

        if (holeClicked.classList.contains('first-column')) {
            column = firstColumn
            index = 0
        }
        else if (holeClicked.classList.contains('second-column')) {
            column = secondColumn
            index = 1
        }
        else if (holeClicked.classList.contains('third-column')) {
            column = thirdColumn
            index = 2
        }
        else if (holeClicked.classList.contains('fourth-column')) {
            column = fourthColumn
            index = 3
        }
        else if (holeClicked.classList.contains('fifth-column')) {
            column = fifthColumn
            index = 4
        }
        else if (holeClicked.classList.contains('sixth-column')) {
            column = sixthColumn
            index = 5
        }
        else if (holeClicked.classList.contains('seventh-column')) {
            column = seventhColumn
            index = 6
        }

        addCircle(column, index)
    })
})

function addOrRemovePointerEvents(elements, choice) {
    elements.forEach(el => {
        el.style.pointerEvents = choice ? 'none' : 'auto'
    })
}

async function resetPlayingField() {
    addOrRemovePointerEvents(holes, false)
    endingDialog.classList.remove('animate-margin-down')
    endingDialog.classList.add('animate-margin-up')
    await delay(500)
    endingDialog.close()
    holes.forEach(hole => {
        hole.firstElementChild.style.backgroundColor = BACKGROUND_COLOR
        hole.style.backgroundColor = 'black'
        hole.style.outline = '0'
        hole.style.borderTop = '0'
    })
    PLAY_MATRIX.length = 0
    PLAY_MATRIX.push(...createRandomMatrix())
}

playAgainButton = document.querySelector('#play-again-button')
playAgainButton.addEventListener('click', resetPlayingField)