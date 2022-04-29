export default function fetchFace() {
  fetch("./assets/face2.svg")
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      document.querySelector(".svg-container").innerHTML = data;
    });
}
