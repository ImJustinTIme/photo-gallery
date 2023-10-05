<script>
  import { onMount } from "svelte";

    export let src, alt, className;
    let loaded = false;
    let thisPhoto;
</script>

<img {src} {alt} class={className}/>