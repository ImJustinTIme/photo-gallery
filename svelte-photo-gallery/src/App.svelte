<script>
  import PhotoSection from "@components/photoSection.svelte";
  import Hamburger from "@components/hamburger.svelte";

  $: menuOpen = false;

  let photos = [
    {
      id: 'photos',
      names: ["Black-capped Chickadee-2.jpg"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane",
    },
    {
      names: ["Hoco-1.jpg", "Rock Face.jpg"],
      description:
        "Rock Structure Photos Taken Around the Spokane river, winter 2023",
    },
    {
      names: ["Subtle Anarchy 2.jpg", 'Subtle Anarchy-1.jpg', 'Subtle Messages.jpg'],
      description:
        "Some interesting Graffiti found on rock structures near the Spokane River",
    },
    {
      names: ["Ultrawide Chickadee.jpg"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane in wide ratio",
    },
    {
      title: 'Digital Art',
      id: 'digital-art',
      names: ["Stripes-2.PNG", 'Stripes.PNG'],
      description:
        "Some Ipad wallpapers I made For personal use in procreate",
    }
  ];

  let makeActive = () => {
        menuOpen = !menuOpen;
    }
</script>

<div class="app">
  <div class="card-content">
    <nav class= {`side-nav ${menuOpen ? 'menu-open' : ''}`}>
      <!-- Side navigation links -->
      <div class="nav-buttons">
        <img src="Crunchy.png" alt="Logo" class="navbar-logo" />
        <a href="#photos">Photos</a>
        <a href="#digital-art">Digital Art</a>
      </div>
      <div class="external-links">
        <a href="#section2">Contact Me</a>
      </div>
      <Hamburger menuOpen={menuOpen} makeActive={makeActive} class='mobile-hamburger'/>
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