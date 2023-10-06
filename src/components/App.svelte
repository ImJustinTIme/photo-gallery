<script>
  import PhotoSection from "@components/photoSection.svelte";
  import Hamburger from "@components/hamburger.svelte";
  import {photos} from "@utils/photoArray.js";
  import {lazyLoad} from "@utils/lazyLoad.js";

  $: menuOpen = false;

  let makeActive = () => {
    menuOpen = !menuOpen;
  };
</script>

<div class="app">
  <div class="card-content">
    <nav class={`side-nav ${menuOpen ? "menu-open" : ""}`}>
      <!-- Side navigation links -->
        <img use:lazyLoad={"Signature1.jpg"} alt="Logo" class="navbar-sig" />
        <div class="menu-items">
          <a href="#photos">Photographs</a>
          <a href="#digital-art">Digital Art</a>
          <a href="mailto:jkuennen@proton.me">Contact Me</a>
          <a href="https://ko-fi.com/justinintime/shop">Purchase Photos</a>
          <a href="https://github.com/ImJustinTIme">GitHub</a>
        
        
      </div>
      <Hamburger {menuOpen} {makeActive} class="mobile-hamburger" />
      <!-- Add more navigation links as needed -->
    </nav>
    <div class="content">
      <div class="container">
        <div class="gallery">
          {#each photos as section, index}
            <PhotoSection photos={section} {index} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
