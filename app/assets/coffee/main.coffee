$(".flyout-btn").click ->
  $(".flyout-btn").toggleClass "btn-rotate"
  $(".flyout").find("a").removeClass()
  $(".flyout").removeClass("flyout-init fade").toggleClass "expand"

$(".flyout").find("a").click ->
  $(".flyout-btn").toggleClass "btn-rotate"
  $(".flyout").removeClass("expand").addClass "fade"
  $(this).addClass "clicked"
