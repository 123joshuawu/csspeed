var timeElapsed = 0;
var timer = null;
var badRegex = false; 

const urlParams = new URLSearchParams(window.location.search);
const shapeType = urlParams.get('shape')

const baseShapeText = "width:100px;\nheight:100px;\nbackground:black;\n";

const playTargetShapeContainer = document.getElementById(
  "play-target-shape-container"
);
const playPlaygroundContainer = document.getElementById(
  "play-playground-container"
);

const shapeGenerators = {
  random: () => {return `<div style="border-radius:50%;height:90px;width:90px;background:purple;border:1px solid red;"></div>`},
  circle: () => {return `<div style="border-radius:50%;height:90px;width:90px;background:purple;border:1px solid red;"></div>`},
  rectangle: () => {return `<div style="border-radius:50%;height:90px;width:90px;background:purple;border:1px solid red;"></div>`},
};

function getShapeHtml() {
  return shapeGenerators[shapeType]
}

function startTimer() {
  return setInterval(function () {
    timeElapsed++;
    document.getElementById(
      "play-time-text"
    ).innerHTML = `${timeElapsed} seconds elapsed`;
  }, 1000);
}

function updatePlaygroundItem() {
  var textarea = $("#play-code-textarea")
  if(textarea.val().match(/\d+\s*(em|rem)/)) {
    badRegex = true
    textarea.css({
      "color": "red"
    })
    alert("Hey... don't type that");
  } else {
    badRegex = false

    textarea.css({
      "color": "black"
    })

    $("#play-playground-item").css(
      parseCssStringToObject($("#play-code-textarea").val())
    );
  }
}

function resetCodeTextarea() {
  badRegex = false

  $("#play-code-textarea").val(
    "width:100px;\nheight:100px;\nbackground:black;\n"
  );

  updatePlaygroundItem();
}

function parseCssStringToObject(str) {
  return str
    .replace("\n", "")
    .split(";")
    .map((keyValue) => keyValue.split(":").map((s) => s.trim()))
    .filter(
      ([key, value]) => key && value && key.length > 0 && value.length > 0
    )
    .reduce((o, [key, value]) => Object.assign(o, { [key]: value }), {});
}

function getScore() {
  return 0;
}

function main() {

  timer = startTimer();

  $("#play-code-textarea").bind("input propertychange", updatePlaygroundItem);

  resetCodeTextarea();

  $("#play-target-shape-container").html(getShapeHtml());
}

function finish() {

  if(badRegex) {
    alert("CSS input contains bad values")
    return
  }
  clearInterval(timer);

  //set to localStorage
  var prevScores = JSON.parse(localStorage.getItem("scores"))
  const newScore = {points: getScore(), seconds: timeElapsed, shape: shapeType}
  if(prevScores) {
    prevScores.push(newScore)
  } else {
    prevScores = [newScore]
  }
  localStorage.setItem("scores",JSON.stringify(prevScores))

  window.location.href = "index.html"
}

$(document).ready(main);
