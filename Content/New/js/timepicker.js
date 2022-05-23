
  if (/Mobi/.test(navigator.userAgent)) {
  // if mobile device, use native pickers
  $(".date input").attr("type", "date");
  $(".time input").attr("type", "time");
} else {
  // if desktop device, use DateTimePicker
  $("#datepicker").datetimepicker({
    useCurrent: false,
    format: "L",
    showTodayButton: true,
    icons: {
      next: "fa fa-chevron-right",
      previous: "fa fa-chevron-left",
      today: 'todayText',
    }
  });
  $("#timepicker").datetimepicker({
    format: "LT",
    icons: {
      up: "fa fa-chevron-up",
      down: "fa fa-chevron-down"
    }
  });
}
if (/Mobi/.test(navigator.userAgent)) {
    // if mobile device, use native pickers
    $(".date input").attr("type", "date");
    $(".time input").attr("type", "time");
  } else {
    // if desktop device, use DateTimePicker
    $("#datepicker-2").datetimepicker({
      useCurrent: false,
      format: "L",
      showTodayButton: true,
      icons: {
        next: "fa fa-chevron-right",
        previous: "fa fa-chevron-left",
        today: 'todayText',
      }
    });
    $("#timepicker-2").datetimepicker({
      format: "LT",
      icons: {
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down"
      }
    });
  }
 