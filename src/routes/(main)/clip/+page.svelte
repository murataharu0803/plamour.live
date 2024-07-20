<script lang="ts">
import { fetchData } from "$lib";

let clips: {
  url: string,
  thumbnailUrl: string,
  title: string,
  clipper: string,
  type: string,
  members: string[],
}[] = []

const load = async() => {
  clips = await fetchData('CLIP')
}

const onload = (e: Element) => { load() }
</script>

<div use:onload class="min-h-48 flex flex-row justify-start flex-wrap -mx-4">
    {#each clips as { url, thumbnailUrl, title, clipper, type, members }}
      <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
        <a href={url} target="_blank" class="block relative w-full h-full overflow-hidden rounded-md">
          <img class="w-full h-auto" src={thumbnailUrl} alt={title}>
          <div class="p-2 bg-black/60 text-white">
            <div class="flex flex-row items-center text-xs font-mono">
              <div class="flex-1">剪輯者：{clipper}</div>
              <div class="flex-grow-0">{members.join(', ')}</div>
            </div>
            <div>{title}</div>
          </div>
        </a>
      </div>
    {/each}
</div>