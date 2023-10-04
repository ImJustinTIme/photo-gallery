
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\photoSection.svelte generated by Svelte v3.59.2 */

    const file$2 = "src\\components\\photoSection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (8:2) {#if title}
    function create_if_block(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[3]);
    			attr_dev(h1, "id", /*id*/ ctx[4]);
    			add_location(h1, file$2, 8, 4, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#each names as photoName}
    function create_each_block$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", `photo-${/*names*/ ctx[1].length}`);
    			if (!src_url_equal(img.src, img_src_value = /*photoName*/ ctx[6])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = `Photo ${/*index*/ ctx[0] + 1}`);
    			add_location(img, file$2, 12, 6, 251);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 1 && img_alt_value !== (img_alt_value = `Photo ${/*index*/ ctx[0] + 1}`)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(12:4) {#each names as photoName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let t0;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let if_block = /*title*/ ctx[3] && create_if_block(ctx);
    	let each_value = /*names*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = `${/*description*/ ctx[2]}`;
    			attr_dev(div0, "class", "photo-grid");
    			add_location(div0, file$2, 10, 2, 187);
    			add_location(div1, file$2, 20, 4, 435);
    			attr_dev(div2, "class", "photo-subtext-section");
    			add_location(div2, file$2, 19, 2, 394);
    			attr_dev(div3, "class", "photo-section");
    			add_location(div3, file$2, 6, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[3]) if_block.p(ctx, dirty);

    			if (dirty & /*names, index*/ 3) {
    				each_value = /*names*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PhotoSection', slots, []);
    	let { photos, index } = $$props;
    	let { names, description, title, id } = photos;

    	$$self.$$.on_mount.push(function () {
    		if (photos === undefined && !('photos' in $$props || $$self.$$.bound[$$self.$$.props['photos']])) {
    			console.warn("<PhotoSection> was created without expected prop 'photos'");
    		}

    		if (index === undefined && !('index' in $$props || $$self.$$.bound[$$self.$$.props['index']])) {
    			console.warn("<PhotoSection> was created without expected prop 'index'");
    		}
    	});

    	const writable_props = ['photos', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PhotoSection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('photos' in $$props) $$invalidate(5, photos = $$props.photos);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		photos,
    		index,
    		names,
    		description,
    		title,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('photos' in $$props) $$invalidate(5, photos = $$props.photos);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('names' in $$props) $$invalidate(1, names = $$props.names);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('id' in $$props) $$invalidate(4, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [index, names, description, title, id, photos];
    }

    class PhotoSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { photos: 5, index: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PhotoSection",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get photos() {
    		throw new Error("<PhotoSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set photos(value) {
    		throw new Error("<PhotoSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<PhotoSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<PhotoSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\hamburger.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\components\\hamburger.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let span1;
    	let span0;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span1 = element("span");
    			span0 = element("span");
    			attr_dev(span0, "class", "hamburger-inner");
    			add_location(span0, file$1, 8, 6, 224);
    			attr_dev(span1, "class", "hamburger-box");
    			add_location(span1, file$1, 7, 4, 188);
    			attr_dev(button, "class", button_class_value = `hamburger hamburger--slider ${/*menuOpen*/ ctx[0] ? 'is-active' : ''}`);
    			attr_dev(button, "type", "button");
    			add_location(button, file$1, 6, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span1);
    			append_dev(span1, span0);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*makeActive*/ ctx[1])) /*makeActive*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*menuOpen*/ 1 && button_class_value !== (button_class_value = `hamburger hamburger--slider ${/*menuOpen*/ ctx[0] ? 'is-active' : ''}`)) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hamburger', slots, []);
    	let { menuOpen, makeActive } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (menuOpen === undefined && !('menuOpen' in $$props || $$self.$$.bound[$$self.$$.props['menuOpen']])) {
    			console.warn("<Hamburger> was created without expected prop 'menuOpen'");
    		}

    		if (makeActive === undefined && !('makeActive' in $$props || $$self.$$.bound[$$self.$$.props['makeActive']])) {
    			console.warn("<Hamburger> was created without expected prop 'makeActive'");
    		}
    	});

    	const writable_props = ['menuOpen', 'makeActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hamburger> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menuOpen' in $$props) $$invalidate(0, menuOpen = $$props.menuOpen);
    		if ('makeActive' in $$props) $$invalidate(1, makeActive = $$props.makeActive);
    	};

    	$$self.$capture_state = () => ({ menuOpen, makeActive });

    	$$self.$inject_state = $$props => {
    		if ('menuOpen' in $$props) $$invalidate(0, menuOpen = $$props.menuOpen);
    		if ('makeActive' in $$props) $$invalidate(1, makeActive = $$props.makeActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuOpen, makeActive];
    }

    class Hamburger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { menuOpen: 0, makeActive: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hamburger",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get menuOpen() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuOpen(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get makeActive() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set makeActive(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (73:10) {#each photos as section, index}
    function create_each_block(ctx) {
    	let photosection;
    	let current;

    	photosection = new PhotoSection({
    			props: {
    				photos: /*section*/ ctx[3],
    				index: /*index*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(photosection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(photosection, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(photosection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(photosection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(photosection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(73:10) {#each photos as section, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div5;
    	let div4;
    	let nav;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let hamburger;
    	let nav_class_value;
    	let t13;
    	let div3;
    	let div2;
    	let div1;
    	let current;

    	hamburger = new Hamburger({
    			props: {
    				menuOpen: /*menuOpen*/ ctx[0],
    				makeActive: /*makeActive*/ ctx[2],
    				class: "mobile-hamburger"
    			},
    			$$inline: true
    		});

    	let each_value = /*photos*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			nav = element("nav");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Photographs";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Digital Art";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Contact Me";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Buy Me Coffee";
    			t8 = space();
    			a4 = element("a");
    			a4.textContent = "Purchase Photos";
    			t10 = space();
    			a5 = element("a");
    			a5.textContent = "GitHubs";
    			t12 = space();
    			create_component(hamburger.$$.fragment);
    			t13 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = "Signature1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "class", "navbar-sig");
    			add_location(img, file, 55, 8, 1467);
    			attr_dev(a0, "href", "#photos");
    			add_location(a0, file, 57, 10, 1569);
    			attr_dev(a1, "href", "#digital-art");
    			add_location(a1, file, 58, 10, 1613);
    			attr_dev(a2, "href", "mailto:jkuennen@proton.me");
    			add_location(a2, file, 59, 10, 1662);
    			attr_dev(a3, "href", "https://ko-fi.com/justinintime");
    			add_location(a3, file, 60, 10, 1723);
    			attr_dev(a4, "href", "https://ko-fi.com/justinintime/shop");
    			add_location(a4, file, 61, 10, 1792);
    			attr_dev(a5, "href", "https://github.com/ImJustinTIme");
    			add_location(a5, file, 62, 10, 1868);
    			attr_dev(div0, "class", "menu-items");
    			add_location(div0, file, 56, 8, 1534);
    			attr_dev(nav, "class", nav_class_value = `side-nav ${/*menuOpen*/ ctx[0] ? "menu-open" : ""}`);
    			add_location(nav, file, 53, 4, 1366);
    			attr_dev(div1, "class", "gallery");
    			add_location(div1, file, 71, 8, 2148);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file, 70, 6, 2116);
    			attr_dev(div3, "class", "content");
    			add_location(div3, file, 69, 4, 2088);
    			attr_dev(div4, "class", "card-content");
    			add_location(div4, file, 52, 2, 1335);
    			attr_dev(div5, "class", "app");
    			add_location(div5, file, 51, 0, 1315);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, nav);
    			append_dev(nav, img);
    			append_dev(nav, t0);
    			append_dev(nav, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div0, a3);
    			append_dev(div0, t8);
    			append_dev(div0, a4);
    			append_dev(div0, t10);
    			append_dev(div0, a5);
    			append_dev(nav, t12);
    			mount_component(hamburger, nav, null);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const hamburger_changes = {};
    			if (dirty & /*menuOpen*/ 1) hamburger_changes.menuOpen = /*menuOpen*/ ctx[0];
    			hamburger.$set(hamburger_changes);

    			if (!current || dirty & /*menuOpen*/ 1 && nav_class_value !== (nav_class_value = `side-nav ${/*menuOpen*/ ctx[0] ? "menu-open" : ""}`)) {
    				attr_dev(nav, "class", nav_class_value);
    			}

    			if (dirty & /*photos*/ 2) {
    				each_value = /*photos*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburger.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburger.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(hamburger);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let menuOpen;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let photos = [
    		{
    			id: "photos",
    			names: ["Black-capped Chickadee-2.jpg"],
    			description: "Photo of black-capped chickadee taken spring 2023 in Spokane"
    		},
    		{
    			names: ["Hoco-1.jpg", "Rock Face.jpg"],
    			description: "Rock Structure Photos Taken Around the Spokane river, winter 2023"
    		},
    		{
    			names: ["Subtle Anarchy 2.jpg", "Subtle Anarchy-1.jpg", "Subtle Messages.jpg"],
    			description: "Some interesting Graffiti found on rock structures near the Spokane River"
    		},
    		{
    			names: ["Goose Feet B&W.jpg"],
    			description: "I had some geese come right up to me to get the their picture taken"
    		},
    		{
    			names: ["Ultrawide Chickadee.jpg"],
    			description: "Photo of black-capped chickadee taken spring 2023 in Spokane in wide ratio"
    		},
    		{
    			title: "Digital Art",
    			id: "digital-art",
    			names: ["Stripes-2.PNG", "Stripes.PNG"],
    			description: "Some Ipad wallpapers I made For personal use in procreate"
    		}
    	];

    	let makeActive = () => {
    		$$invalidate(0, menuOpen = !menuOpen);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		PhotoSection,
    		Hamburger,
    		photos,
    		makeActive,
    		menuOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('photos' in $$props) $$invalidate(1, photos = $$props.photos);
    		if ('makeActive' in $$props) $$invalidate(2, makeActive = $$props.makeActive);
    		if ('menuOpen' in $$props) $$invalidate(0, menuOpen = $$props.menuOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, menuOpen = false);
    	return [menuOpen, photos, makeActive];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
