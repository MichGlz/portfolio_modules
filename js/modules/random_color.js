//setting random color to the <input> type=color at the begain
function randomColorGenerator() {
  const rgbObject = randomNumber();

  const randomColorHex = rgbToHex(rgbObject);

  return randomColorHex;
}
//random number for randomColor
function randomNumber() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  return { r, g, b };
}

function rgbToHex(rgbObj) {
  const rgbArray = [`${rgbObj.r}`, `${rgbObj.g}`, `${rgbObj.b}`];
  let hexCode = "#";
  rgbArray.forEach((element) => {
    let n = Number(element).toString(16);
    if (n.length < 2) {
      n += "0";
    }
    hexCode += n;
  });

  return hexCode;
}

export { randomColorGenerator };
