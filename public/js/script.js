"use strict";

import { randomColorGenerator } from "./modules/random_color.js";
import windowWidth from "./modules/window_width.js";
import fetchFace from "./modules/fetch_face.js";
import checkIsMobile from "./modules/check_isMobile.js";
import { closeEyes, openEyes, eyeMove } from "./modules/eyes_actions.js";

const root = document.documentElement;
const isMobile = checkIsMobile();

window.addEventListener("resize", () => {
  windowWidth(root);
});

windowWidth(root);
fetchFace();

const urlParams = new URLSearchParams(window.location.search);

const sms = urlParams.get("sms");

let bubbleNumber = 0; //is an index to add in the class of a bubble
let lastScrollTop;

const activeSection = {
  //record of which section is active
  about_me: false,
  projects: false,
  sandbox: false,
  contact: false,
};

const bubbleSettings = {
  isScore: false,
  bubbleCounter: 0, //score of exploeded bubbles
  bubbleLevel: 0,
};

const body = document.querySelector("body");
const orangeToggle = document.querySelector("#orange-mode");

if (!isMobile) {
  body.addEventListener("mousedown", closeEyes);
  body.addEventListener("mouseup", openEyes);
  body.addEventListener("mousemove", eyeMove);
}

document.addEventListener("scroll", scrollingChanges);
document.querySelectorAll(".box").forEach((box) => box.addEventListener("click", callSection));

orangeToggle.addEventListener("click", () => {
  if (orangeToggle.checked) {
    root.style.setProperty("--body-color", " #2d2926");
    root.style.setProperty("--background-color", "#f2aa4c");
    root.style.setProperty("--background-gradient", "radial-gradient(circle, rgba(242, 170, 76, 1) 56%, rgba(163, 118, 59, 1) 100%)");
  } else {
    root.style.setProperty("--body-color", " #2d2926");
    root.style.setProperty("--background-color", "#fff");
    root.style.setProperty("--background-gradient", "#fff");
  }
});

function scrollingChanges(e) {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const arrow = document.querySelector("#arrow");
  if (st > lastScrollTop) {
    document.querySelectorAll(".face").forEach((face) => {
      face.classList.remove("active");
      face.classList.add("hide");
    });
    document.querySelectorAll(".faceup").forEach((face) => {
      face.classList.add("active");
      face.classList.remove("hide");
    });
    if (document.querySelectorAll(".bubble-sprit").length < 20) {
      const bubblesContainer = document.querySelector(".bubbles-container");
      bubbleFactory(bubblesContainer);
    }

    arrow.style.backgroundImage = "url(./assets/arrow-up.svg)";
    arrow.href = "#header";
  } else {
    document.querySelectorAll(".face").forEach((face) => {
      face.classList.add("active");
      face.classList.remove("hide");
    });
    document.querySelectorAll(".faceup").forEach((face) => {
      face.classList.remove("active");
      face.classList.add("hide");
    });
    if (st < 20) {
      arrow.style.backgroundImage = "url(./assets/arrow-down.svg)";
      arrow.href = "#quote";
    }
  }
  lastScrollTop = window.pageYOffset;
}

function chekingScore() {
  if (!bubbleSettings.isScore) {
    bubbleSettings.isScore = true;
    document.getElementById("bubble-counter").style.opacity = "1";
  }
  bubbleSettings.bubbleCounter++;

  if (bubbleSettings.bubbleCounter >= bubbleSettings.bubbleLevel + 10) {
    root.style.setProperty("--bubble-color", randomColorGenerator());
    bubbleSettings.bubbleLevel += 10;
  }
}

function bubbleFactory(container) {
  for (let i = 1, a = 1; i <= 4; i++, a *= -1, bubbleNumber++) {
    const bubbleSprit = document.createElement("div");
    bubbleSprit.classList.add(`bubble-sprit`);
    bubbleSprit.classList.add(`bubble-${bubbleNumber}`);

    fetch("./assets/bubble2.svg")
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        bubbleSprit.innerHTML = data;
      });

    bubbleSprit.addEventListener("mouseover", explode);
    container.appendChild(bubbleSprit);

    const bubbleY = container.getBoundingClientRect().height;
    const bubbleX = (container.getBoundingClientRect().width / 2) * 0.8;

    const durationNo = 10 * (Math.random() * 3) + 3;

    const t1 = gsap.timeline({ defaults: { delay: 0.2 * i }, onComplete: removeBubble, onCompleteParams: [`.bubble-${bubbleNumber}`] });
    t1.to(`.bubble-${bubbleNumber}`, { duration: durationNo, y: -1 * bubbleY, ease: "circ.out" });
    gsap.fromTo(`.bubble-${bubbleNumber}`, { x: -a * (Math.random() * 100) }, { duration: durationNo / 4, delay: 0.2 * i, ease: "slow(0.1, 0.4, true)", x: a * (Math.random() * bubbleX) });
    gsap.to(`.bubble-${bubbleNumber}`, { rotation: 360, duration: 4 + Math.random(), ease: "none", repeat: 10 });

    function explode(e) {
      chekingScore();

      this.querySelectorAll(".bubble-part").forEach((part) => {
        if (!part.classList.contains("hide")) {
          part.classList.add("hide");
        } else {
          part.classList.remove("hide");
        }
        setTimeout(() => {
          t1.kill(`.bubble-${bubbleNumber}`);
          this.remove();
          document.querySelector("#score").textContent = bubbleSettings.bubbleCounter;
        }, 60);
      });
    }
  }
}

