function processScore(score, username, difficulty, board) { //Assumes 'board' is unsorted, so sorts whole array. Inefficient.
  var newBoard = [];
  board.push({"name":username,"score":score,"difficulty":difficulty});
  while (board.length > 0) {
    var n = 0;
    for (var j = 0; j < board.length; j++) {
      if (board[j].score > board[n].score) {
        n = j;
      }
    }
    newBoard.push({"name":board[n].name,"score":board[n].score,"difficulty":board[n].difficulty});
    board.splice(n, 1);
  }
  return newBoard;
}

function formatTime(time) {
  var mins, secs;
    if ((time/60)>=1) {
      mins = Math.floor(time/60);
    } else {
      mins = 0;
	}
  secs = Math.ceil(time-mins*60);
  
  if (mins<10) {
    mins = "0"+mins;
  }
  if (secs<10) {
    secs = "0"+secs;
  }
  
  return (mins+":"+secs).toString();
}

function menu_hide() {
  $('.menu').css({"margin-top":"51vh"});
  $('.manualContainer').css({"margin-left":"-401px"}).draggable({
    handle:".pulltab",
    axis:"x",
    drag: function(event, ui) {
      var leftPosition = ui.position.left;
      if (leftPosition > 401) {
        ui.position.left = 401;
      } else if (leftPosition < 0) {
        ui.position.left = 0;
      }
    }
  });
}
function menu_showSetup() {
  $('.manualContainer').css({"margin-left":"-426px"}).attr("style","");
  $('.menu').css({"margin-top":"-300px"});
  $('.menu h1').text("Game Setup");
}
function menu_showFailure() {
  $('.manualContainer').css({"margin-left":"-426px"}).attr("style","");
  $('.menu').css({"margin-top":"-300px"});
  $('.menu h1').text("You Failed");
}
function menu_showSuccess() {
  $('.manualContainer').css({"margin-left":"-426px"}).attr("style","");
  $('.menu').css({"margin-top":"-300px"});
  $('.menu h1').text("Bomb Defused");
}

function toggleSettings() {
  if ($('.settingsMenu').css("opacity") == 0) { // Invisible, Inactive
    $('.settingsMenu').css({"opacity":"1"});
    $('.settingsGear').css({"transform":"rotate(45deg)"});
  } else if ($('.settingsMenu').css("opacity") == 1) { // Visible, Active
    $('.settingsMenu').css({"opacity":"0"});
    $('.settingsGear').css({"transform":"rotate(0deg)"});
  }
}

function resetScores() {
  if ($('.settingsMenu').css("opacity") != 0) {
     deleteCookie('scores');
    leaderboard();
    toggleSettings();
  }
}