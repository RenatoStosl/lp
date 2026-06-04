/* ============================================================
   Renato Lourenço — interações
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header: sombra ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("menuToggle");
  var mobile = document.getElementById("mobileMenu");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- FAQ acordeão ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var ans = item.querySelector(".faq-a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // fecha os outros
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        ans.style.maxHeight = null;
      } else {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        ans.style.maxHeight = ans.scrollHeight + "px";
      }
    });
  });

  /* ---------- Reveal no scroll (com fallback robusto) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("in");
        revealEls.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals, { passive: true });
  window.addEventListener("load", checkReveals);
  checkReveals();
  // garante visibilidade mesmo se algo falhar
  setTimeout(checkReveals, 300);
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800)) el.classList.add("in");
    });
  }, 1200);

  /* ---------- Capturas reais dos sites (mShots) ----------
     mShots devolve um placeholder pequeno enquanto gera o print.
     Recarregamos até a imagem real (larga) chegar. ------------ */
  function loadShot(img) {
    var base = img.getAttribute("data-shot");
    var tries = 0;
    var MAX = 14;

    function attempt() {
      tries++;
      img.src = tries === 1 ? base : base + "&cb=" + Date.now();
    }

    img.addEventListener("load", function () {
      // mShots devolve um placeholder de ~400px enquanto gera. Tenta de novo.
      if (img.naturalWidth > 0 && img.naturalWidth <= 400 && tries < MAX) {
        setTimeout(attempt, 3000);
      } else {
        img.classList.add("is-loaded");
        var skel = img.parentNode.querySelector(".shot-skeleton");
        if (skel) skel.style.display = "none";
      }
    });

    img.addEventListener("error", function () {
      if (tries < MAX) setTimeout(attempt, 3000);
    });

    attempt();
  }

  document.querySelectorAll("img.shot").forEach(loadShot);

  /* ---------- Ano no footer (caso queira dinâmico) ---------- */
  // mantido estático em 2026 no HTML.
})();
