<script>
  export let photos, index;

  let { names, description, title, id } = photos;
</script>

<div class="photo-section">
  {#if title}
    <h1 {id}>{title}</h1>
  {/if}
  <div class="photo-grid">
    {#each names as photoName}
      <img
        class={`photo-${names.length}`}
        src={photoName}
        alt={`Photo ${index + 1}`}
      />
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
  </div>
</div>
