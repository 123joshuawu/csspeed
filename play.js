// Random choice from array
function chooseOne(arr, ignore = []) {
  let filtered = arr.filter((item) => !ignore.includes(item));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// CSS of base shape that users start with
const baseShapeText = "width:100px;\nheight:100px;\nbackground:black;\n";

const colorOptions = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "gray",
  "white",
];
const borderStyles = ["solid", "dashed", "dotted"];

var timeElapsed = 0;
var timer = null;
// Flag for users inputting invalid characters into text input
var badRegex = false;

// Get shape to load from query params
const urlParams = new URLSearchParams(window.location.search);
var shapeType = urlParams.get("shape");
if (shapeType == "random") {
  shapeType = chooseOne(["circle", "rectangle"]);
}

// Generate randomized CSS for the target shape
const randRadius = Math.floor(Math.random() * 25) + "px";
const randomCSS = {
  "background-color": chooseOne(colorOptions),
  width: Math.floor(Math.random() * 150 + 25) + "px",
  height: Math.floor(Math.random() * 150 + 25) + "px",
  // Some reason `border-radius` is not recognized so we have to
  // resort to specifying each one specifically
  "border-top-left-radius": randRadius,
  "border-top-right-radius": randRadius,
  "border-bottom-left-radius": randRadius,
  "border-bottom-right-radius": randRadius,
  "border-width": Math.floor(Math.random() * 3) + "px",
  "border-style": chooseOne(borderStyles),
};
randomCSS["border-color"] = chooseOne(colorOptions, [
  randomCSS["background-color"],
]);

// Special case: circle must be a circle
if (shapeType == "circle") {
  const radius = parseFloat(randomCSS["width"]) / 2 + "px";
  randomCSS["border-top-left-radius"] = radius;
  randomCSS["border-top-right-radius"] = radius;
  randomCSS["border-bottom-left-radius"] = radius;
  randomCSS["border-bottom-right-radius"] = radius;
  randomCSS["height"] = randomCSS["width"];
}

// Generates the DOM element for the target shape with the
//  randomized CSS
const shapeGenerator = () => {
  const finalShape = document.createElement("div");
  $(finalShape).css(randomCSS);
  return finalShape;
};

function startTimer() {
  return setInterval(function () {
    timeElapsed++;
    document.getElementById(
      "play-time-text"
    ).innerHTML = `${timeElapsed} seconds elapsed`;
  }, 1000);
}

