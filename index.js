function reSize() {
  // 0.075
  let paperWidth = $("#paper-bg").width();
  $("#pen").width(paperWidth * 0.075);
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

      var rotateCSS = "rotate(" + (degree + 80) + "deg)";
      $("#pen-container").css({
        "-moz-transform": rotateCSS,
        "-webkit-transform": rotateCSS,
      });
      $("#angle").text(degree + 80);
    },
  });
});
