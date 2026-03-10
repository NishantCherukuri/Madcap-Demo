$(document).ready(function(){
// Call your functions here
		
		$(document).ready(function() {
				ReadingTime(225);
				var ReadingTimeHeading = ("#mc-main-content").find("h1, h2, h3, h4, h5").first();
				$(".reading-time-container").insertAfter(ReadingTimeHeading).show();
			});
		
		$(document).ready(function() {
				BackToTop();
			});
});