// Updates the target shape with the user inputted styles
function updatePlaygroundItem() {
  const textarea = $("#play-code-textarea");
  // Check user input for invalid characters
  if (textarea.val().match(/\d+\s*(em|rem|%)/) || textarea.val().match(/#/)) {
    badRegex = true;
    textarea.css({
      color: "red",
    });
  } else {
    badRegex = false;

    textarea.css({
      color: "black",
    });

    // Parse user input and update CSS of target shape
    $("#play-playground-item").css(
      parseCssStringToObject($("#play-code-textarea").val())
    );
  }
}

// Reset text area and target shape to base configuration
function resetCodeTextarea(init = false) {
  if (
    init ||
    ($("#play-code-textarea").val() != baseShapeText &&
      confirm("Are you sure?"))
  ) {
    badRegex = false;

    $("#play-code-textarea").val(
      "width:100px;\nheight:100px;\nbackground:black;\n"
    );

    updatePlaygroundItem();
  }
}

// Given a string with CSS styles, parse into a object of key-value pairs
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

// Calculate the score by comparing the user defined styles to the
//  randomized styles generated at the start
function getScore() {
  // Penalty for time elapsed
  var points = 100;
  points -= timeElapsed;

  var targetShape = $("#play-target-shape").children()[0];
  targetShape = $(targetShape);
  const myShape = $("#play-playground-item");

  // Points awarded for each style correctly matched
  const pointsPer = 50;

  const cssOptions = Object.keys(randomCSS);
  cssOptions.forEach((cssProp) => {
    const myCSSVal = myShape.css(cssProp);
    const targetCSSVal = targetShape.css(cssProp);

    if (myCSSVal && targetCSSVal) {
      if (cssProp == "width") {
        // Award points corresponding to how close the user width was to the
        //  target width
        points +=
          pointsPer *
          (1 -
            Math.abs(
              (targetShape.width() - myShape.width()) / targetShape.width()
            ));
      } else if (cssProp == "height") {
        points +=
          pointsPer *
          (1 -
            Math.abs(
              (targetShape.height() - myShape.height()) / targetShape.height()
            ));
      } else if (cssProp == "background-color") {
        // Award points if user guessed color correctly
        points += myCSSVal == targetCSSVal ? pointsPer : 0;
      } else if (cssProp == "border-top-left-radius") {
        points +=
          (pointsPer / 4) *
          (1 -
            Math.abs(
              (parseFloat(targetCSSVal) - parseFloat(myCSSVal)) /
                parseFloat(targetCSSVal)
            ));
      } else if (cssProp == "border-top-right-radius") {
        points +=
          (pointsPer / 4) *
          (1 -
            Math.abs(
              (parseFloat(targetCSSVal) - parseFloat(myCSSVal)) /
                parseFloat(targetCSSVal)
            ));
      } else if (cssProp == "border-bottom-left-radius") {
        points +=
          (pointsPer / 4) *
          (1 -
            Math.abs(
              (parseFloat(targetCSSVal) - parseFloat(myCSSVal)) /
                parseFloat(targetCSSVal)
            ));
      } else if (cssProp == "border-bottom-right-radius") {
        points +=
          (pointsPer / 4) *
          (1 -
            Math.abs(
              (parseFloat(targetCSSVal) - parseFloat(myCSSVal)) /
                parseFloat(targetCSSVal)
            ));
      } else if (cssProp == "border-style") {
        points += myCSSVal == targetCSSVal ? pointsPer : 0;
      } else if (cssProp == "border-color") {
        points += myCSSVal == targetCSSVal ? pointsPer : 0;
      } else if (cssProp == "border-width") {
        points +=
          pointsPer *
          (1 -
            Math.abs(
              (parseFloat(targetCSSVal) - parseFloat(myCSSVal)) /
                parseFloat(targetCSSVal)
            ));
      }
    }
  });
  points = points < 0 ? 0 : Math.floor(points);
  return points;
}

// Main function called on page startup
function main() {
  timer = startTimer();

  // Bing update target shape callback to text area input change event
  $("#play-code-textarea").bind("input propertychange", updatePlaygroundItem);

  // Initialize text area
  resetCodeTextarea(true);

  // Generate target shape
  $("#play-target-shape").html(shapeGenerator());
}

function quit() {
  if (confirm("Are you sure?")) {
    location.href = "index.html";
  }
}

// Calculate and save score of current game
function finish() {
  // If invalid input detected, prevent submitting
  if (badRegex) {
    alert("CSS input contains bad values");
    return;
  }
  clearInterval(timer);

  // Load scores and add new score
  var prevScores = JSON.parse(localStorage.getItem("scores"));
  const newScore = {
    points: getScore(),
    seconds: timeElapsed,
    shape: shapeType,
  };
  if (prevScores) {
    prevScores.push(newScore);
  } else {
    prevScores = [newScore];
  }
  // Sort scores by number of points
  prevScores.sort((a, b) => a.points - b.points);
  // Save scores to local storage
  localStorage.setItem("scores", JSON.stringify(prevScores));

  // If new high score achieved, display message
  var alertMsg = "";
  if (prevScores[prevScores.length - 1].points == newScore.points) {
    alertMsg += "NEW HIGH SCORE!\n\n";
  }
  // Alert user to their score
  alertMsg +=
    "Points: " +
    newScore.points +
    "\nSeconds: " +
    newScore.seconds +
    "\nShape: " +
    newScore.shape;
  alert(alertMsg);

  // Redirect back to landing page
  window.location.href = "index.html";
}
