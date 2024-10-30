import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hideRepalyButton,
  showReplayButton,
  showTimer,
} from './utils.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  //show time text
  const fullSecond = `0${second}s`.slice(-3)
  showTimer(fullSecond)
}

function handleTimerFinish() {
  //end game
  //show text TRY AGAIN
  showTimer('TRY AGAIN')
  //set status game is finished
  gameState = GAME_STATUS.FINISHED
  //show replay button
  showReplayButton()
}
// const handleTimerChange = (second) => {
//   console.log('change', second)
// }
// const handleTimerFinish = () => {
//   console.log('finished')
// }

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

//Generating colors
const initColors = () => {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  // bind to li > div.overlay
  const colorElementList = getColorElementList()
  colorElementList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('div.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

// handle click
const handleClickCell = (liElement) => {
  const blockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameState)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || blockClick || isClicked) return

  //show color
  liElement.classList.add('active')

  //save clicked cell selection
  selections.push(liElement)

  if (selections.length < 2) {
    // setTimeout(() => {
    //   selections[0].classList.remove('active')
    //   selections = []
    // }, 1000)
    return
  }

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  //if the colors match
  if (isMatch) {
    //change background color when match
    const colorMatch = selections[0].dataset.color
    const backgroundElement = getColorBackground()
    if (backgroundElement) {
      backgroundElement.style.backgroundColor = colorMatch
    }

    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      // show replay button
      showReplayButton()
      // show status YOU WIN
      showTimer('YOU WIN')
      // stop countdown when win
      timer.clear()
      // update game status
      gameState = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }

  //not allow to click third cell
  gameState = GAME_STATUS.BLOCKING

  //in case of not match
  //hide color for 2 cells
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    //reset selection for next turn
    selections = []

    if (gameState !== GAME_STATUS.FINISHED) gameState = GAME_STATUS.PLAYING
  }, 1000)
}

const initBindClickCell = () => {
  const ulElement = getColorListElement()
  console.log(ulElement)
  if (ulElement) {
    ulElement.addEventListener('click', (event) => {
      if (event.target.tagName !== 'LI') return
      handleClickCell(event.target)
    })
  }
}

// handle click replay button
const handleClickReplayBtn = () => {
  // reset global variables
  gameState = GAME_STATUS.PLAYING
  selections = []

  // update dom
  //hide replay
  hideRepalyButton()
  //hide timer text
  showTimer('')
  //hide color for all cells
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) colorElement.classList.remove('active')

  // re-generate colors
  initColors()

  //start new game
  initTimer()

  //reset background color
  const backgroundElement = getColorBackground()
  if (backgroundElement) backgroundElement.style.backgroundColor = ''
}

//init event click replay button
const initClickReplayButton = () => {
  const replayBtnElement = getPlayAgainButton()
  replayBtnElement.addEventListener('click', () => {
    handleClickReplayBtn()
  })
}

const initTimer = () => {
  timer.start()
}

// MAIN
;(() => {
  console.log(getRandomColorPairs(PAIRS_COUNT))
  initColors()
  initBindClickCell()
  initClickReplayButton()
  initTimer()
})()
