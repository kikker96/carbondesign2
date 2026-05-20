document.addEventListener("DOMContentLoaded", () => {

  // ── 1. Register Plugin ──────────────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── 2. Navbar Scroll Effect ─────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("nav-scrolled", window.scrollY > 50);
  }, { passive: true });

  // ── 2b. Scroll Hint — hide on first scroll ──────────────────────────────────
  const scrollHint = document.querySelector(".scroll-hint");
  if (scrollHint) {
    const hideScrollHint = () => {
      scrollHint.classList.add("hidden");
      window.removeEventListener("scroll", hideScrollHint);
    };
    window.addEventListener("scroll", hideScrollHint, { passive: true });
  }

  // ── 3. Hero Video Scrubber (rAF smoothing) ──────────────────────────────────
  const heroVideo = document.getElementById("hero-video");

  if (heroVideo) {
    if (window.innerWidth > 768) {
      heroVideo.autoplay = false;
      heroVideo.removeAttribute("autoplay");

      let heroDuration = 0;
      let heroTargetTime = 0;
      let heroCurrentTime = 0;

      heroVideo.addEventListener("loadedmetadata", () => {
        heroDuration = heroVideo.duration;
      });

      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          heroTargetTime = self.progress * heroDuration;
        },
      });

      function heroRafLoop() {
        heroCurrentTime += (heroTargetTime - heroCurrentTime) * 0.12;
        if (Math.abs(heroTargetTime - heroCurrentTime) > 0.001) {
          heroVideo.currentTime = heroCurrentTime;
        }
        requestAnimationFrame(heroRafLoop);
      }
      heroRafLoop();
    } else {
      heroVideo.setAttribute("autoplay", "");
      heroVideo.removeAttribute("loop");
      heroVideo.play().catch(() => {});
      heroVideo.playbackRate = 3.0;
      heroVideo.addEventListener("ended", () => {
        heroVideo.currentTime = heroVideo.duration;
        heroVideo.pause();
      });
      const scrollHintMobile = document.querySelector(".scroll-hint");
      if (scrollHintMobile) scrollHintMobile.classList.add("hidden");
    }
  }

  // ── 4. Hero Text Entrance ───────────────────────────────────────────────────
  gsap.fromTo(".hero-headline",
    { opacity: 0, y: 80, skewY: 3 },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1.4,
      ease: "power4.out",
      scrollTrigger: { trigger: "#hero-text", start: "top 65%" },
    }
  );

  gsap.fromTo(".hero-subline",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: { trigger: "#hero-text", start: "top 65%" },
    }
  );

  gsap.fromTo(".hero-cta",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: "#hero-text", start: "top 65%" },
    }
  );

  // ── 5. Services Section Reveal ──────────────────────────────────────────────
  gsap.to(".section-divider", {
    scaleX: 1,
    duration: 1.2,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#servizi",
      start: "top 70%",
    },
  });

  gsap.fromTo(".service-card",
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 75%",
      },
    }
  );

  // ── 6. Value Props Reveal ───────────────────────────────────────────────────
  gsap.fromTo(".value-prop",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#perche-content",
        start: "top 75%",
      },
    }
  );

  // ── 7. Processo — Neon Line + Step Reveals ──────────────────────────────────
  const neonLine = document.getElementById("neon-line");
  const processoContainer = document.querySelector(".processo-container");

  function initProcessoLine() {
    if (!neonLine || !processoContainer) return;
    const totalLength = processoContainer.offsetHeight;
    neonLine.setAttribute("stroke-dasharray", totalLength);
    neonLine.setAttribute("stroke-dashoffset", totalLength);

    ScrollTrigger.getAll()
      .filter(st => st.vars && st.vars._processoLine)
      .forEach(st => st.kill());

    gsap.to(neonLine, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".processo-container",
        start: "top 60%",
        end: "bottom 60%",
        scrub: 1,
        id: "_processoLine",
      },
    });
  }

  // Step node glow on enter
  document.querySelectorAll(".step-node").forEach((node) => {
    gsap.to(node, {
      opacity: 1,
      duration: 0.4,
      scrollTrigger: {
        trigger: node.closest(".process-step"),
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Process card + number slide in
  document.querySelectorAll(".process-step").forEach((step) => {
    gsap.fromTo(step.querySelector(".process-card"),
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: step,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );
    gsap.fromTo(step.querySelector(".step-num"),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: step,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  window.addEventListener("resize", initProcessoLine);
  setTimeout(initProcessoLine, 100);

  // ── 8. Section Title Parallax ───────────────────────────────────────────────
  gsap.utils.toArray(".section-title").forEach(title => {
    const section = title.closest("section");
    gsap.to(title, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: section || title,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // ── 8b. Section Label Clip-Path Reveal ─────────────────────────────────────
  gsap.utils.toArray(".section-label").forEach(label => {
    gsap.to(label, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: label,
        start: "top 80%",
      },
    });
  });

  // ── 9. Contact Section Reveal ───────────────────────────────────────────────
  gsap.from("#contatto .section-title", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#contatto",
      start: "top 75%",
    },
  });

  gsap.from(".contatto-sub", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2,
    scrollTrigger: {
      trigger: "#contatto",
      start: "top 75%",
    },
  });

  gsap.from(".contact-cta-btn", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.4,
    scrollTrigger: {
      trigger: "#contatto",
      start: "top 75%",
    },
  });

  // ── 10. Language Toggle ─────────────────────────────────────────────────────
  let currentLang = "it";

  function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll("[data-it][data-en]").forEach(el => {
      el.innerHTML = el.dataset[lang];
    });

    document.querySelectorAll("[data-it-placeholder][data-en-placeholder]").forEach(el => {
      el.placeholder = lang === "it"
        ? el.dataset.itPlaceholder
        : el.dataset.enPlaceholder;
    });
  }

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      setLanguage(lang);
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  setLanguage("it");

  // ── 11. Smooth Anchor Scroll ────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetSelector = anchor.getAttribute("href");
      if (targetSelector === "#") return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      e.preventDefault();

      if (gsap.plugins && gsap.plugins.scrollTo) {
        gsap.to(window, {
          scrollTo: target,
          duration: 1.2,
          ease: "power3.inOut",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ── 12. Perché Noi Video Scrubber (rAF smoothing) ───────────────────────────
  const ambientVideo = document.getElementById("ambient-video");

  if (ambientVideo) {
    if (window.innerWidth > 768) {
      let ambientTargetTime = 0;
      let ambientCurrentTime = 0;

      ambientVideo.addEventListener("loadedmetadata", () => {
        const ambientDuration = ambientVideo.duration;
        ScrollTrigger.create({
          trigger: "#perche-video-scrub",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            ambientTargetTime = self.progress * ambientDuration;
          },
        });
      });

      function ambientRafLoop() {
        ambientCurrentTime += (ambientTargetTime - ambientCurrentTime) * 0.12;
        if (Math.abs(ambientTargetTime - ambientCurrentTime) > 0.001) {
          ambientVideo.currentTime = ambientCurrentTime;
        }
        requestAnimationFrame(ambientRafLoop);
      }
      ambientRafLoop();

      gsap.to(".perche-sticky", {
        opacity: 0,
        scrollTrigger: {
          trigger: "#perche-video-scrub",
          start: "90% top",
          end: "bottom top",
          scrub: true,
        },
      });
    } else {
      ambientVideo.setAttribute("autoplay", "");
      ambientVideo.setAttribute("loop", "");
      ambientVideo.play().catch(() => {});
      ambientVideo.playbackRate = 2.0;
    }
  }

  // ── 13. Magnetic Cursor ─────────────────────────────────────────────────────
  const cursorDot  = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (cursorDot && cursorRing) {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function cursorLoop() {
      dotX = mouseX;
      dotY = mouseY;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      cursorDot.style.left  = dotX + "px";
      cursorDot.style.top   = dotY + "px";
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top  = ringY + "px";

      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    const hoverTargets = document.querySelectorAll(
      "a, button, .service-card, .value-card, .process-card, .lang-btn"
    );
    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursorDot.classList.add("expand");
        cursorRing.classList.add("expand");
      });
      el.addEventListener("mouseleave", () => {
        cursorDot.classList.remove("expand");
        cursorRing.classList.remove("expand");
      });
    });
  }

  // ── 14. Floating Particles ──────────────────────────────────────────────────
  const canvas = document.getElementById("particles-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0;
    const PARTICLE_COUNT = 60;
    const particles = [];

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = rect.width;
      H = canvas.height = rect.height;
    }

    function createParticle() {
      return {
        x:    Math.random() * W,
        y:    Math.random() * H,
        vx:   (Math.random() - 0.5) * 0.4,
        vy:   (Math.random() - 0.5) * 0.4,
        r:    Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
      };
    }

    resizeCanvas();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    window.addEventListener("resize", resizeCanvas, { passive: true });

    function particleLoop() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(particleLoop);
    }
    particleLoop();
  }

});
