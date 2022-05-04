export default function fetchFace() {
  fetch("./assets/face2.svg")
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      document.querySelector(".svg-container").innerHTML = data;
    })
    .then(function () {
      const closeEyes = document.getElementById("close-eyes");
      const openEyes = document.getElementById("eyes");
      closeEyes.classList = "eyes";
      openEyes.classList = "eyes";
      closeEyes.classList.add("hide");
      openEyes.classList.add("active");
    });
}
