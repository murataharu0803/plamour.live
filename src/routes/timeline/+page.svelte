<script lang="ts">
import { fetchData } from "$lib";

let timeline: { date: string, description: string }[] = []

const load = async() => {
  timeline = await fetchData('TIMELINE')
}

const displayDate = (date: string) => {
  const d = new Date(date)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

const onload = (e: Element) => { load() } 

</script>

<div use:onload class="min-h-48">
  <ul class="timeline timeline-snap-icon timeline-vertical">
    {#each timeline as { date, description }}
      <li>
        <hr class="bg-slate-400">
        <div class="timeline-start font-mono">{displayDate(date)}</div>
        <div class="timeline-middle mx-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="timeline-end timeline-box">{description}</div>
        <hr class="bg-slate-400">
      </li>
    {/each}
  </ul>
</div>