/* =========================================================
   LOGIA — shared interactions
   stagger reveal · tab underline · modal · sentiment fill
   Vanilla JS, no deps. Subtle, never noisy.
   ========================================================= */
(function () {
  "use strict";

  /* ---- Stagger reveal on scroll ---- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // stagger within a shared group
          const group = el.closest("[data-stagger]");
          if (group && !group.__staggered) {
            group.__staggered = true;
            const kids = group.querySelectorAll(".reveal");
            kids.forEach((k, i) =>
              k.style.setProperty("--rv-delay", i * 70 + "ms")
            );
          }
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---- Animated sentiment / progress fills ---- */
  function initFills() {
    const bars = document.querySelectorAll("[data-fill]");
    if (!bars.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        requestAnimationFrame(() => {
          el.style.width = el.dataset.fill + "%";
        });
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => {
      b.style.width = "0%";
      io.observe(b);
    });
  }

  /* ---- Sliding tab underline ---- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((wrap) => {
      const ink = wrap.querySelector(".tab-ink");
      const tabs = [...wrap.querySelectorAll("[data-tab]")];
      function move(el) {
        if (!ink || !el) return;
        ink.style.left = el.offsetLeft + "px";
        ink.style.width = el.offsetWidth + "px";
      }
      function activate(el) {
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === el);
          t.setAttribute("aria-selected", t === el ? "true" : "false");
        });
        move(el);
        const target = el.dataset.tab;
        if (target) {
          document.querySelectorAll("[data-panel]").forEach((p) => {
            p.hidden = p.dataset.panel !== target;
          });
        }
      }
      tabs.forEach((t) =>
        t.addEventListener("click", () => activate(t))
      );
      const init = wrap.querySelector("[data-tab].is-active") || tabs[0];
      // wait a tick for layout
      requestAnimationFrame(() => move(init));
      window.addEventListener("resize", () => {
        const cur = wrap.querySelector("[data-tab].is-active") || tabs[0];
        move(cur);
      });
    });
  }

  /* ---- Filter chips (article tags) ---- */
  function initFilters() {
    document.querySelectorAll("[data-filter-group]").forEach((group) => {
      const chips = [...group.querySelectorAll("[data-filter]")];
      const scope = document.querySelector(
        group.dataset.filterTarget || "[data-filter-list]"
      );
      chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          chips.forEach((c) => c.classList.toggle("is-active", c === chip));
          const f = chip.dataset.filter;
          if (!scope) return;
          scope.querySelectorAll("[data-tags]").forEach((item) => {
            const show = f === "all" || (item.dataset.tags || "").split(",").includes(f);
            item.style.display = show ? "" : "none";
          });
        });
      });
    });
  }

  /* ---- Article summary modal ---- */
  function initModal() {
    const modal = document.getElementById("article-modal");
    if (!modal) return;
    const body = modal.querySelector("[data-modal-body]");
    function open(data) {
      body.innerHTML = `
        <div class="kv" data-label="KEY VISUAL · ${data.game || ""}"
             style="height:230px;border-radius:18px;margin-bottom:20px;"></div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
          <span class="badge badge-blue">${data.tag || "뉴스"}</span>
          <span style="color:var(--muted);font-size:.82rem;">${data.game || ""} · ${data.time || ""}</span>
        </div>
        <h2 style="font-size:1.6rem;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin:0 0 14px;">${data.title || ""}</h2>
        <p class="lede-body" style="font-size:1rem;margin:0 0 22px;">${data.summary || ""}</p>
        <a class="btn btn-primary" href="#" style="text-decoration:none;">원문 보기 →</a>`;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
    document.querySelectorAll("[data-article]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        open({
          game: el.dataset.game,
          tag: el.dataset.tag,
          time: el.dataset.time,
          title: el.dataset.title,
          summary: el.dataset.summary,
        });
      });
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-modal-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---- Live clock for the masthead ---- */
  function initClock() {
    const el = document.querySelector("[data-clock]");
    if (!el) return;
    function tick() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      el.textContent = hh + ":" + mm;
    }
    tick();
    setInterval(tick, 15000);
  }

  function boot() {
    initReveal();
    initFills();
    initTabs();
    initFilters();
    initModal();
    initClock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
