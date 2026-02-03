function loadPartial(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(err));
}

function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", function () {
    menu.classList.remove("show");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("site-header", "/partials/header.html", initMobileMenu);
  loadPartial("site-footer", "/partials/footer.html");
});
