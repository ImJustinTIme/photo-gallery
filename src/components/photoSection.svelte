<script>
  import gsap from 'gsap';
  //import ScrollTrigger from 'gsap/ScrollTrigger';
  //import { onMount } from "svelte";

  export let photos, index;
  let { names, description, title, id, url} = photos;

  const hoverOver = (event) => {
    let [, span1, span2] = event.target.lastChild.children;
    gsap.to(event.target, {
      boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
    });

    gsap.to(span1, {
      width: '200px',
      opacity: 1,
      duration: 2,
      ease: 'ease-in'
    });

    gsap.to(span2, {
      width: '80px',
      opacity: 1,
      duration: 1.4,
      ease: 'ease-in'
    });
  }

  const hoverAway = (event) => {
    let [, span1, span2] = event.target.lastChild.children;
    gsap.to(event.target, {
    boxShadow: 'none'
  });
  gsap.to(span1, {
    width: 0,
    opacity: 0,
    duration: 1,
    ease: 'ease-in'
  });

  gsap.to(span2,{
    width: 0,
    opacity: 0,
    duration: 1,
    ease: 'ease-in'
  });
  };

  const onLoad = () => {
    gsap.to('.photo-section'  , {
      opacity: 1, 
      y: 0,
      duration: 1.4,
      ease: 'ease-in'
  });
  }
</script>

<a 
  on:mouseenter={hoverOver}
  on:mouseleave={hoverAway}
  href={url}
  id={`f${index}`} 
  class={`photo-section`}
>
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
</a>
