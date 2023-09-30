<script>
  let photos = [
    // Add the URLs of your photos here
    "DSCF1583.jpg",
    "DSCF1595.jpg",
	'DSCF1231_1.JPG',
	"DSCF1583.jpg",
    "DSCF1595.jpg",
	'DSCF1231_1.JPG'
    // Add more photo URLs as needed
  ];
</script>

<style>
	.app {
	  margin: 0;
	  padding: 0;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  text-align: center;
	  background-color: #f0f0f0; /* Light gray background */
	  min-height: 100vh; /* Make the gallery at least 100% of the viewport height */
	}
  
	.container {
	  max-width: 80%; /* Set a maximum width of 70% for the content */
	  width: 100%;
	  padding: 1rem;
	}
  
	.navbar {
		display: flex;
    	align-items: center;
	  	background-color: white;
	  	color: black;
		width: 100%;
	  	padding: 5px;
	 	margin-bottom: 5px;
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
	}

  
	.gallery {
		display: flex;
    	flex-wrap: wrap; /* Allow items to wrap to the next row */
    	justify-content: center; /* Center items horizontally */
	  grid-gap: 1rem;
	  background-color: white; /* White gallery background */
	  border-radius: 5px; /* Rounded corners for the gallery */
	  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); /* Light shadow for the gallery */
	}

	.navbar-logo {
		width: 40px; /* Adjust the width of the logo as needed */
		height: auto; /* Maintain aspect ratio */
		margin-right: 1rem; /* Add some spacing between the logo and title */
		border-radius: 50%;
  	}
  
	h1 {
    margin: 0; /* Remove default margin for the title */
  	}

	.photo {
		max-width: calc(30% - 10px); /* Adjust the width based on the number of photos per row */
		height: auto;
		margin: 5px; /* Add some spacing between photos */
		border: 5px solid white; /* Add a white border around each photo */
		border-radius: 10px; /* Add rounded corners to each photo */
  }
</style>

<div class="app">
  <nav class="navbar">
	<img src="Crunchy.png" alt="Logo" class="navbar-logo" />
    <h1>Justin's Photos</h1>
  </nav>
  <div class="container">
  <div class="gallery">
    {#each photos as photo, index}
      <img class='photo' src={photo} alt={`Photo ${index + 1}`} />
    {/each}
  </div>
  </div>
</div>
