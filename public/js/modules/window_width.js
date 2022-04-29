export default function windowWidth(root) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vwFactor = vw > 1700 ? 1700 / vw : 1;

  root.style.setProperty("--factor", vwFactor);
}
