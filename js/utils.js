import { getPlayAgainButton, getTimerElement } from './selectors.js'

const shuffleColor = (colorList) => {
  if (!Array.isArray(colorList) || colorList.length <= 2) return
  for (let i = colorList.length - 1; i > 1; i--) {
    // random new index
    const j = Math.floor(Math.random() * i)

    let temp = colorList[i]
    colorList[i] = colorList[j]
    colorList[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']
  for (let i = 0; i < count; i++) {
    // randomColor function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]

  // shuffle fullColorList
  shuffleColor(fullColorList)

  return fullColorList
}

export const showReplayButton = () => {
  const replayBtnElement = getPlayAgainButton()
  replayBtnElement.classList.add('show')
}

export const hideRepalyButton = () => {
  const replayBtnElement = getPlayAgainButton()
  replayBtnElement.classList.remove('show')
}

export const showTimer = (text) => {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}



export const createTimer = ({ seconds, onChange, onFinish }) => {
  let intervalId = null

  const start = () => {
    clear()

    let currentSecond = seconds
    intervalId = setInterval(() => {
      //if(onChange) onChange(currentSecond)
      onChange?.(currentSecond)

      currentSecond--
      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  const clear = () => {
    clearInterval(intervalId)
  }
  return {
    start,
    clear,
  }
}
