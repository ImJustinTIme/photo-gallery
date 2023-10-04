<script>
  import Image from "./image.svelte";

  export let photos;

  let { names, description, title, id } = photos;
</script>

<div class="photo-section">
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="photo-grid">
    {#each names as photoName}
      <Image {id} src={photoName} alt={photoName}  className={`photo-${names.length}`}/>
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
  </div>
</div>
