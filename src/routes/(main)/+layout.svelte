<script lang="ts">
let currentPage = ''
let loaded = false
let isKeyCorrect = false

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
}
</script>

<div use:onload>
  {#if !loaded}
    <div class="min-h-48 flex flex-row justify-center items-center">
      <span class="text-6xl text-center leading-loose">
        載入中...
      </span>
    </div>
  {:else if loaded && isKeyCorrect}
    <div class="mx-auto container">
      <div role="tablist" class="tabs tabs-bordered m-4">
        {#each tabs as { name, href }}
          <a
            href={`${href}?key=plamour-half-anniversary`}
            role="tab"
            class="tab"
            class:tab-active={currentPage === href}
            on:click={() => currentPage = href}
          >{name}</a>
        {/each}
      </div>
    </div>
    <div class="mx-auto p-4 container min-h-dvh">
      <slot />
    </div>
    <div class="footer bg-black/60">
      <div class="mx-auto my-8 container">
        謹獻 雪迎、悠娜<br>
        企劃：伏伏、哈洛斯<br>
        協作：<br>
        協力：雪Q餅、羊毛糰
      </div>
    </div>
  {:else}
    <div class="min-h-48 flex flex-row justify-center items-center">
      <span class="text-6xl text-center leading-loose">
        題目沒做完還想偷看ㄏㄚˋ！<br>
        (／｀Д´)／~ ╧╧
      </span>
    </div>
  {/if}
</div>
