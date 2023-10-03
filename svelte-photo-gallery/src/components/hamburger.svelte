<script>
    export let menuOpen, makeActive;

    
</script>

<button class={`hamburger hamburger--slider ${menuOpen ? 'is-active' : ''}`} on:click={makeActive} type="button">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
</button>  