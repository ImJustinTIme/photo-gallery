<script>
  import gsap from 'gsap';
  //import ScrollTrigger from 'gsap/ScrollTrigger';
  //import { onMount } from "svelte";

  export let photos, index;
  let { names, description, title, id } = photos;
  //gsap.registerPlugin(ScrollTrigger);
  let onLoad = () => {
    gsap.to(`#f${index}`  , {
      opacity: 1, 
      y: 0,
      duration: 1.4,
      ease: 'ease-in'
  });

  gsap.to('.line', {
    width: '200px',
    opacity: 1,
    duration: 2,
    ease: 'ease-in'
  });

  gsap.to('.line-2', {
    width: '80px',
    opacity: 1,
    duration: 1.4,
    ease: 'ease-in'
  });
  };
</script>

<div id={`f${index}`} class={`photo-section`}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="photo-grid" let:onLoad>
    {#each names as photoName}
      <img on:load={onLoad} {id} src={photoName} alt={photoName}  class={`photo-${names.length}`}/>
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
    <span class='line'/>
    <span class='line-2'/>
  </div>
</div>
