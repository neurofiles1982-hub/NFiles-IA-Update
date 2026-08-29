(() => {
  const config = window.NEUROFILES_SITE_CONFIG || {};
  const release = config.installerDownloadUrl || config.releasePageUrl || "#";
  document.querySelectorAll("[data-release]").forEach((link) => { link.href = release; });
  const email = String(config.supportEmail || "nfilesia@gmail.com");
  const emailLink = document.querySelector("#email");
  if (emailLink) { emailLink.href = `mailto:${email}`; emailLink.textContent = email; }
  const whatsapp = document.querySelector("#whatsapp");
  if (whatsapp) whatsapp.href = config.purchaseUrl || "https://wa.me/5515998516105";
})();
