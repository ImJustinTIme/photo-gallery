<script>
  import gsap from "gsap";
  import { lazyLoad } from "@utils/lazyLoad.js";

  export let photos;
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
      duration: .4,
      ease: "ease-in",
    });
  };
</script>

<a
  on:mouseenter={hoverOver}
  on:mouseleave={hoverAway}
  {id}
  class={`photo-section`}
>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="photo-grid" let:onLoad>
    {#each names as photoName}
      <img
        on:load={onLoad}
        use:lazyLoad={photoName}
        alt={photoName}
        class={`photo-${names.length}`}
      />
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
    {#if url}
    <a href={url} class='link-button'>Download Full Resolution</a>
    {/if}
  </div>
</a>
