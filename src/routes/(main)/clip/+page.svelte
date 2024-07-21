<script lang="ts">
import { fetchData, type Member } from "$lib";

let clips: {
  url: string,
  thumbnailUrl: string,
  title: string,
  clipper: string,
  type: string,
  members: string[],
}[] = []

let allMembers: Member[] = []

const load = async() => {
  clips = await fetchData('CLIP')
  allMembers = await fetchData('MEMBER')
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
            <div class="avatar-group -space-x-4 hover:space-x-1">
              {#each members || [] as name, i}
                <img
                  class="avatar w-8 h-8 transition-all border-2 relative"
                  src={allMembers.find(m => m.id === name)?.profilePic}
                  style:z-index={100 - i}
                  alt={name}
                >
              {/each}
            </div>
          </div>
          <div>{title}</div>
        </div>
      </a>
    </div>
  {/each}
</div>