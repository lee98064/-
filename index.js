let roundDecimal = function (val, precision) {
  return (
    Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
    Math.pow(10, precision || 0)
  );
};

function reSize() {
  // 0.075
  let paperWidth = $("#paper-bg").width();
  let paperHeight = $("#paper-bg").height();
  $("#pen").css({
    width: `${paperWidth * 0.075}px`,
  });
  $("#pen-container").css({
    height: `${parseInt(paperHeight * 0.47)}px`,
  });
  $("#line").css({
    width: `${paperWidth * 0.008}px`,
  });
  let penHeight = $("#pen").height();
  $(".container").css("paddingTop", `${penHeight / 4 - 10}px`);
}

function getLiquidRefractiveIndex() {
  if (!$("#water-bowl").is(":checked")) {
    return 1.0;
  }

  let liquidType = $("input[name=liquid]:checked").val();
  switch (liquidType) {
    case "liquid-water":
      refractiveIndex = 1.5;
      break;
    case "liquid-salt-water":
      refractiveIndex = 1.333;
      break;
    case "liquid-alcohol":
      refractiveIndex = 1.36;
      break;
    case "liquid-glycerin":
      refractiveIndex = 1.47;
      break;
    default:
      refractiveIndex = 1.0;
      break;
  }
  return refractiveIndex;
}

function updateLineContainer() {
  let penContainerAngle = $("#pen-container").data("angle");
  var refractedAngle = Snell(
    penContainerAngle,
    1.0,
    getLiquidRefractiveIndex()
  );
  rotateCSS = "rotate(" + refractedAngle + "deg)";
  $("#line-container").css("transform", rotateCSS);
  $("#refractedAngle").text(roundDecimal(refractedAngle, 2));
}

// function refractiveMediumRefractionIndex(liquid) {
//   let refractiveIndex = 0;
//   switch (liquid) {
//     case "air":
//       refractiveIndex = 1.0;
//       break;
//     case "glass":
//       refractiveIndex = 1.5;
//       break;
//     default:
//       refractiveIndex = 0;
//       break;
//   }
//   return refractiveIndex;
// }

function Snell(
  incidentAngle,
  incidentMediumRefractionIndex = 1.0,
  refractiveMediumRefractionIndex = 1.0
) {
  // 定義入射角度和介質折射率
  // const incidentAngle = 30; // 入射角（單位：度）
  // const incidentMediumRefractionIndex = 1.0; // 入射介質折射率

  // const refractiveMediumRefractionIndex = 1.5; // 折射介質折射率

  // 將角度轉換為弧度
  const incidentAngleRadians = incidentAngle * (Math.PI / 180);

  // 使用司乃爾定律計算折射角度
  const refractedAngleRadians = Math.asin(
    (incidentMediumRefractionIndex / refractiveMediumRefractionIndex) *
      Math.sin(incidentAngleRadians)
  );

  // 將折射角度轉換回角度
  const refractedAngle = refractedAngleRadians * (180 / Math.PI);
  return refractedAngle;
}

$(function () {
  reSize();

  $(window).on("resize", function () {
    reSize();
  });

  $(".pen-option input").on("change", function () {
    $(".pen-option input").each(function (index, element) {
      if ($(element).is(":checked")) {
        $("#pen").attr("src", `./images/${$(element).val()}.png`);
        $("#line").attr(
          "src",
          `./images/${$(element).val().replace("pen", "line")}.png`
        );
      }
    });
  });

  $("#water-bowl").on("change", function () {
    $("#water-bowl-img").css(
      "display",
      $(this).is(":checked") ? "block" : "none"
    );
    $(".liquid-option input").prop("disabled", !$(this).is(":checked"));
    updateLineContainer();
  });

  $("#paper, #protractor").on("change", function () {
    if ($(this).is(":checked")) {
      $(`#${$(this).val()}-bg`).css("opacity", 1);
    } else {
      $(`#${$(this).val()}-bg`).css("opacity", 0);
    }
  });

  $(".liquid-option input").on("change", function () {
    updateLineContainer();
  });
});

var penContainer = document.getElementById("pen-container");
var pen = document.getElementById("pen");
var lineContainer = document.getElementById("line-container");
var angleText = document.getElementById("angle");
var refractedAngleText = document.getElementById("refractedAngle");

var isDragging = false;
var center_x, center_y;

function handleStart(event) {
  event.preventDefault(); // 阻止瀏覽器拖曳圖片的預設行為
  isDragging = true;
  var pwBox = penContainer.getBoundingClientRect();
  center_x = (pwBox.left + pwBox.right) / 2;
  center_y = pwBox.bottom;
}

function handleMove(event) {
  if (isDragging) {
    var clientX, clientY;

    if (event.touches) {
      var touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    var radians = Math.atan2(clientX - center_x, clientY - center_y);
    var degree = Math.round(radians * (180 / Math.PI) * -1 + 100);
    degree += 80;
    if (!((degree >= 270 && degree <= 360) || (degree >= 0 && degree <= 91))) {
      return;
    }
    var rotateCSS = "rotate(" + degree + "deg)";
    penContainer.style.transform = rotateCSS;
    penContainer.setAttribute("data-angle", degree);
    lineContainer.style.transform = rotateCSS;
    var refractedAngle = Snell(degree, 1.0, getLiquidRefractiveIndex());
    rotateCSS = "rotate(" + refractedAngle + "deg)";
    lineContainer.style.transform = rotateCSS;
    angleText.textContent = degree;
    refractedAngleText.textContent = roundDecimal(refractedAngle, 2);
  }
}

function handleEnd(event) {
  isDragging = false;
}

pen.addEventListener("mousedown", handleStart);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleEnd);

pen.addEventListener("touchstart", handleStart);
document.addEventListener("touchmove", handleMove);
document.addEventListener("touchend", handleEnd);
