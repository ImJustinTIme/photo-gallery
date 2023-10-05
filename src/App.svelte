<script>
  import PhotoSection from "@components/photoSection.svelte";
  import Hamburger from "@components/hamburger.svelte";
  import Image from "./components/image.svelte";

  $: menuOpen = false;

  let photos = [
    {
      id: "photos",
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
      names: [
        "Subtle Anarchy 2.jpg",
        "Subtle Anarchy-1.jpg",
        "Subtle Messages.jpg",
      ],
      description:
        "Some interesting Graffiti found on rock structures near the Spokane River",
    },
    {
      names: [
        "Goose Feet B&W.jpg"
      ],
      description: "I had some geese come right up to me to get the their picture taken",
    },
    {
      names: [
        "Foggy Day In Spokane.jpg"
      ],
      description: "Taken shortly after orignally getting the new camera. I really like the difference in leaves in the two trees.",
    },
    {
      names: ["Ultrawide Chickadee.jpg"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane in wide ratio",
    },
    {
      title: "Digital Art",
      id: "digital-art",
      names: ["Stripes-2.PNG", "Stripes.PNG"],
      description: "Some Ipad wallpapers I made For personal use in procreate",
    },
  ];

  let makeActive = () => {
    menuOpen = !menuOpen;
  };
</script>

<div class="app">
  <div class="card-content">
    <nav class={`side-nav ${menuOpen ? "menu-open" : ""}`}>
      <!-- Side navigation links -->
        <Image src="Signature1.jpg" alt="Logo" className="navbar-sig" />
        <div class="menu-items">
          <a href="#photos">Photographs</a>
          <a href="#digital-art">Digital Art</a>
          <a href="mailto:jkuennen@proton.me">Contact Me</a>
          <a href="https://ko-fi.com/justinintime">Buy Me Coffee</a>
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
