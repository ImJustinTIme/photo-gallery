<script>
  import PhotoSection from "./photoSection.svelte";
  let photos = [
    // Add the URLs of your photos here
    {
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
  ];
</script>

<div class="app">
  <div class="card-content">
    <nav class="side-nav">
      <!-- Side navigation links -->
      <div class="nav-buttons">
        <img src="Crunchy.png" alt="Logo" class="navbar-logo" />
        <a href="#section1">Photos</a>
        <a href="#section2">Digital Art</a>
      </div>
      <div class="external-links">
        <a href="#section2">Contact Me</a>
      </div>
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
  }

  .card-content {
    display: flex;
    flex-direction: row;
    width: 80%;
    background-color: #f0f0f0; /* Light gray background */
    height: 97%;
    overflow-y: hidden;
    justify-content: space-around; /* Distribute space evenly around elements */
  }

  .side-nav {
    min-width: 14vw;
    background-color: #fff; /* Background color for the side navigation */
    display: flex;
    justify-content: space-between;
    padding-top: 3rem;
    flex-direction: column;
    font-size: 16px;
    z-index: 1; /* Ensure it's above other content */
  }

  .nav-buttons {
    display: flex;
    flex-direction: column;
    align-items: end;
    color: #000;
  }

  .external-links {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: .5rem;
	margin-bottom: 1rem;
  }


  .side-nav a {
    color: black; /* Text color for navigation links */
    text-decoration: none; /* Remove underlines from links */
    margin-top: 1rem; /* Adjust spacing between links */
    font-weight: 500;
  }

  .content {
    background-color: #f0f0f0; /* Background color for the content area */
    display: flex;
    flex-direction: column;
    align-items: center;
	overflow-y: auto;
	height: 100%;
  }

  .container {
    width: 100%;
	height: 100%;
  }

  .gallery {
    width: 100%;
    padding-top: 3rem;
	display: flex;
	flex-direction: column;
	align-items: center;
    background-color: white; /* White gallery background */
  }

  .navbar-logo {
    width: 30px; /* Adjust the width of the logo as needed */
    height: auto; /* Maintain aspect ratio */
    border-radius: 100%;
  }
</style>
