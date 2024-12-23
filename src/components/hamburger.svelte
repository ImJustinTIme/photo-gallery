<script>
    let { menuOpen, makeActive } = $props();
</script>

<button
    class={`hamburger hamburger--slider ${menuOpen ? "is-active" : ""}`}
    aria-label={"menu"}
    onclick={makeActive}
    type="button"
>
    <span class="hamburger-box">
        <span class="hamburger-inner"></span>
    </span>
</button>
