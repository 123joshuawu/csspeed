function loadLanding() {
  const scores = JSON.parse(localStorage.getItem("scores"));
  console.log("Scores:", scores);

  if(scores) {
    // TODO sort it
    var tbody = $("tbody")[0]
    for(let i=0;i<5 && i<scores.length;i++) {
      let score = scores[i]
      var scoreline = document.createElement("tr")
      scoreline.innerHTML = "<td>"+score.points+"</td><td>"+score.seconds+"</td><td>"+score.shape+"</td>"
      tbody.append(scoreline)
    }
  }
}
