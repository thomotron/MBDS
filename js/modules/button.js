var timeStart;
var type = "";
var buttonColours = ["hsla(0,100%,50%,1)","hsla(200,100%,50%,1)","hsla(57,100%,50%,1)","hsla(135,100%,50%,1)"]; // HSLA to easlily identify brightness
var buttonBorderColours = ["hsla(0,100%,30%,1)","hsla(200,100%,30%,1)","hsla(57,100%,30%,1)","hsla(135,100%,30%,1)"]
var buttonIndicatorColours = ["#ff9900","#ae00ff","#00f6ff","#00ff7b","#c7ff00","#ff0066","#08ff00"];
var buttonText = ["Press","Disarm","Push","Hold","Arm","Reset","Nope"];
var buttonTest;
var buttonTimeout;

buttonReset();

function buttonReset() {
  var colourRand = Math.floor(Math.random()*buttonColours.length);
  var textRand = Math.floor(Math.random()*buttonText.length);
  $('.buttonContainer .button').css({"background-color":buttonColours[colourRand],"border-bottom-color":buttonBorderColours[colourRand]});
  $('.buttonContainer .button').html("<h2>"+buttonText[textRand]+"</h2>")
  $('.buttonContainer').parent().removeClass("complete");
  $('.buttonContainer').siblings('.statusLed').removeClass("complete");
  $('.colourBar').css({"background-color":"rgb(34, 34, 34)"});
  buttonTest = null;
}

function buttonDown() {
  if (!$('.buttonContainer').parent().hasClass("complete")) {
    if ($('.colourBar').css("background-color") == "rgb(34, 34, 34)") {
      if (($('.buttonContainer .button').css("background-color") == "rgb(255, 0, 0)" && $('.buttonContainer .button').text() == "Hold") || $('.buttonContainer .button').text() == "Reset") {
        // Press and release
        type = "pr";
        buttonTimeout = setTimeout(function(){
          buttonStrike();
        },300);
        buttonTest = 1;
      } else {
        // Press, hold, and release
        type = "ph";
        buttonTimeout = setTimeout(function(){
          var rand = Math.floor(Math.random()*buttonIndicatorColours.length);
          $('.colourBar').css({"background-color":buttonIndicatorColours[rand]});
        },1000);
        buttonTest = 1;
      }
    } else {
      buttonTest = 2;
    }
    timeStart = new Date();
  }
}

/*function buttonUp() {
  if (!$('.buttonContainer').parent().hasClass("complete")) {
    var timeDiff = Math.abs((new Date())-timeStart);
    if ($('.colourBar').css("background-color") == "rgb(34, 34, 34)") {
      if (type == "pr" && !(timeDiff > 300)) {
        clearTimeout(buttonTimeout);
        buttonComplete();
      } else if (type == "ph" && timeDiff > 1700) {
        clearTimeout(buttonTimeout);
        buttonStrike();
      }
    } else if ($('.colourBar').css("background-color") == "rgb(255, 153, 0)" && buttonTest == 2) {
      if ($('.timer-display').text().indexOf("3") != -1) {
        buttonComplete();
      } else {
        buttonStrike();
      }
    } else if ($('.colourBar').css("background-color") == "rgb(174, 0, 255)" && buttonTest == 2) {
      if ($('.timer-display').text().indexOf("6") != -1) {
        buttonComplete();
      } else {
        buttonStrike();
      }
    } else if ($('.colourBar').css("background-color") == "rgb(0, 246, 255)" && buttonTest == 2) {
      if (timeDiff < 300) {
        buttonComplete();
      } else {
        buttonStrike();
      }
    } else if (buttonTest == 2) {
      if ($('.timer-display').text().indexOf("1") != -1) {
        buttonComplete();
      } else {
        buttonStrike();
      }
    }
  }
}*/

function buttonUp() {
  if (!$('.buttonContainer').parent().hasClass("complete")) {
    var timeDiff = Math.abs((new Date())-timeStart);
    if (buttonTest == 1) {
      if (type == "pr") {
        if (timeDiff < 300) {
          clearTimeout(buttonTimeout);
          buttonComplete();
        } else  {
          clearTimeout(buttonTimeout);
          buttonStrike();
        }
      } else if (type == "ph") {
        if (timeDiff > 1700 || timeDiff < 1000) { // Released too late or too early
          clearTimeout(buttonTimeout);
          buttonStrike();
          $('.colourBar').css({"background-color":"rgb(34, 34, 34)"});
        }
      }
    } else if (buttonTest == 2) {
      if ($('.colourBar').css("background-color") == "rgb(255, 153, 0)") { // Orange Indicator
        if ($('.timer-display').text().indexOf("3") != -1) {
          buttonComplete();
        } else {
          buttonStrike();
        }
      } else if ($('.colourBar').css("background-color") == "rgb(174, 0, 255)") { // Purple Indicator
        if ($('.timer-display').text().indexOf("6") != -1) {
          buttonComplete();
        } else {
          buttonStrike();
        }
      } else if ($('.colourBar').css("background-color") == "rgb(0, 246, 255)") { // Blue Indicator
        if (timeDiff < 300) {
          buttonComplete();
        } else {
          buttonStrike();
        }
      } else { // Other Indicator
        if ($('.timer-display').text().indexOf("1") != -1) {
          buttonComplete();
        } else {
          buttonStrike();
        }
      }
    }
  }
}

function buttonComplete() {
  $('.buttonContainer').parent().addClass("complete");
  $('.buttonContainer').siblings('.statusLed').addClass("complete");
}

function buttonStrike() {
  strike();
  $('.buttonContainer').siblings('.statusLed').addClass("strike");
  setTimeout(function(){
    $('.buttonContainer').siblings('.statusLed').removeClass("strike");
  },600);
}
