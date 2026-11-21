/**
 * RYUTA SAKAMOTO (RS09) — BLUE EDITORIAL PLAYGROUND SCRIPT
 * Lightweight GPU-accelerated gimmicks:
 * 1. Interactive Morphing Cursor with Dynamic Action Labels
 * 2. Magnetic Buttons & 3D Perspective Card Tilt
 * 3. Scroll Parallax & Progress Bar
 * 4. Kinetic Character Scramble on Hover / Section View
 * 5. Suki-Bare Vibe Switcher, PLACEAT Live Roulette & AutoCalc Score Simulator
 */

(function () {
  "use strict";

  /* ==========================================================
     1. INTERACTIVE MORPHING CURSOR
  ========================================================== */
  const cursorDot = document.getElementById("cursor-dot");
  const cursorFollower = document.getElementById("cursor-follower");
  const cursorLabel = document.getElementById("cursor-label");

  if (cursorDot && cursorFollower && window.matchMedia("(hover: hover)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let folX = mouseX;
    let folY = mouseY;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    const renderCursor = () => {
      folX += (mouseX - folX) * 0.18;
      folY += (mouseY - folY) * 0.18;
      cursorFollower.style.transform = `translate3d(${folX}px, ${folY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Attach morph labels to interactive elements
    const cursorTargets = document.querySelectorAll("[data-cursor], a, button");
    cursorTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const text = el.getAttribute("data-cursor") || "CLICK";
        if (cursorLabel) cursorLabel.textContent = text;
        cursorFollower.classList.add("is-active");
        cursorDot.classList.add("is-hidden");
      });
      el.addEventListener("mouseleave", () => {
        cursorFollower.classList.remove("is-active");
        cursorDot.classList.remove("is-hidden");
      });
    });
  }

  /* ==========================================================
     2. MAGNETIC BUTTONS & 3D PERSPECTIVE TILT
  ========================================================== */
  if (window.matchMedia("(hover: hover)").matches) {
    // Magnetic pull effect
    const magnetics = document.querySelectorAll(".magnetic");
    magnetics.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.28}px, 0)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate3d(0, 0, 0)";
      });
    });

    // 3D Tilt on visual cards
    const tiltTargets = document.querySelectorAll(".tilt-target");
    tiltTargets.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        const rotX = relY * -8;
        const rotY = relX * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ==========================================================
     3. KINETIC TEXT SCRAMBLE GIMMICK
  ========================================================== */
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//+*";
  function scrambleText(el) {
    const original = el.getAttribute("data-scramble") || el.textContent;
    if (el.dataset.scrambling === "true") return;
    el.dataset.scrambling = "true";

    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, idx) => {
          if (ch === " ") return " ";
          if (idx < iteration) return original[idx];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      iteration += 1 / 2;
      if (iteration >= original.length) {
        clearInterval(interval);
        el.textContent = original;
        el.dataset.scrambling = "false";
      }
    }, 24);
  }

  document.querySelectorAll("[data-scramble]").forEach((el) => {
    el.addEventListener("mouseenter", () => scrambleText(el));
  });

  /* ==========================================================
     4. SCROLL REVEAL, PROGRESS BAR & PARALLAX
  ========================================================== */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            const scrambler = entry.target.querySelector("[data-scramble]");
            if (scrambler) scrambleText(scrambler);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in-view"));
  }

  const progressBar = document.getElementById("scroll-progress-bar");
  const parallaxEls = document.querySelectorAll("[data-parallax]");

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressBar) {
        progressBar.style.width = `${(scrollY / maxScroll) * 100}%`;
      }

      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0");
        el.style.transform = `translate3d(${scrollY * speed}px, 0, 0)`;
      });
    },
    { passive: true }
  );

  /* ==========================================================
     5. SUKI-BARE VIBE SWITCHER GIMMICK
  ========================================================== */
  const vibeData = {
    sunset: {
      type: "VIBE: SUNSET EMOTIONAL // 午前5時の潮風に本音を預ける旅人",
      spot: "提案スポット：<strong>驫木駅（青森県）</strong> — 目の前に日本海だけが広がる木造の無人駅",
    },
    retro: {
      type: "VIBE: SHOWA NOSTALGIA // 時間の堆積と路地裏の体温を愛する旅人",
      spot: "提案スポット：<strong>肘折温泉（山形県）</strong> — 湯治場の風情と朝市が息づくカルデラの隠れ温泉郷",
    },
    silence: {
      type: "VIBE: SILENCE & MINIMAL // 余白と静けさの中で思考を整える旅人",
      spot: "提案スポット：<strong>奈義町現代美術館（岡山県）</strong> — 光と建築の幾何学が静かに交差する空間",
    },
  };

  const vibeTabs = document.querySelectorAll(".vibe-tab");
  const vrCard = document.getElementById("vibe-result-card");
  const vrType = document.getElementById("vr-type");
  const vrSpot = document.getElementById("vr-spot");

  vibeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      vibeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.getAttribute("data-vibe") || "sunset";
      const data = vibeData[key];
      if (data && vrType && vrSpot && vrCard) {
        vrCard.style.opacity = "0";
        vrCard.style.transform = "translateY(4px)";
        setTimeout(() => {
          vrType.textContent = data.type;
          vrSpot.innerHTML = data.spot;
          vrCard.style.opacity = "1";
          vrCard.style.transform = "translateY(0)";
        }, 140);
      }
    });
  });

  /* ==========================================================
     6. INTERACTIVE PLACEAT MINI-ROULETTE (16 GENRES)
  ========================================================== */
  const genres = [
    { emoji: "🍣", name: "寿司 (SUSHI)" },
    { emoji: "🍜", name: "ラーメン (RAMEN)" },
    { emoji: "🥩", name: "焼肉 (YAKINIKU)" },
    { emoji: "🍝", name: "イタリアン (ITALIAN)" },
    { emoji: "🍱", name: "和食 (WASHOKU)" },
    { emoji: "🥟", name: "中華 (CHINESE)" },
    { emoji: "🍛", name: "カレー (CURRY)" },
    { emoji: "🍲", name: "鍋 (HOT POT)" },
    { emoji: "串", name: "焼き鳥 (YAKITORI)" },
    { emoji: "🥩", name: "ステーキ (STEAK)" },
    { emoji: "🦐", name: "海鮮 (SEAFOOD)" },
    { emoji: "🍤", name: "天ぷら (TEMPURA)" },
    { emoji: "🥞", name: "お好み焼き (OKONOMIYAKI)" },
    { emoji: "🍔", name: "ファストフード (BURGER)" },
    { emoji: "🥘", name: "洋食 (WESTERN)" },
    { emoji: "🍜", name: "アジア・エスニック (ASIAN)" },
  ];

  const rouletteBtn = document.getElementById("roulette-trigger");
  const rouletteEmoji = document.getElementById("roulette-emoji");
  const rouletteGenre = document.getElementById("roulette-genre");
  const rouletteBox = document.getElementById("roulette-box");
  let isSpinning = false;

  if (rouletteBtn && rouletteEmoji && rouletteGenre) {
    rouletteBtn.addEventListener("click", () => {
      if (isSpinning) return;
      isSpinning = true;
      rouletteBtn.textContent = "SPINNING...";

      let ticks = 0;
      const totalTicks = 14;
      const timer = setInterval(() => {
        const pick = genres[Math.floor(Math.random() * genres.length)];
        rouletteEmoji.textContent = pick.emoji;
        rouletteGenre.textContent = pick.name;
        if (rouletteBox) {
          rouletteBox.style.transform = ticks % 2 === 0 ? "scale(1.02)" : "scale(0.98)";
        }
        ticks++;
        if (ticks >= totalTicks) {
          clearInterval(timer);
          isSpinning = false;
          if (rouletteBox) rouletteBox.style.transform = "scale(1)";
          rouletteBtn.textContent = "SPIN ROULETTE ↻";
        }
      }, 65);
    });
  }

  /* ==========================================================
     7. INTERACTIVE AUTOCALC SCORE TRANSITION SIMULATOR
  ========================================================== */
  const scoreBtn = document.getElementById("score-sim-btn");
  const board = document.getElementById("mahjong-board");
  const scorePresets = [
    [36000, 24000, 22000, 18000],
    [44000, 24000, 14000, 18000],
    [32000, 36000, 14000, 18000],
    [28000, 32000, 26000, 14000],
  ];
  let presetIndex = 0;

  if (scoreBtn && board) {
    const scoreEls = board.querySelectorAll(".wind-score");
    scoreBtn.addEventListener("click", () => {
      presetIndex = (presetIndex + 1) % scorePresets.length;
      const nextScores = scorePresets[presetIndex];
      scoreEls.forEach((el, idx) => {
        el.textContent = nextScores[idx].toLocaleString();
        el.style.color = idx === presetIndex % 4 ? "#00D2FF" : "#ffffff";
        el.style.transform = idx === presetIndex % 4 ? "scale(1.12)" : "scale(1)";
        setTimeout(() => {
          el.style.color = "#ffffff";
          el.style.transform = "scale(1)";
        }, 450);
      });
    });
  }

  /* ==========================================================
     8. FOOTER YEAR
  ========================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
