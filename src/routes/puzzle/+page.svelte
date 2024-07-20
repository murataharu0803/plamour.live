<script lang="ts" setup>
import { fetchData } from "$lib";
import { tick } from "svelte";

type CrossWordItem = {
  direction: "across" | "down"
  position: number
  row: number
  col: number
  word: string
  clue: string
}

type CrosswordData = CrossWordItem[]

let ready = false
let crosswordData: CrosswordData = []
let gridHeight: number = 0
let gridWidth: number = 0
let answerGrid: string[][] = []
let userGrid: string[][] = []

const cellSize = 24

const currentCell = { row: 0, col: 0 }
let currentWordIndex = 0

let clueElements: (Element | null)[] = []

const init = async() => {
  crosswordData = await fetchData('CROSSWORD')

  gridHeight = Math.max(...crosswordData.map(d => d.direction === "down" ? d.row + d.word.length - 1 : d.row)) + 1
  gridWidth = Math.max(...crosswordData.map(d => d.direction === "across" ? d.col + d.word.length - 1 : d.col)) + 1
  answerGrid = Array.from({ length: gridHeight }, () => Array.from({ length: gridWidth }, () => ''))
  userGrid = Array.from({ length: gridHeight }, () => Array.from({ length: gridWidth }, () => ''))

  crosswordData.forEach(d => {
    const { direction, row, col, word } = d
    for (let i = 0; i < word.length; i++) {
      const r = direction === "down" ? row + i : row
      const c = direction === "across" ? col + i : col
      answerGrid[r][c] = word[i].toUpperCase()
      userGrid[r][c] = word[i].toUpperCase() // temp
    }
  })

  currentCell.row = crosswordData[0].row
  currentCell.col = crosswordData[0].col

  clueElements = Array.from({ length: crosswordData.length }, () => null)

  document.addEventListener('keydown', onKeyDown)
}

const onload = (e: Element) => {
  if (!ready) {
    init()
    ready = true
  }
}

const checkInWord = (row: number, col: number, item: CrossWordItem) =>
  item.direction === "across" && item.row === row && item.col <= col && col < item.col + item.word.length ||
  item.direction === "down" && item.col === col && item.row <= row && row < item.row + item.word.length

const checkSwitchWord = (newRow: number, newCol: number) => {
  const oldIndex = currentWordIndex
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
  if (currentWordIndex !== oldIndex && clueElements[currentWordIndex])
    clueElements[currentWordIndex]?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
}

const onKeyDown = async(e: KeyboardEvent) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return
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
    await tick()
    if (allCorrect) setTimeout(win, 10)
  } else if (e.key === 'Backspace') {
    const orig = userGrid[currentCell.row][currentCell.col]
    const currentWord = crosswordData[currentWordIndex]
    if (currentWord.direction === "across" && currentCell.col > currentWord.col && !orig) currentCell.col--
    else if (currentWord.direction === "down" && currentCell.row > currentWord.row && !orig) currentCell.row--
    userGrid[currentCell.row][currentCell.col] = ''
  } else if (e.key === 'Enter') checkSwitchWord(currentCell.row, currentCell.col)
}

const getWord = (grid: string[][], item: CrossWordItem) =>
  item.direction === "across"
    ? Array.from({ length: item.word.length }, (_, i) => grid[item.row][item.col + i]).join('')
    : Array.from({ length: item.word.length }, (_, i) => grid[item.row + i][item.col]).join('')

const win = () => {
  alert('恭喜！你完成了文字遊戲！\n正在準備你的半週年禮物...\n準備完成！按下確認以接受禮物！')
  window.location.href = '/?key=plamour-half-anniversary'
}

$: corrects = crosswordData.map(d => getWord(userGrid, d) === d.word.toUpperCase())
$: allCorrect = corrects.every(c => c)
</script>
  
<style lang="sass">
*[role=button]
  outline: none
  box-shadow: none
</style>

<div use:onload class="h-dvh flex flex-row items-center justify-center">
  <div
    class="relative flex-grow-0 m-8"
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
  <div class="flex-1 p-8 pl-0">
    <div class="overflow-auto pr-3" style:height="calc(100dvh - 64px)">
      {#each crosswordData as { clue, row, col }, i}
        <div
          bind:this={clueElements[i]}
          class="flex flex-row items-center my-4 p-4 rounded-md border-2 border-solid border-white/30 transition-colors first:mt-0 last:mb-0"
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
