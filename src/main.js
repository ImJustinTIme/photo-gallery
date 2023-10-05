import App from './App.svelte';
import '@styles/App.css';
import '@styles/photoSection.css';
import '@styles/hamburgers.css';

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const app = new App({
	target: document.body
});

export default app;