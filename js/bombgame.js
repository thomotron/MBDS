var gameStarted = false;
var timer;
var difficulty;
var time;

$(document).ready(function(){

  $('body').attr("loaded",""); // Clear loaded module index

  if (!cookieCheck()) {$('.cookieWarning').css({"bottom":"0px"});} // Checks if cookies are enabled, displays warning if not
  if ($.ajax().statusText == "error") { // Check if scripts are blocked
    // Insert dark overlay and warning message. Seperate from main stylesheets for cleanliness. Completely disposable.
    $('body').append("<div style=\"width: 100vw; height: 100vh; opacity: 0.8; background-color: #000; z-index: 999; position: absolute; top: 0px; left: 0px;\" class=\"ajaxWarning\"></div><div style=\"width: 650px; height: 220px; background-color: #FFF; z-index: 1000; position: absolute; left: 50%; top: 50%; margin-left: -325px; margin-top: -110px; opacity: 1; text-align: center;\" class=\"ajaxWarning\"><h1>ATTENTION</h1><p>Your browser seems to be blocking AJAX requests, something this page depends on.<br>Please try a different browser or enable content requests and try load this page again<br>You may proceed anyway, but there is no guarantee that this page will work if you do.</p><button class=\"input\" id=\"ajaxProceed\">I acknowledge, proceed</button></div>");
  }
  leaderboard();

//---------- FUNCTIONS ----------//

  $('.cookieWarning button').click(function(){ // Hide cookie warning
    $('.cookieWarning').css({"bottom":"-60px"});
  });

  $('#submit').click(function(){ // Validate settings and start the game
    if ($('#username').val() === null || $('#username').val() === "" || !/\S/.test($('#username').val())) {
      $('#username').css({"border-color":"red"});
      setTimeout(function(){$('#username').css({"border-color":"#CCC"});},300);
    } else {
      setup();
      timer = setInterval(gameTick,1000);
      menu_hide();
    }
  });

  $('.input').keypress(function(e){ // Submit form on enter
    if (e.which == 13) {
      $('#submit').click();
      return false;
    }
  });

  $('#ajaxProceed').click(function(){ // Dispose of the script warning
    $('.ajaxWarning').remove();
  });

  $(document).click(function(e){ // Close leaderboard settings menu
    var targ = $(e.target);
    if ((!targ.hasClass("settingsGear") || !targ.hasClass("settingsMenu")) && $('.settingsMenu').css("opacity") == 1) { // Not settings gear or menu and menu is visible
      toggleSettings();
    }
  });

});

function gameTick() { // Core game logic, checks if game should still be running each second
  if (gameStarted) {
    if (moduleCheck()) {
      clearInterval(timer);
      endGameSuccess();
    } else {
      if (time <= 0) {
        endGameFailure();
      } else {
        timerTick();
      }
    }
  }
}

function timerTick() { // Ticks timer up, plays a beep
  time--;
  $('.timer-display').text(formatTime(time));
  $('#beep').get(0).play();
}

function moduleCheck() { // Checks if all modules are complete, returns true if so and alse if not
  var total = 0;
  var complete = 0;
  for (var module of $('.module:not(:empty)')) {
    module = $(module);
    total++
    if (module.hasClass("complete") || module.attr("id") == "mod1") {
      complete++
    }
  }
  if (total == complete) {
    return true;
  } else {
    return false;
  }
}

function moduleGen() { // Selects random modules, inserts HTML, and loads necessary scripts
  resetFuncs = [];
  for (var i=2; i<5; i++) {
    if ($('body').attr("loaded").length/2 < modules.length) {
      var j = Math.ceil(Math.random()*modules.length)-1;
      while ($('body').attr("loaded").indexOf(j)!=-1)  {
        j = Math.ceil(Math.random()*modules.length)-1;
      }
      $('#mod'+i).html(modules[j].dom); // Import DOM structure
      $.getScript(modules[j].script+".js",console.log("Running "+modules[j].script+".js")); // Load module script
      $('body').attr("loaded",$('body').attr("loaded")+j+" "); // Make sure it doesn't happen again
    }
  }
}

