var wireColours;
var colours;

wireReset();

function wireReset() {
  colours = ["r","o","y","g","b","w","bk"];
  wireColours = [];

  for (var i=0; i<4; i++) {
    wireColours[i] = colours[Math.floor(Math.random()*colours.length)];
    var wireType = Math.ceil(Math.random()*4);
    $('#wire'+(i+1)).attr("colour",wireColours[i]).attr("cut","");
    $('#wire'+(i+1)).css({"background-image":"url(\"img/wires/"+wireType+wireColours[i]+".png\")"});
  }

  $('.wire').siblings('.statusLed').removeClass("complete")
}

function arrayCount(ary, str) {
  var count = 0;
  var indices = [];
  for (var i=0; i<ary.length; i++) {
    if (ary[i] == str) {
      count++;
      indices[indices.length] = i;
    }
  }
  return {"count":count,"indices":indices};
}


function wireClick(ths) {
  ths = $(ths); // Convert to jQuery object. Easier to work with.
  if (!ths.parent().hasClass("complete") && ths.attr("cut") != "cut") {
    if (arrayCount(wireColours, "r").count==0 && arrayCount(wireColours, "bk").count==1) {
      //Cut second
      if (ths.attr("id")=="wire2") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if ($('#wire4').attr("colour") == "w") {
      //Cut last
      if (ths.attr("id")=="wire4") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if (arrayCount(wireColours,"b").count>1) {
      var indices = arrayCount(wireColours,"b").indices;
      //Cut last blue
      if (ths.attr("id")=="wire"+(indices[indices.length-1]+1)) {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if (arrayCount(wireColours,"b").count==1) {
      //Cut first
      if (ths.attr("id")=="wire1") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if (arrayCount(wireColours,"y").count>1) {
      //Cut last
      if (ths.attr("id")=="wire4") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if (arrayCount(wireColours,"r").count==1 && arrayCount(wireColours,"o").count>1) {
      var indices = arrayCount(wireColours,"r").indices;
      //Cut red
      if (ths.attr("id")==("wire"+(indices[0]+1))) {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else if (arrayCount(wireColours,"bk").count==0 && arrayCount(wireColours,"g").count==0) {
      //Cut third
      if (ths.attr("id")=="wire3") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    } else {
      //Cut second
      if (ths.attr("id")=="wire2") {
        wiresComplete();
      } else {
        wiresStrike();
      }
    }
    cut();
  }

  function wiresComplete() {
    ths.parent().addClass("complete");
    ths.siblings('.statusLed').addClass("complete")
  }
  function wiresStrike() {
    strike();
    ths.siblings('.statusLed').addClass("strike");
    setTimeout(function(){
      ths.siblings('.statusLed').removeClass("strike")
    },600);
  }
  function cut() {
    var url = ths.css("background-image");
    url = url.substring(0,url.lastIndexOf("."));
    url = url.concat("c.png\")");
    ths.css({"background-image":url});
    ths.attr("cut","cut")
    $('#snip').get(0).play();
  }
}
