var timeElapsed = 0;
var timer = null;

const baseShapeText = "width:100px;\nheight:100px;\nbackground:black;\n";

const playTargetShapeContainer = document.getElementById(
  "play-target-shape-container"
);
const playPlaygroundContainer = document.getElementById(
  "play-playground-container"
);

const shapeGenerators = {
  circle: generateCircleHtml,
};

function generateCircleHtml() {
  return `<div style="border-radius:50%;height:90px;width:90px;background:purple;border:1px solid red;"></div>`;
}

function getShapeHtml() {
  return generateCircleHtml();
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
  $("#play-playground-item").css(
    parseCssStringToObject($("#play-code-textarea").val())
  );
}

function resetCodeTextarea() {
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

function main() {
  timer = startTimer();

  $("#play-code-textarea").bind("input propertychange", updatePlaygroundItem);

  resetCodeTextarea();

  $("#play-target-shape-container").html(getShapeHtml());
}

function finish() {
  clearInterval(timer);

  alert(`${timeElapsed}`);
}

$(document).ready(main);
