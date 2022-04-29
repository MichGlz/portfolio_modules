function closeEyes() {
  document.querySelector("#eyes").classList.replace("active", "hide");
  document.querySelector("#close-eyes").classList.replace("hide", "active");
}

function openEyes() {
  document.querySelector("#close-eyes").classList.replace("active", "hide");
  document.querySelector("#eyes").classList.replace("hide", "active");
}

function eyeMove(e) {
  const eyes = document.querySelectorAll(".eyeball");
  eyes.forEach((eye) => {
    const windowY = window.scrollY;
    let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
    let y = eye.getBoundingClientRect().top + windowY + eye.clientHeight / 2;

    let radian = Math.atan2(e.pageX - x, e.pageY - y);
    let rotation = radian * (180 / Math.PI) * -1 + 270;
    eye.style.transform = `rotate(${rotation}deg)`;
  });
}

export { closeEyes, openEyes, eyeMove };
