/* ebio.gg clone — shell behaviour */
(function () {
  const root = document.documentElement;
  const KEY_MODE = "mode-watcher-mode";
  const KEY_THEME = "mode-watcher-theme";

  // theme restore (mirrors the captured mode-watcher bootstrap)
  const savedMode = localStorage.getItem(KEY_MODE) || "dark";
  const savedTheme = localStorage.getItem(KEY_THEME) || "";
  applyMode(savedMode);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function applyMode(mode) {
    const light = mode === "light";
    root.classList.toggle("dark", !light);
    root.style.colorScheme = light ? "light" : "dark";
    localStorage.setItem(KEY_MODE, mode);
    document.querySelectorAll("[data-mode-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(light));
      b.title = light ? "Switch to dark" : "Switch to light";
    });
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-mode-toggle]");
    if (t) {
      applyMode(root.classList.contains("dark") ? "light" : "dark");
      return;
    }
    const collapse = e.target.closest("[data-collapse], [data-sidebar='trigger'], [data-slot='sidebar-trigger']");
    if (collapse) {
      document.body.classList.toggle("collapsed");
      const isCollapsed = document.body.classList.contains("collapsed");
      localStorage.setItem("ebio-collapsed", isCollapsed ? "1" : "0");
      document.querySelectorAll("[data-slot='sidebar']").forEach((s) => {
        s.setAttribute("data-state", isCollapsed ? "collapsed" : "expanded");
      });
      return;
    }
    const menu = e.target.closest("[data-menu]");
    if (menu) { document.body.classList.toggle("nav-open"); return; }
    if (e.target.closest(".scrim")) { document.body.classList.remove("nav-open"); }
  });

  if (localStorage.getItem("ebio-collapsed") === "1") {
    document.body.classList.add("collapsed");
    document.querySelectorAll("[data-slot='sidebar']").forEach((s) => {
      s.setAttribute("data-state", "collapsed");
    });
  }

  // switches
  document.querySelectorAll(".switch").forEach((s) => {
    s.setAttribute("role", "switch");
    s.setAttribute("aria-checked", s.dataset.on === "true" ? "true" : "false");
    s.addEventListener("click", () => {
      s.setAttribute("aria-checked", s.getAttribute("aria-checked") === "true" ? "false" : "true");
    });
  });

  // workspace switcher
  const ws = document.getElementById("workspace-select");
  if (ws) {
    ws.addEventListener("change", () => {
      if (ws.value === "__add__") { ws.value = "xox"; location.href = "workspace.html"; }
    });
  }

  // copy buttons
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        const old = b.textContent;
        b.textContent = "Copied";
        setTimeout(() => (b.textContent = old), 1200);
      } catch (_) {}
    });
  });

  // cookie banner
  const cookie = document.querySelector(".cookie");
  if (cookie && !localStorage.getItem("ebio-cookie")) {
    cookie.classList.remove("hide");
    cookie.querySelectorAll("[data-cookie]").forEach((b) =>
      b.addEventListener("click", () => {
        localStorage.setItem("ebio-cookie", b.dataset.cookie);
        cookie.classList.add("hide");
      })
    );
  } else if (cookie) {
    cookie.classList.add("hide");
  }

  // fake save feedback
  document.querySelectorAll("[data-save]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = f.querySelector("[type=submit]");
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = "Saved";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1400);
    })
  );
})();
