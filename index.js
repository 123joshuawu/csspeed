function loadLanding() {
  var scores = JSON.parse(localStorage.getItem("scores"));

  if(scores) {
    var tbody = $("tbody")[0]
    for(let i=0;i<5 && i<scores.length;i++) {
      let score = scores[scores.length-i-1]
      var scoreline = document.createElement("tr")
      scoreline.innerHTML = "<td>"+score.points+"</td><td>"+score.seconds+"</td><td>"+score.shape+"</td>"
      tbody.append(scoreline)
    }
  }
}

function clearStorage() {
  if(confirm("Reset all scores?")) {
    localStorage.removeItem("scores")
    location.reload()
  }
}