function removeBubble(bubble) {
  const theBubble = document.querySelector(bubble);
  if (theBubble) {
    theBubble.querySelectorAll(".bubble-part").forEach((part) => {
      if (!part.classList.contains("hide")) {
        part.classList.add("hide");
      } else {
        part.classList.remove("hide");
      }
      setTimeout(() => {
        theBubble.remove();
      }, 60);
    });
  }
}

function callSection(e) {
  console.log("callSection");
  for (const [key, value] of Object.entries(activeSection)) {
    activeSection[key] = false;
  }
  const templateID = this.dataset.section;
  activeSection[templateID] = true;
  console.log(templateID);
  const template = document.querySelector("#" + templateID).content;

  const copy = template.cloneNode(true);

  // copy.style.opacity = 0;

  const parent = document.querySelector(".sliding-sections-container");

  parent.appendChild(copy);

  if (activeSection.projects) {
    fetchProject();
  }

  if (activeSection.sandbox) {
    const imgFrame = document.querySelector(".svg-container-img");
    imgFrame.addEventListener("mousemove", eyeMove);

    function eyeMove(e) {
      const eyes = document.querySelectorAll(".eyeball_2");
      const fly = document.querySelector(".fly");
      const windowY = window.scrollY;
      let xFly = imgFrame.getBoundingClientRect().left;
      let yFly = imgFrame.getBoundingClientRect().top + windowY;
      let xPic = xFly + imgFrame.clientWidth / 2;
      let yPic = yFly + imgFrame.clientHeight / 3;
      let radianFly = Math.atan2(e.pageX - xPic, e.pageY - yPic);
      let rotationFly = radianFly * (180 / Math.PI) * -1 + 270;
      fly.style.transform = `translate(${e.pageX - xFly}px, ${e.pageY - yFly}px) rotate(${rotationFly + Math.floor(Math.random() * 10) + 90}deg)`;

      eyes.forEach((eye) => {
        let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
        let y = eye.getBoundingClientRect().top + windowY + eye.clientHeight / 2;
        let radian = Math.atan2(e.pageX - x, e.pageY - y);
        let rotation = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = `scale(1.1) rotate(${rotation}deg)`;
      });
    }
    setTimeout(() => {
      faderMachine(".sand-project");
    }, 1000);
  }

  const slidingSection = parent.querySelector(".sliding-section");
  const btnClose = parent.querySelector(".btn-close");

  setTimeout(() => {
    bubbleFactory(slidingSection);
  }, 1000);

  btnClose.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-close")) {
      slidingAnimation.reverse();
      slidingAnimation.onfinish = function () {
        document.querySelectorAll(".sliding-section .bubble-sprit").forEach((bubble) => {
          const animatedClass = bubble.classList[1];
          gsap.killTweensOf(`.${animatedClass}`);
        });

        slidingSection.remove();
      };
    }
  });

  const properties = {
    duration: 1000,
    // easing: "cubic-bezier(0.55, 0.17, 0.61, 1.45)",
    easing: "cubic-bezier(.45,.92,.26,1.19)",
    fill: "forwards",
  };

  const keyframes = [
    { transformOrigin: "center", transform: `translateY(-100%)`, opacity: 0 },
    {
      transformOrigin: "center",
      transform: `translateY(0)`,
      opacity: 1,
    },
  ];

  const slidingAnimation = slidingSection.animate(keyframes, properties);
}

function fetchProject() {
  fetch("https://reicpe-9cc2.restdb.io/rest/projects", {
    method: "GET",
    headers: {
      "x-apikey": "606d5dcef5535004310074f4",
      //"x-apikey": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.forEach((p, i, arr) => {
        displayProject(p);

        if (i + 1 === arr.length) {
          faderMachine(".project-card");
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function displayProject(project) {
  //grab the template
  const template = document.querySelector("#project-card-template").content;

  //clone
  const copy = template.cloneNode(true);
  //adjust stuff
  copy.querySelector(".project-title").textContent = project.name;
  copy.querySelector(".project-description").textContent = project.description;
  copy.querySelector(".web").href = project.link_web;
  copy.querySelector(".repo").href = project.link_github;

  copy.querySelector("img").src = imgGenerator(project.name);

  const parent = document.querySelector(".projects-container");

  parent.appendChild(copy);
}

function imgGenerator(projectName) {
  projectName = projectName.toLowerCase();
  projectName = projectName.split(" ");
  projectName = projectName.join("");
  if (projectName.includes("'")) {
    projectName = projectName.split("'");
    projectName = projectName.join("");
  }
  if (projectName.includes("ø")) {
    projectName = projectName.replace("ø", "o");
  }

  return `./assets/${projectName}.jpg`;
}

if (sms) {
  const modal = document.createElement("div");
  modal.classList.add("thanks");
  const message = document.createElement("h1");
  const content = document.createTextNode("Thank you! for your email");
  message.appendChild(content);
  modal.appendChild(message);
  const bubblesContainer = document.querySelector(".bubbles-container");
  bubblesContainer.appendChild(modal);
  for (let i = 0; i < 5; i++) {
    bubbleFactory(bubblesContainer);
  }
  setTimeout(() => {
    const modal = document.querySelector(".thanks");
    modal.addEventListener("animationend", () => {
      // Current URL: https://my-website.com/page_a
      const nextURL = "https://michgonzalez.com/";
      const nextTitle = "Mich Gonzalez";
      const nextState = { additionalInformation: "Updated the URL with JS" };

      // This will replace the current entry in the browser's history, without reloading
      window.history.replaceState(nextState, nextTitle, nextURL);

      modal.remove();
    });
    modal.classList.add("banish");
  }, 1500);
}

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -150px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
}, appearOptions);

function faderMachine(faderClass) {
  const faders = document.querySelectorAll(faderClass);

  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}
