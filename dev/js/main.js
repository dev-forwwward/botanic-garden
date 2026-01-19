document.addEventListener("DOMContentLoaded", () => {

    // -------------------------
    // LENIS (KEEP YOUR PATTERN)
    // -------------------------
    window.lenis = new Lenis({ smooth: true });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // -------------------------
    // SPLIT TEXT
    // -------------------------
    const lines = gsap.utils.toArray(".heading-style-h2-upper");

    const splits = lines.map(line =>
        new SplitText(line, {
            type: "chars",
            charsClass: "story-char"
        })
    );

    // Initial state → 50% opacity
    gsap.set(".story-char", {
        opacity: 0.2,
        //y: 16
    });

    // -------------------------
    // SCROLL ANIMATIONS
    // -------------------------
    splits.forEach((split, i) => {
        gsap.to(split.chars, {
            opacity: 1,
            //y: 0,
            ease: "power2.out",
            stagger: 0.02,
            scrollTrigger: {
                trigger: lines[i],
                start: "top 80%",
                end: "top 55%",
                scrub: true
            }
        });
    });

    // -------------------------
    // FONT SAFETY (important)
    // -------------------------
    if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
        });
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
