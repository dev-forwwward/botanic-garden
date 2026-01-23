document.addEventListener("DOMContentLoaded", () => {

    // -------------------------
    // LENIS (KEEP YOUR PATTERN) 5497FF
    // -------------------------
    window.lenis = new Lenis({ smooth: true });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // -------------------------
    // TEXT REVEAL - SECTION 2
    // -------------------------
    function initStory() {
        // Kill previous instances (important in Webflow + refresh)
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars && st.vars.id === "storyST") st.kill();
        });

        // Revert previous splits if any
        if (window.__storySplits) {
            window.__storySplits.forEach(s => s.revert());
        }

        const blocks = gsap.utils.toArray(".heading-style-h2-upper");
        if (!blocks.length) return;

        // Create fresh splits
        const splits = blocks.map(el =>
            new SplitText(el, {
                type: "lines,chars",
                linesClass: "story-line",
                charsClass: "story-char"
            })
        );
        window.__storySplits = splits;

        // Initial state
        gsap.set(".story-char", { opacity: 0.3, color: "#fff" });

        // Build ONE master timeline in strict order
        const tl = gsap.timeline({ defaults: { ease: "none" } });

        splits.forEach(split => {
            split.lines.forEach(lineEl => {
                const lineChars = lineEl.querySelectorAll(".story-char");

                tl.to(lineChars, {
                    keyframes: [
                        { opacity: 0.3, color: "#fff", duration: 0 },
                        { opacity: 1, color: "#5497FF", duration: 1 },
                        { opacity: 1, color: "#fff", duration: 1 }
                    ],
                    stagger: 1
                }, ">");
            });
        });

        // Create ONE ScrollTrigger for the whole sequence
        ScrollTrigger.create({
            id: "storyST",
            trigger: blocks[0].closest("section, .story, .container") || blocks[0],
            start: "top 85%",
            end: () => "+=" + Math.ceil(tl.duration() * 5), // dynamic scroll length
            scrub: true,
            animation: tl,
            invalidateOnRefresh: true,
            //markers: true
        });
    }

    // init
    initStory();

    // rebuild on resize (SplitText lines depend on wrapping)
    window.addEventListener("resize", () => {
        clearTimeout(window.__storyResizeTO);
        window.__storyResizeTO = setTimeout(() => {
            initStory();
            ScrollTrigger.refresh();
        }, 200);
    });


    // -------------------------
    // FONT SAFETY
    // -------------------------
    if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    // -------------------------
    // FADE TRANSITION ON SCROLL
    // -------------------------
    const wrap = document.querySelector(".section_header5_fwd");
    const imgA = document.querySelectorAll(".header5_background-image-2");
    const imgB = document.querySelectorAll(".header5_background-image");

    // Optional polish: tiny zoom to hide banding + feels premium
    gsap.set(imgB, { opacity: 0, scale: 1 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "30% top",
            scrub: true,
            //markers: true
        }
    });

    tl
        .to(imgA, { opacity: 0, scale: 1, ease: "none" }, 0)
        .to(imgB, { opacity: 1, scale: 1, ease: "none" }, 0);

    // Refresh after images/fonts load (helps with sticky layouts)
    window.addEventListener("load", () => ScrollTrigger.refresh());

});

