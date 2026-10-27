// Set the palette before the page paints; storage is optional.
(function () {
  var theme;
  try { theme = localStorage.getItem("portfolio-theme"); } catch (error) { /* Use the system preference. */ }
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.dataset.theme = theme;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#dbc2ab" : "#192325");
}());
