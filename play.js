var timeElapsed = 0;
var timer = null;
var badRegex = false; 

function chooseOne(arr,ignore = []) {
  let filtered = arr.filter(item => !ignore.includes(item))
  return filtered[Math.floor(Math.random() * filtered.length)]
}

const urlParams = new URLSearchParams(window.location.search);
var shapeType = urlParams.get('shape')
if(shapeType == "random") {
  shapeType = chooseOne(["circle","rectangle"])
}

const baseShapeText = "width:100px;\nheight:100px;\nbackground:black;\n";

const playTargetShapeContainer = document.getElementById(
  "play-target-shape"
);
const playPlaygroundContainer = document.getElementById(
  "play-playground-container"
);

const colorOptions = ["red","orange","yellow","green","blue","purple","gray","white"]
const borderStyles = ["solid","dashed","dotted"]
var randRadius = Math.floor(Math.random()*25)+"px"
var randomCSS = {
  "background-color": chooseOne(colorOptions),
  "width": Math.floor(Math.random()*150+25)+"px",
  "height": Math.floor(Math.random()*150+25)+"px",
  "border-top-left-radius": randRadius,
  "border-top-right-radius": randRadius,
  "border-bottom-left-radius": randRadius,
  "border-bottom-right-radius": randRadius,
  "border-width": Math.floor(Math.random()*3)+"px",
  "border-style": chooseOne(borderStyles)
}
randomCSS["border-color"] = chooseOne(colorOptions,[randomCSS["background-color"]])

if(shapeType == "circle") {
  randRadius = (parseFloat(randomCSS["width"])/2)+"px"
  randomCSS["border-top-left-radius"] = randRadius
  randomCSS["border-top-right-radius"] = randRadius
  randomCSS["border-bottom-left-radius"] = randRadius
  randomCSS["border-bottom-right-radius"] = randRadius
  randomCSS["height"] = randomCSS["width"]
}

const shapeGenerator = () => {
  var finalShape = document.createElement("div")
  $(finalShape).css(randomCSS) 
  return finalShape
};

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
  if(textarea.val().match(/\d+\s*(em|rem|%)/) || textarea.val().match(/#/)) {
    badRegex = true
    textarea.css({
      "color": "red"
    })
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

function resetCodeTextarea(getConfirm = false) {
  if(getConfirm && $("#play-code-textarea").val() != baseShapeText && confirm("Are you sure?")) {
    badRegex = false

    $("#play-code-textarea").val(
      "width:100px;\nheight:100px;\nbackground:black;\n"
    );
  
    updatePlaygroundItem();
  }
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

  var points = 100
  points -= timeElapsed

  var targetShape = $("#play-target-shape").children()[0]
  targetShape = $(targetShape)
  const myShape = $("#play-playground-item")

  const pointsPer = 50

  const cssOptions = Object.keys(randomCSS)
  cssOptions.forEach(cssProp => {
    const myCSSVal = myShape.css(cssProp)
    const targetCSSVal = targetShape.css(cssProp)

    if(myCSSVal && targetCSSVal) {
      if(cssProp == "width") {
        points += pointsPer*(1-Math.abs((targetShape.width() - myShape.width()) / targetShape.width()))
      } else if(cssProp == "height") {
        points += pointsPer*(1-Math.abs((targetShape.height() - myShape.height()) / targetShape.height()))
      } else if(cssProp == "background-color") {
        points += (myCSSVal == targetCSSVal ? pointsPer : 0)
      } else if(cssProp == "border-top-left-radius") {
        points += (pointsPer/4)*(1-Math.abs((parseFloat(targetCSSVal) - parseFloat(myCSSVal)) / parseFloat(targetCSSVal)))
      } else if(cssProp == "border-top-right-radius") {
        points += (pointsPer/4)*(1-Math.abs((parseFloat(targetCSSVal) - parseFloat(myCSSVal)) / parseFloat(targetCSSVal)))
      } else if(cssProp == "border-bottom-left-radius") {
        points += (pointsPer/4)*(1-Math.abs((parseFloat(targetCSSVal) - parseFloat(myCSSVal)) / parseFloat(targetCSSVal)))
      } else if(cssProp == "border-bottom-right-radius") {
        points += (pointsPer/4)*(1-Math.abs((parseFloat(targetCSSVal) - parseFloat(myCSSVal)) / parseFloat(targetCSSVal)))
      } else if(cssProp == "border-style") {
        points += (myCSSVal == targetCSSVal ? pointsPer : 0)
      } else if(cssProp == "border-color") {
        points += (myCSSVal == targetCSSVal ? pointsPer : 0)
      } else if(cssProp == "border-width") {
        points += pointsPer*(1-Math.abs((parseFloat(targetCSSVal) - parseFloat(myCSSVal)) / parseFloat(targetCSSVal)))
      }
    }
  })
  points = (points < 0 ? 0 : Math.floor(points))
  return points;
}

function main() {

  timer = startTimer();

  $("#play-code-textarea").bind("input propertychange", updatePlaygroundItem);

  resetCodeTextarea();

  $("#play-target-shape").html(shapeGenerator());
}

function quit() {
  if(confirm("Are you sure?")){
    location.href = 'index.html'
  }
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
  prevScores.sort((a,b) => a.points-b.points)
  localStorage.setItem("scores",JSON.stringify(prevScores))

  var alertMsg = ""
  if(prevScores[prevScores.length-1].points == newScore.points) {
    alertMsg += "NEW HIGH SCORE!\n\n"
  }
  alertMsg += "Points: "+newScore.points+"\nSeconds: "+newScore.seconds+"\nShape: "+newScore.shape
  alert(alertMsg)

  window.location.href = "index.html"
}

$(document).ready(main);
