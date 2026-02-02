function loadPartial(id, file) {
  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error(file + " not found");
      return res.text();
    })
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("site-header", "/partials/header.html");
  loadPartial("site-footer", "/partials/footer.html");
});