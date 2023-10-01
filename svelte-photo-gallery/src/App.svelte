<script>
  import PhotoSection from "./photoSection.svelte";
  let photos = [
    // Add the URLs of your photos here
    {
      names: ["DSCF1231_1.JPG"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane",
    },
    {
      names: ["DSCF1231_1.JPG", "DSCF1595.jpg"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane",
    },
    {
      names: ["DSCF1231_1.JPG"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane",
    },
    {
      names: ["DSCF1231_1.JPG"],
      description:
        "Photo of black-capped chickadee taken spring 2023 in Spokane",
    },
  ];
</script>

<div class="app">
  <div class="card-content">
    <nav class="side-nav">
      <!-- Side navigation links -->
      <img src="Crunchy.png" alt="Logo" class="navbar-logo" />
      <a href="#section1">Photos</a>
      <a href="#section2">Digital Art</a>
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

<style>
  .app {
    height: 100vh;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: #f0f0f0;
    /* Make the gallery at least 100% of the viewport height */
  }

  .card-content {
    display: flex;
    flex-direction: row;
    width: 80%;
    background-color: #f0f0f0; /* Light gray background */
    height: 99%;
    overflow-y: hidden;
    justify-content: space-around; /* Distribute space evenly around elements */
  }

  .side-nav {
    min-width: 15vw;
    background-color: #fff; /* Background color for the side navigation */
    color: #000;
    display: flex;
    align-items: end;
    padding-top: 2rem;
    flex-direction: column;
	font-size: 16px;
    z-index: 1; /* Ensure it's above other content */
  }

  .side-nav a {
    color: black; /* Text color for navigation links */
    text-decoration: none; /* Remove underlines from links */
    margin: .5rem; /* Adjust spacing between links */
	font-weight: 500;
  }

  .content {
    flex-grow: 1; /* Allow content to expand to fill remaining space */
    background-color: #f0f0f0; /* Background color for the content area */
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }

  .container {
    width: 100%;
    overflow-y: auto;
  }

  .gallery {
    width: 100%;
    padding-top: 2rem;
    padding-left: 2rem;
    background-color: white; /* White gallery background */
  }

  .navbar-logo {
    width: 30px; /* Adjust the width of the logo as needed */
    height: auto; /* Maintain aspect ratio */
    border-radius: 100%;
	margin-right: .5rem;
  }
</style>
