$(document).ready(function() {	
	// Nav Show
	var runtime = 500;
	if (($(document).width()) <= (parseInt($('body').css('font-size')) * 62)) {
		$('.menu').slideUp(runtime);
		$('.mobile_show').click(function() {
			$('.menu').slideToggle(runtime);
			$('.mobile_show').attr('class','mobile_hide');
		});
	} else {
		$('.menu').slideDown(runtime);
	}
	
	// Hover Captions
	$('.slide').hover(
		function(){
			$(this).find('.caption').slideDown(250);
		},
		function(){
			$(this).find('.caption').slideUp(250);
		}
	);
});

$(window).resize(function(){
	var runtime = 500;
	if (($(document).width()) <= (parseInt($('body').css('font-size')) * 62)) {
		$('.menu').slideUp(runtime);
	} else {
		$('.menu').slideDown(runtime);
	}
});