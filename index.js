function reSize() {
  // 0.075
  let paperWidth = $("#paper-bg").width();
  $("#pen").width(paperWidth * 0.075);
  // $("#line").width(paperWidth * 0.075);
  let penHeight = $("#pen").height();
  $(".container").css("paddingTop", `${penHeight / 4 - 10}px`);
}

function Snell(
  incidentAngle,
  incidentMediumRefractionIndex = 1.0,
  refractiveMediumRefractionIndex = 1.5
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
  console.log(refractedAngle);
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
        $("#pen").attr("src", `./images/${$(element).val()}-long.png`);
      }
    });
  });

  $("#pen-container").draggable({
    handle: "#pen",
    opacity: 0.001,
    helper: "clone",
    drag: function (event) {
      var // get center of div to rotate
        pw = document.getElementById("pen-container"),
        pwBox = pw.getBoundingClientRect(),
        center_x = (pwBox.left + pwBox.right) / 2,
        center_y = (pwBox.top + pwBox.bottom) / 2,
        // get mouse position
        mouse_x = event.pageX,
        mouse_y = event.pageY,
        radians = Math.atan2(mouse_x - center_x, mouse_y - center_y),
        degree = Math.round(radians * (180 / Math.PI) * -1 + 100);

      degree += 80;
      if (
        !((degree >= 270 && degree <= 360) || (degree >= 0 && degree <= 91))
      ) {
        return;
      }
      var rotateCSS = `rotate(${degree}deg)`;
      $("#pen-container").css({
        "-moz-transform": rotateCSS,
        "-webkit-transform": rotateCSS,
      });
      var refractedAngle = Snell(degree);
      rotateCSS = `rotate(${refractedAngle}deg)`;
      $("#line-container").css({
        "-moz-transform": rotateCSS,
        "-webkit-transform": rotateCSS,
      });
      $("#angle").text(degree);
    },
  });
});
