<script lang="ts">
let loaded = false
let isKeyCorrect = false

const onload = (e: Element) => {
  isKeyCorrect = new URLSearchParams(window.location.search).get('key') === 'plamour-half-anniversary'
  loaded = true
}
</script>

<div use:onload class="min-h-dvh flex flex-row justify-center items-center">
  <span class="text-6xl text-center leading-loose">
    {#if !loaded}
      LOADING...
    {:else if isKeyCorrect}
      網站還沒做好<br>
      哈哈，小丑竟是我自己<br>
      (´・ω・｀)
    {:else}
      題目沒做完還想偷看ㄏㄚˋ！<br>
      (／｀Д´)／~ ╧╧
    {/if}
  </span>
</div>