var binaryAnswer = [];

binaryReset();

function binaryReset() {
  $('.binaryDisplay').parent().removeClass("complete");
  $('.binaryDisplay').siblings('.statusLed').removeClass("complete");
  $('.binaryDisplay').text(Math.ceil(Math.random()*100));
  for (var radio of $('.binaryRadio input')) {
    radio = $(radio);
    radio.prop("checked", false)
  }

  var btext = $('.binaryDisplay').text();
  if (btext >= 1 && btext <= 25) {
    binaryAnswer = [0,0,0,0,1,0,0,1];
  } else if (btext >= 26 && btext <= 37) {
    binaryAnswer = [0,1,1,0,1,1,1,1];
  } else if (btext >= 34 && btext <= 51) {
    binaryAnswer = [0,1,1,0,1,1,1,0];
  } else if (btext >= 67 && btext <= 86) {
    binaryAnswer = [0,1,0,0,0,1,0,1];
  } else if (btext == 87) {
    binaryAnswer = [0,1,0,1,0,1,0,0];
  } else if (btext >= 13 && btext <= 71) {
    binaryAnswer = [0,1,0,1,0,1,1,1];
  } else if (btext >= 87 && btext <= 100) {
    binaryAnswer = [1,1,0,0,1,1,1,0];
  }

}

function binaryClick() {
  if (!$('.binaryDisplay').parent().hasClass("complete")) {
    for (var i = 1; i<=8; i++) {
      if ($('.binaryRadio input[name=binaryGroup'+ i +']:checked').attr("class") != binaryAnswer[i-1]) {
        var incorrect = true
        break;
      }
    }

    if (incorrect) {
      binaryStrike();
    } else {
      binaryComplete();
    }
  }
}

function binaryComplete() {
  $('.binaryDisplay').parent().addClass("complete");
  $('.binaryDisplay').siblings('.statusLed').addClass("complete")
}

function binaryStrike() {
  strike();
  $('.binaryDisplay').siblings('.statusLed').addClass("strike");
  setTimeout(function(){
    $('.binaryDisplay').siblings('.statusLed').removeClass("strike");
  },600);
}
