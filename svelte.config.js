import { sveltePreprocess } from 'svelte-preprocess';


// svelte.config.js

export default {
  // svelte options
  extensions: ['.svelte'],
  compilerOptions: {},
  preprocess: sveltePreprocess({}),
  onwarn: (warning, handler) => handler(warning),
  // plugin options
  vitePlugin: {
    exclude: [],
    // experimental options
    experimental: {}
  }
};
