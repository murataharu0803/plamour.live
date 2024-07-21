<script lang="ts">
import { fetchData } from "$lib";

let fanarts: {
  imageUrl: string,
  source: string,
  artist: string,
  artistLink: string,
  members: string[],
}[] = []

const load = async() => {
  fanarts = await fetchData('FANART')
}

const onload = (e: Element) => { load() } 

</script>

<div use:onload class="min-h-48 flex flex-row justify-start flex-wrap -mx-4">
  {#each fanarts as { imageUrl, source, artist, artistLink, members }}
    <div class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-48 p-4">
      <a href={source} target="_blank" class="block relative w-full h-full overflow-hidden rounded-md">
        <div class="absolute w-full h-full bg-cover bg-center bg-no-repeat blur-2xl" style:background-image={`url(${imageUrl})`}></div>
        <div class="absolute w-full h-full bg-contain bg-center bg-no-repeat" style:background-image={`url(${imageUrl})`}></div>
        <div class="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-sm">
          <a href={artistLink} target="_blank" rel="noopener" class="underline">{artist}</a>
        </div>
      </a>
    </div>
  {/each}
</div>