<script>
  import Image from "./image.svelte";
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import { onMount } from "svelte";

  export let photos, index;
  let { names, description, title, id } = photos;
  let photoSection = '';
  



  onMount(() => {
    
    if(ScrollTrigger.positionInViewport(`#f${index}`)) {
      console.log('in View');
    } 
    gsap.to(`#f${index}`  , {
      scrollTrigger:{
       trigger: `#f${index}`
      },
      opacity: 1, 
      y: 0,
      duration: 1.4,
      ease: 'ease-in-out'
  });
  })
</script>

<div style="opacity: 0;" id={`f${index}`} class={`photo-section`}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="photo-grid">
    {#each names as photoName}
      <Image id={id} src={photoName} alt={photoName}  className={`photo-${names.length}`}/>
    {/each}
  </div>
  <div class="photo-subtext-section">
    <div>{description}</div>
  </div>
</div>
