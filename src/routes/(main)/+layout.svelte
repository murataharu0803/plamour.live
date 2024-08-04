<script lang="ts">
    
let currentPage = ''
let loaded = false
let isKeyCorrect = false
let scorllY = 0
let showEgg = false

const tabs = [
  { name: '半週年', href: '/' },
  { name: '里程碑', href: '/timeline' },
  { name: '二創合輯', href: '/fanart' },
  { name: '直播紀錄', href: '/archieve' },
  { name: '剪輯烤肉', href: '/clip' },
  { name: '音樂 Cover', href: '/music' },
]

const onload = (e: Element) => {
  currentPage = window.location.pathname
  isKeyCorrect = new URLSearchParams(window.location.search).get('key') === 'plamour-half-anniversary'
  loaded = true
  window.addEventListener('scroll', () => {
    scorllY = window.scrollY
  })
}
</script>

<svelte:head>
  <title>狗狗羊羊大冒險 - 帕露梅爾半周年粉絲慶典</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="狗狗羊羊大冒險" />
  <meta property="og:description" content="帕露梅爾半周年粉絲慶典" />
  <meta property="og:image" content="https://plamour.club/images/og-fb.jpg" />
  <meta property="og:url" content="https://plamour.club" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@plamourlive" />
  <meta name="twitter:title" content="狗狗羊羊大冒險" />
  <meta name="twitter:description" content="帕露梅爾半周年粉絲慶典" />
  <meta name="twitter:image" content="https://plamour.club/images/og-x.jpg" />
</svelte:head>

<div
  class="pt-4 bg-center bg-cover bg-fixed relative"
  style:background-image={isKeyCorrect ? "url('/images/wallpaper.webp')" : "none"}
  use:onload
>
  {#if !loaded}
    <div class="min-h-48 flex flex-row justify-center items-center">
      <span class="text-6xl text-center leading-loose">
        載入中...
      </span>
    </div>
  {:else if loaded && isKeyCorrect}
    {#if currentPage !== '/'}
      <div class="absolute top-0 left-0 w-full h-full bg-black/60"></div>
    {/if}
    <div class="mx-auto container">
      <div role="tablist" class="tabs tabs-bordered m-4">
        {#each tabs as { name, href }}
          <a
            href={`${href}?key=plamour-half-anniversary`}
            role="tab"
            class="tab"
            class:text-black={currentPage === '/'}
            class:tab-active={currentPage === href}
            on:click={() => currentPage = href}
          >{name}</a>
        {/each}
      </div>
    </div>
    <div class="mx-auto p-4 container" style:min-height="calc(100dvh - 5rem)">
      <slot />
    </div>
    <div class="relative footer bg-black/60 z-10">
      <div class="mx-auto my-8 container">
        <p>
          帕露梅爾半周年粉絲慶典 狗狗羊羊大冒險<br>
          2024/08/05 謹獻 雪迎、森雨悠娜
        </p>
        <p>
          企劃：<span
            class="cursor-pointer text-sky-300"
            on:click={() => showEgg = true}
            on:keydown={() => {}}
            tabindex="0"
            role="button"
          >伏伏</span>、哈洛斯 <br>
          網頁製作：哈洛斯<br>
          慶典賀圖：OOYA<br>
          協力：俗頭、融、棠ㄐ、酷褲鳥、delta、維尼、Ｗilson、Karasuba、拿鐵<br>
          特別感謝：雪Q餅、羊毛糰
        </p>
      </div>
    </div>
    {#if currentPage !== '/' && scorllY > 80}
      <div class="fixed bottom-16 right-4 z-20">
        <button
          class="rounded-full bg-black/60 text-white p-2"
          on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4h12v2H6zm.707 11.707L11 11.414V20h2v-8.586l4.293 4.293 1.414-1.414L12 7.586l-6.707 6.707z"></path>
          </svg>
        </button>
      </div>
    {/if}
    {#if currentPage !== '/'}
      <div class="fixed bottom-4 right-4 z-20">
        <a
          class="block rounded-full bg-black/60 text-white p-2"
          href="/?key=plamour-half-anniversary"
          on:click={() => currentPage = '/'}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M416 174.74V48h-80v58.45L256 32 0 272h64v208h144V320h96v160h144V272h64l-96-97.26z"></path>
          </svg>
        </a>
      </div>
    {/if}
    {#if showEgg}
      <div
        class="cursor-pointer fixed top-0 left-0 w-full h-full bg-black/60 flex flex-row justify-center items-center z-30"
        on:click={() => showEgg = false}
        on:keydown={() => {}}
        tabindex="0"
        role="button"
      >
        <img class="w-1/2" src="/images/egg.png" alt="egg">
      </div>
    {/if}
  {:else}
    <div class="min-h-48 flex flex-row justify-center items-center">
      <span class="text-6xl text-center leading-loose">
        題目沒做完還想偷看ㄏㄚˋ！<br>
        (／｀Д´)／~ ╧╧
      </span>
    </div>
  {/if}
</div>
