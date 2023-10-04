<script>
  import { onMount } from "svelte";

    export let src, alt, className;
    let loaded = false;
    let thisPhoto;
    onMount(() => {
        thisPhoto.onload = () => {
            loaded = true;
        }
    })
</script>

<img {src} {alt} class={className}  class:loaded bind:this={thisPhoto} loading="lazy"/>