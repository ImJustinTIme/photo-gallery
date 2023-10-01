
<script>
    export let photos, index;

    let {
        names,
        description
    } = photos;

    console.log(photos)
</script>


<div class='photo-section'>
    <div class="photo-grid">
        {#each names as photoName}
        <img class={`photo-${names.length}`} src={photoName} alt={`Photo ${index + 1}`} />
        {/each}
    </div>
    <div class='photo-subtext-section'>
        <div>{description}</div>
    </div>
</div>

<style>
    .photo-section {
        width: 90%;
        display: flex;
        flex-direction: column;
        margin-bottom: 10rem;
    }

    .photo-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
    }

    .photo-1 {
        width: 100%;
        height: auto;
        grid-column: auto /span 2

    }

    .photo-2 {
        width: 100%;
        height: auto; 
        grid-column: auto /span 1;
    }

    .photo-subtext-section { 
        display: flex;
        justify-content: end;
        font-size: 12px;
        font-weight: normal;
        font-style: italic;
        padding: auto;
    }
</style>