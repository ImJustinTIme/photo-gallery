import App from '@components/App.svelte';
import '@styles/App.css';
import '@styles/photoSection.css';
import '@styles/hamburgers.css';

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { mount } from "svelte";

gsap.registerPlugin(ScrollTrigger);
const app = mount(App, {
	target: document.body
});

export default app;