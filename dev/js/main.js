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
    // SPLIT TEXT (lines + chars)
    // -------------------------
    const blocks = gsap.utils.toArray(".heading-style-h2-upper");

    const splits = blocks.map(el =>
        new SplitText(el, {
            type: "lines,chars",
            linesClass: "story-line",
            charsClass: "story-char"
        })
    );

    // Initial state
    gsap.set(".story-char", { opacity: 0.3, color: "#fff" });

    // -------------------------
    // SCROLL ANIMATIONS (per line, sequential)
    // -------------------------
    splits.forEach((split, i) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: blocks[i],
                start: "top 80%",
                end: "top 55%",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        split.lines.forEach((lineEl) => {
            const lineChars = lineEl.querySelectorAll(".story-char");

            tl.to(lineChars, {
                keyframes: [
                    { opacity: 0.3, color: "#fff", duration: 0 },
                    { opacity: 1, color: "#5497FF", duration: 1 },
                    { opacity: 1, color: "#fff", duration: 1 }
                ],
                ease: "none",
                stagger: 1
            }, ">"); // ✅ next line starts after previous finishes
        });
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
    const imgA = document.querySelector(".header5_background-image-2");
    const imgB = document.querySelector(".header5_background-image");

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





// gsap.to('.preloader', {
//     opacity: 0,
//     delay: .1,
//     duration: .5,
//     ease: "power2.out",
//     onComplete: ()=> {
//         document.querySelector('.preloader').remove();
//     }
// });
