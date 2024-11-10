<script>
  import gsap from "gsap";
  import { lazyLoad } from "@utils/lazyLoad.js";

  let { photos } = $props();
  let { names, description, title, id, url } = photos;

  const hoverOver = (event) => {
    gsap.to(event.target, {
      boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    });
  };

  const hoverAway = (event) => {
    gsap.to(event.target, {
      boxShadow: "none",
    });
  };

  const onLoad = () => {
    gsap.to(".photo-section", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "ease-in",
    });
  };
</script>

<div {id} class={`photo-section`}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="photo-grid">
    {#each names as photoName}
      <img
        onload={onLoad}
        use:lazyLoad={photoName}
        alt={photoName}
        class={`photo-${names.length}`}
      />
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
    {#if url}
      <a href={url} class="link-button">Purchase Full Resolution Download</a>
    {/if}
  </div>
</div>
