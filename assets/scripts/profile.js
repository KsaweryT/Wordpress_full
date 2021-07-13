/*****************************************************************************
*
*	copyright(c) - aonetheme.com - Service Finder Team
*	More Info: http://aonetheme.com/
*	Coder: Service Finder Team
*	Email: contact@aonetheme.com
*
******************************************************************************/
// When the browser is ready...
jQuery(function() {
	'use strict';
	
	jQuery( 'body' ).on( 'click', '.sfviewallgallery', function (event)
	{
		jQuery('.mfp-gallery').magnificPopup({
          delegate: '.mfp-link2',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: 'title'
          }
        }).magnificPopup('open');
	});
	
	mfp_gallery();
	// magnificPopup function
	function mfp_gallery(){
        jQuery('.mfp-gallery').magnificPopup({
          delegate: '.mfp-link2',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: 'title'
          }
        });
	}
	
	if(rtloption){
		var rtloption = false;
	 }else{
		var rtloption = true; 
	 }
	
	jQuery('.sf-video-slider').owlCarousel({
		rtl: rtloption,
		loop:true,
		autoplay:true,
		margin:30,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive:{
			0:{
				items:1
			},
			480:{
				items:2			
			},				
			991:{
				items:3
			}
		}
	});
	
	mfp_video_gallery();
	// magnificPopup for video function
	function mfp_video_gallery(){	
    jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
	}
	
});