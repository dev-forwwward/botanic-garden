document.addEventListener("DOMContentLoaded", function () {
// ---------------------------------------
// NAV MENU (full code + menu-navbar-bg collapses LAST)
// ---------------------------------------
const trigger   = document.querySelector('#menu-trigger');
const menuNavBar = document.querySelector(".mobile-dropdown-menu");
const navLinks  = document.querySelectorAll('.menu-link');
const html      = document.documentElement;
const body      = document.body;
const mobileMenu = document.querySelector('.mobile-dropdown-menu');

// ✅ background bar that should expand/collapse
const menuBg = document.querySelector(".menu-navbar-bg");

// Config
function getBgClosedHeight() {
  const w = window.innerWidth;

  // Webflow-style breakpoints
  if (w <= 767) return "3.6rem";  // 📱 Mobile
  if (w <= 991) return "5rem"; // 📲 Tablet
  return "5rem";               // 💻 Desktop (fallback)
}

const BG_OPEN = "100%";
const LINK_SCROLL_OFFSET = 0; // set if you have a sticky header (e.g. 72)

let scrollY = 0;

// --------------------
// Helpers
// --------------------
function isMenuOpen() {
  return menuNavBar.classList.contains("w--open");
}

function lockScroll() {
  scrollY = window.scrollY;

  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.classList.add("navbar-menu-open");
  html.classList.add("lock-viewport");
}

function unlockScroll() {
  body.classList.remove("navbar-menu-open");
  html.classList.remove("lock-viewport");

  body.style.position = '';
  body.style.top = '';

  window.scrollTo(0, scrollY);
}

function scrollToSection(targetEl, offset = 0) {
  if (!targetEl) return;
  const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// --------------------
// Open / Close
// --------------------
function openMenu() {
  if (isMenuOpen()) return;

  // Prevent race conditions
  gsap.killTweensOf(mobileMenu);
  gsap.killTweensOf(menuBg);
  gsap.killTweensOf(".nav_menu_bg_gradient");
  gsap.killTweensOf(".menu-link-container");
  gsap.killTweensOf(".mobile-dropdown-menu .button");

  // Lock scroll immediately
  lockScroll();

  // Webflow open-state (keep "as usual")
  menuNavBar.classList.add("w--open");

  // Put menu in layout now, but invisible until delay passes
  gsap.set(mobileMenu, { display: "flex", opacity: 0, pointerEvents: "none" });

  // Expand menu bg immediately
  if (menuBg) {
    gsap.set(menuBg, { height: getBgClosedHeight() }); // ensure starting point
    gsap.to(menuBg, { height: BG_OPEN, duration: 0.5, ease: "power2.out" });
  }

  // Wait 1s, then fade in menu + animate contents
  gsap.timeline({ defaults: { overwrite: true } })
    .to({}, { duration: .3 }) // ✅ wait 1s
    .to(mobileMenu, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => gsap.set(mobileMenu, { pointerEvents: "auto" })
    })
    .fromTo('.nav_menu_bg_gradient', { opacity: 0 }, {
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    }, "<")
    .fromTo('.menu-link-container, .mobile-dropdown-menu .button', {
      opacity: 0,
      yPercent: 10
    }, {
      opacity: 1,
      yPercent: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power2.out'
    }, "<");
}

function closeMenu({ onClosed } = {}) {
  if (!isMenuOpen()) {
    if (typeof onClosed === "function") onClosed();
    return;
  }

  // Prevent race conditions
  gsap.killTweensOf(mobileMenu);
  gsap.killTweensOf(menuBg);

  // ✅ CLOSE order:
  // 1) fade menu 1->0
  // 2) collapse menu-navbar-bg LAST
  // 3) then remove w--open + display none + unlock scroll
  const tl = gsap.timeline({ defaults: { overwrite: true } });

  tl.to(mobileMenu, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out"
  });

  if (menuBg) {
    tl.to(menuBg, {
      height: getBgClosedHeight(),
      duration: 0.4,
      ease: "power2.inOut"
    });
  }

  tl.add(() => {
    menuNavBar.classList.remove("w--open");
    gsap.set(mobileMenu, { display: "none", pointerEvents: "none" });

    // Restore scroll AFTER everything is visually closed
    unlockScroll();

    if (typeof onClosed === "function") onClosed();
  });
}

// --------------------
// Toggle button
// --------------------
trigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (isMenuOpen()) closeMenu();
  else openMenu();
});

// Optional: click outside to close
document.addEventListener("click", (e) => {
  if (!isMenuOpen()) return;
  const clickedInsideMenu = mobileMenu?.contains(e.target);
  const clickedTrigger = trigger?.contains(e.target);
  if (!clickedInsideMenu && !clickedTrigger) closeMenu();
});

// --------------------
// Close + scroll to section
// --------------------
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href") || "";
    const isHashLink = href.startsWith("#");

    // If it's not a hash link, let Webflow do normal navigation
    if (!isHashLink) return;

    e.preventDefault();
    e.stopPropagation();

    const target = document.querySelector(href);

    closeMenu({
      onClosed: () => scrollToSection(target, LINK_SCROLL_OFFSET)
    });
  });
});





    /* Menu HIDE/REVEAL w/ Scroll */
    let lastScrollTop = 0;
    const navComponent = document.querySelector(".navbar_component");

    if (!navComponent) {
        console.warn("navComponent not found.");
        return;
    }

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isOpen = menuNavBar.classList.contains("w--open");

        if (!isOpen) {
            if (scrollTop > lastScrollTop && scrollTop > 10) {
                let navHeight = navComponent.offsetHeight;
                navComponent.style.top = `-${16 + navHeight}px`;
            } else {
                navComponent.style.top = "0";
            }
        }

        if (scrollTop > 50 && !isOpen) {
            navComponent.classList.add("scrolled");
        } else {
            navComponent.classList.remove("scrolled");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Run scroll logic on load in case page is opened mid-scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll);



});