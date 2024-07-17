<script lang="ts">
import data from "$lib/crosswordData";

type CrossWordItem = {
  direction: "across" | "down"
  position: number
  row: number
  col: number
  word: string
  clue: string
  correct: boolean
}

type CrosswordData = CrossWordItem[]

const crosswordData = data.map(d => ({ ...d, correct: false })) as CrosswordData
const gridHeight = Math.max(...crosswordData.map(d => d.direction === "down" ? d.row + d.word.length - 1 : d.row)) + 1
const gridWidth = Math.max(...crosswordData.map(d => d.direction === "across" ? d.col + d.word.length - 1 : d.col)) + 1
const answerGrid = Array.from({ length: gridHeight }, () => Array.from({ length: gridWidth }, () => ''))
const userGrid = Array.from({ length: gridHeight }, () => Array.from({ length: gridWidth }, () => ''))

data.forEach(d => {
  const { direction, row, col, word } = d
  for (let i = 0; i < word.length; i++) {
    const r = direction === "down" ? row + i : row
    const c = direction === "across" ? col + i : col
    answerGrid[r][c] = word[i].toUpperCase()
  }
})

const cellSize = 32

const currentCell = { row: data[0].row, col: data[0].col }
let currentWordIndex = 0

const checkInWord = (row: number, col: number, item: CrossWordItem) =>
  item.direction === "across" && item.row === row && item.col <= col && col < item.col + item.word.length ||
  item.direction === "down" && item.col === col && item.row <= row && row < item.row + item.word.length

const checkSwitchWord = (newRow: number, newCol: number) => {
  const words = crosswordData.filter(d => checkInWord(newRow, newCol, d))
  if (words.length === 1) currentWordIndex = crosswordData.indexOf(words[0])
  if (words.length === 2) {
    if (newRow === currentCell.row && newCol === currentCell.col) {
      if (currentWordIndex === crosswordData.indexOf(words[0]))
        currentWordIndex = crosswordData.indexOf(words[1])
      else currentWordIndex = crosswordData.indexOf(words[0])
    } else if (!words.includes(crosswordData[currentWordIndex]))
      currentWordIndex = crosswordData.indexOf(words[0])
  }
  currentCell.row = newRow
  currentCell.col = newCol
}

const onKeyDown = (e: KeyboardEvent) => {
  e.preventDefault()
  if (e.key === 'ArrowUp') {
    let newRow = currentCell.row
    while (newRow > 0) {
      newRow--
      if (answerGrid[newRow][currentCell.col]) {
        checkSwitchWord(newRow, currentCell.col)
        break
      }
    }
  } else if (e.key === 'ArrowDown') {
    let newRow = currentCell.row
    while (newRow < gridHeight - 1) {
      newRow++
      if (answerGrid[newRow][currentCell.col]) {
        checkSwitchWord(newRow, currentCell.col)
        break
      }
    }
  } else if (e.key === 'ArrowLeft') {
    let newCol = currentCell.col
    while (newCol > 0) {
      newCol--
      if (answerGrid[currentCell.row][newCol]) {
        checkSwitchWord(currentCell.row, newCol)
        break
      }
    }
  } else if (e.key === 'ArrowRight') {
    let newCol = currentCell.col
    while (newCol < gridWidth - 1) {
      newCol++
      if (answerGrid[currentCell.row][newCol]) {
        checkSwitchWord(currentCell.row, newCol)
        break
      }
    }
  } else if (e.key.length === 1 && e.key.match(/[a-z_ ]/i)) {
    userGrid[currentCell.row][currentCell.col] = e.key === ' ' ? '_' : e.key.toUpperCase()
    const currentWord = crosswordData[currentWordIndex]
    if (currentWord.direction === "across" && currentCell.col < currentWord.col + currentWord.word.length - 1) currentCell.col++
    else if (currentWord.direction === "down" && currentCell.row < currentWord.row + currentWord.word.length - 1) currentCell.row++
  } else if (e.key === 'Backspace') {
    const orig = userGrid[currentCell.row][currentCell.col]
    const currentWord = crosswordData[currentWordIndex]
    if (currentWord.direction === "across" && currentCell.col > currentWord.col && !orig) currentCell.col--
    else if (currentWord.direction === "down" && currentCell.row > currentWord.row && !orig) currentCell.row--
    userGrid[currentCell.row][currentCell.col] = ''
  } else if (e.key === 'Enter') checkSwitchWord(currentCell.row, currentCell.col)
}

const onload = (e: Element) => {
  document.addEventListener('keydown', onKeyDown)
}

const getWord = (grid: string[][], item: CrossWordItem) =>
  item.direction === "across"
    ? Array.from({ length: item.word.length }, (_, i) => grid[item.row][item.col + i]).join('')
    : Array.from({ length: item.word.length }, (_, i) => grid[item.row + i][item.col]).join('')

$: corrects = crosswordData.map(d => getWord(userGrid, d) === d.word.toUpperCase())
</script>
  
<style lang="sass">
*[role=button]
  outline: none
  box-shadow: none
</style>

<div use:onload class="h-dvh flex flex-row items-center justify-center">
  <div
    class="relative flex-grow-0 m-4"
    style:width={cellSize * gridWidth + 'px'}
    style:height={cellSize * gridHeight + 'px'}
  >
    {#each answerGrid as row, i}
      {#each row as cell, j}
        {#if cell}
          <div
            class="flex flex-start absolute items-center justify-center border border-gray-300 bg-black transition-colors"
            class:bg-sky-950={(i !== currentCell.row || j !== currentCell.col) && checkInWord(i, j, crosswordData[currentWordIndex])}
            class:bg-sky-800={i === currentCell.row && j === currentCell.col}
            style:top={i * cellSize + 'px'}
            style:left={j * cellSize + 'px'}
            style:width={cellSize + 1 + 'px'}
            style:height={cellSize + 1 + 'px'}
            role="button"
            tabindex="0"
            on:click={() => checkSwitchWord(i, j)}
            on:keydown={() => {}}
          >
            <span>{userGrid[i][j]}</span>
          </div>
        {/if}
      {/each}
    {/each}
  </div>
  <div class="flex-1 p-8">
    <div class="overflow-auto pr-4" style:height="calc(100dvh - 64px)">
      {#each crosswordData as { clue, row, col }, i}
        <div
          class="flex flex-row items-center my-4 p-4 rounded-md border-2 border-solid border-white/30 hover:bg-white/10 transition-colors"
          class:bg-gray-700={i === currentWordIndex && !corrects[i]}
          class:bg-gray-900={i !== currentWordIndex && !corrects[i]}
          class:bg-green-900={i !== currentWordIndex && corrects[i]}
          class:bg-green-700={i === currentWordIndex && corrects[i]}
          class:hover:bg-gray-600={i === currentWordIndex && !corrects[i]}
          class:hover:bg-gray-800={i !== currentWordIndex && !corrects[i]}
          class:hover:bg-green-800={i !== currentWordIndex && corrects[i]}
          class:hover:bg-green-600={i === currentWordIndex && corrects[i]}
          role="button"
          tabindex="0"
          on:click={() => {
            currentWordIndex = i
            currentCell.row = row
            currentCell.col = col
          }}
          on:keydown={() => {}}
        >
          <span>{clue}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