function setup() { // Set up bomb before the game starts
  difficulty = parseInt($('#difficulty option:selected').val());
  time = difficulty;
  $('.timer-display').text(formatTime(time));
  $('.timer-strikes').empty();
  for (var module of $('.module')) {
    module = $(module)
    module.removeClass("complete");
  }
  moduleGen();
  resetModules();
  $('.manual').scrollTop(0);
  gameStarted = true;
}

function leaderboard() { // Generate and display the leaderboard table
  $('.menu div .leaderboard').empty();
  if (!cookieCheck()) {
    $('.menu div .leaderboard').append("<div class=\"leaderboardWarning\">Cookies must be enabled to show leaderboard data</div>");
  } else {
    if (!doesCookieExist("scores") || JSON.parse(getCookie("scores")).length <= 0) {
      $('.menu div .leaderboard').append("<div class=\"leaderboardWarning\">No scores yet.</div>");
    } else {
      var scores = JSON.parse(getCookie("scores"));
      $('.menu div .leaderboard').append("<table></table");
      for (var i=0; i<scores.length; i++) {
        $('.menu div .leaderboard table').append("<tr><td width=\"40%\">"+scores[i].name+"</td><td width=\"30%\">"+scores[i].difficulty+"</td><td width=\"30%\">"+scores[i].score+"</td></tr>");
      }
    }
  }
}

function cookieCheck() { // Check if cookies are enabled
  setCookie("n","n");
  if (!doesCookieExist("n")) {
    return false;
  }
  deleteCookie("n");
  return true;
}

function strike() { // Add a strike to the timer module, plays a buzzer, ends game if there are too many strikes
  if ($('.timer-strikes').text() == "XX") {
    endGameFailure();
  } else {
    $('.timer-strikes').text($('.timer-strikes').text().concat("X"));
    $('#buzzer').get(0).play();
  }
}

function endGameFailure() { // Detonates bomb, unsuccessful game
  clearInterval(timer);
  gameStarted = false;

  $('#explosion').get(0).play();
  // Explosion effect timers.
   $('.explosionOverlay').removeClass("invisible");
   setTimeout(function(){ // 2.5s later
    $('.explosionOverlay').css({"background-color":"rgba(1,1,1,0)"});
    setTimeout(function(){ // 2s later
      $('.explosionOverlay').addClass("invisible");
      $('.explosionOverlay').css({"background-color":"#FFF"});
    },2000);
  },2500);

  menu_showFailure();
}

function endGameSuccess() { // Defuses bomb, successful game
  clearInterval(timer);
  gameStarted = false;

  var name = $('#username').val();
  var score = ((time/difficulty)*1000)*(1-($('.timer-strikes').text().length*0.20));
  var board = [];

  switch (difficulty) {
    case 30: difficulty = "Expert"; score = Math.round(score*2); break;
    case 60: difficulty = "Hard"; score = Math.round(score*1.5); break;
    case 90: difficulty = "Normal"; score = Math.round(score*1); break;
    case 120: difficulty = "Easy"; score = Math.round(score*0.75); break;
    case 150: difficulty = "Beginner"; score = Math.round(score*0.5); break;
  }

  // Update scoreboard with current score
  if (doesCookieExist("scores")) {
    var cookieScores = getCookie("scores");
    cookieScores = processScore(score, name, difficulty, JSON.parse(cookieScores));
    setCookie("scores",JSON.stringify(cookieScores));
  } else {
    board = [{"name":name,"score":score,"difficulty":difficulty}];
    setCookie("scores",JSON.stringify(board));
  }
  leaderboard();
  menu_showSuccess();
}

function resetModules() { // Resets bomb modules
  var loaded = $('body').attr("loaded").split(" ");
  for (var id of loaded) {
    if (id === "0") { // Wires
      try {
        wireReset();
      } catch(e) {
        if (e != "ReferenceError: wireReset is not defined") {
          console.log("Failure to reset module "+(+id+1)+".\n"+e);
        }
      }
    } else if (id === "1") { // Button
      try {
        buttonReset();
      } catch(e) {
        if (e != "ReferenceError: buttonReset is not defined") {
          console.log("Failure to reset module "+(+id+1)+".\n"+e);
        }
      }
    } else if (id == 2) { // Binary
      try {
        binaryReset();
      } catch(e) {
        if (e != "ReferenceError: binaryReset is not defined") {
          console.log("Failure to reset module "+(+id+1)+".\n"+e);
        }
      }
    }
  }
}
