(function () {
  const config = window.NEUROFILES_SITE_CONFIG || {};
  const version = String(config.productVersion || "8.0.2");
  const supportEmail = String(config.supportEmail || "nfilesia@gmail.com");
  const checkout = String(config.hotmartCheckoutUrl || "");
  const releasePageUrl = String(config.releasePageUrl || "");
  const installerDownloadUrl = String(config.installerDownloadUrl || releasePageUrl || "");
  const portableDownloadUrl = String(config.portableDownloadUrl || releasePageUrl || "");
  const portalUrl = String(config.portalUrl || "app.html");
  const fallbackBuyUrl = "mailto:" + supportEmail + "?subject=Neuro%20Files%20Pro%20purchase";
  const checkoutReady = checkout && !checkout.includes("SEU-CHECKOUT-AQUI");

  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  const updateHeader = () => header && header.classList.toggle("is-scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function bindHref(selector, value) {
    if (!value) {
      return;
    }
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute("href", value);
    });
  }

  document.querySelectorAll(".js-version").forEach((node) => {
    node.textContent = version;
  });
  document.querySelectorAll(".js-support-email").forEach((node) => {
    node.textContent = supportEmail;
  });
  document.querySelectorAll(".js-current-year").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  bindHref(".js-release-link", releasePageUrl);
  bindHref(".js-installer-link", installerDownloadUrl);
  bindHref(".js-portable-link", portableDownloadUrl);
  bindHref(".js-portal-link", portalUrl);

  document.querySelectorAll(".js-buy").forEach((button) => {
    button.setAttribute("href", checkoutReady ? checkout : fallbackBuyUrl);
    button.addEventListener("click", (event) => {
      if (checkoutReady) {
        return;
      }
      event.preventDefault();
      window.location.href = fallbackBuyUrl;
    });
  });

  document.querySelectorAll(".js-copy-link").forEach((button) => {
    button.addEventListener("click", async () => {
      const selector = String(button.dataset.linkSelector || "");
      const target = selector ? document.querySelector(selector) : null;
      const value = target ? String(target.getAttribute("href") || "") : "";
      if (!value) {
        return;
      }
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Link copiado";
      } catch (_error) {
        button.textContent = "Copie pelo botão ao lado";
      }
    });
  });

  const portalNav = document.querySelector(".portal-nav");
  if (portalNav && "IntersectionObserver" in window) {
    const links = Array.from(portalNav.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);

    if (sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            links.forEach((link) => {
              const active = link.getAttribute("href") === `#${entry.target.id}`;
              link.classList.toggle("is-active", active);
              if (active) {
                link.setAttribute("aria-current", "location");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0.08 }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }
})();
