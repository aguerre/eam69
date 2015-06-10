jQuery( document ).ready(function($) {
	"use strict";

	// $('img', 'div.flexslider').on('load', function() {
		// var $img = $(this),
		// imgHeight = $img.outerHeight();
		// $img.parent().height(imgHeight);
	// });
	
    /* ---------------------------------------------------------------------- */
	/*	Bootstrap Tabs
	/* ---------------------------------------------------------------------- */
	
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })
    
    $('#myTab1 a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })
	
	/* ---------------------------------------------------------------------- */
	/*	For HTML Validation
	/* ---------------------------------------------------------------------- */
	
	$('a[data-rel]').each(function () {
        $(this).attr('rel', $(this).data('rel'));
    });

	/* ---------------------------------------------------------------------- */
	/*	Contact us Fields and other fields 
	/* ---------------------------------------------------------------------- */

	jQuery(' textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').focus(function() {
		if (!jQuery(this).data("DefaultText")) jQuery(this).data("DefaultText", jQuery(this).val());
		if (jQuery(this).val() != "" && jQuery(this).val() == jQuery(this).data("DefaultText")) jQuery(this).val("");
	  }).blur(function() {
		if (jQuery(this).val() == "") jQuery(this).val(jQuery(this).data("DefaultText"));
	});
	
	/* ---------------------------------------------------------------------- */
	/*	FlexSlider
	/* ---------------------------------------------------------------------- */
	
	// if($('.flexslider').length){		
		// $('.flexslider').flexslider({
			// animation: "fade"
		// });
	// }	
	if($('.slides').length){
		$('.slides').bxSlider();
	}
	
	
	/* ---------------------------------------------------------------------- */
	/*	Masonary Script for Blog Layout
	/* ---------------------------------------------------------------------- */
	
	if($("#container").length){
		var container = jQuery('#container');
			jQuery(container).imagesLoaded( function(){
			jQuery(container).isotope({
			columnWidth: 10,
			itemSelector: '.box'
			});
		});
	}
	
	/* ---------------------------------------------------------------------- */
	/*	jPlayer under Slider
	/* ---------------------------------------------------------------------- */
	
	if($("#jp_container_1").length){
		var myPlaylist2 = new jPlayerPlaylist({
			jPlayer: "#jquery_jplayer_1",
			cssSelectorAncestor: "#jp_container_1"
		}, [
				{
					title:"THE RIGHT SWEET VOICE 1",
					appstore:"#",
					grvstore:"#",
					soundcloud:"#",
					mp3:"song/kabhijobaadalbarse.mp3",
					url:"#"
				},{
					title:"ON YOUR GRAVE LOVE",
					appstore:"#",
					grvstore:"#",
					soundcloud:"#",
					mp3:"song/kabhijobaadalbarse.mp3",
					url:"#"
				},{
					title:"THE NEW MUSIC BROWN",
					appstore:"#",
					grvstore:"#",
					soundcloud:"#",
					mp3:"song/kabhijobaadalbarse.mp3",
					url:"#"
				},{
					title:"PUT THE NEEDLE DOWN",
					appstore:"#",
					grvstore:"#",
					soundcloud:"#",
					mp3:"song/kabhijobaadalbarse.mp3",
					url:"#"
				},{
					title:"Work Hard, Play Hard",
					appstore:"#",
					grvstore:"#",
					soundcloud:"#",
					mp3:"song/kabhijobaadalbarse.mp3",
					url:"#"
				},                          
			], {
			swfPath: "js/Jplayer.swf",
			supplied: "oga, mp3",
			wmode: "window",
			currentTime: '.jp-current-time',
			smoothPlayBar: true,
			displayTime: 'slow',
			keyEnabled: true
		});
		jQuery("#jp_container_1").css("opacity",1);
	}
	
	/* ---------------------------------------------------------------------- */
	/*	Menu Toggle on Responsive
	/* ---------------------------------------------------------------------- */
	
	MenuToggle();
	jQuery(window) .resize(function(event) {
		/* Act on the event */
		MenuToggle()
	});
    jQuery("#menus  li.sub-icon > a") .bind("click",function(){
      jQuery(this) .next() .slideToggle(200);
      return false;
	});
	
    jQuery( ".cs-click-menu" ).click(function() {
        jQuery(this) .next() .slideToggle(200)
	});
	
	/* ---------------------------------------------------------------------- */
	/*	Jplayer on Album Detail Page
	/* ---------------------------------------------------------------------- */
	  
	if($("#jquery_jplayer_n").length){
		var myPlaylist = new jPlayerPlaylist({
			jPlayer: "#jquery_jplayer_n",
			cssSelectorAncestor: "#jp_container_n"
		}, [
			{
				title:"THE RIGHT SWEET VOICE",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"ON YOUR GRAVE LOVE",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"THE NEW MUSIC BROWN",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"PUT THE NEEDLE DOWN",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"Work Hard, Play Hard",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"Caro Mangon Man",
				mp3:"song/kabhijobaadalbarse.mp3"
			},{
				title:"Temperd Songs",
				mp3:"song/kabhijobaadalbarse.mp3"
			},        ], {
			swfPath: "js",
			supplied: "mp3",
			wmode: "window",
			smoothPlayBar: true,
			keyEnabled: true
		});
	}

	/* ---------------------------------------------------------------------- */
	/*	Other Random Scripts
	/* ---------------------------------------------------------------------- */
	
	$( ".search a" ).click(function() {
		$( ".search form" ).toggleClass('add-form');
	});

	if($('#DateCountdown').length){
		$("#DateCountdown").time_circles();
	}
	
	if($("[rel=tooltip]").length){
		$("[rel=tooltip]").tooltip();
	}	
	
	$(".btntoggle").click(function(){
		$(".jp-playlist").toggle();
	});	
	
	/* ---------------------------------------------------------------------- */
	/*	PrettyPhoto Modal Box Script
	/* ---------------------------------------------------------------------- */
	
	if($('.kf-gallery-pp').length){
		$("a[rel^='prettyPhoto']").prettyPhoto({
			animation_speed: 'normal',
			slideshow: 10000,
			autoplay_slideshow: true
		});
	}
	
	/* ---------------------------------------------------------------------- */
	/*	Google Map
	/* ---------------------------------------------------------------------- */
	if($('#map-canvas').length){
		google.maps.event.addDomListener(window, 'load', initialize);
	}
	  
});

/* ---------------------------------------------------------------------- */
/*	Google Map Function for Custom Style
/* ---------------------------------------------------------------------- */
function initialize() {
var MY_MAPTYPE_ID = 'custom_style';
var map;
		var brooklyn = new google.maps.LatLng(40.6743890, -73.9455);
	var featureOpts = [
		{
		  stylers: [
			{ hue: '#E24F3D' },
			{ visibility: 'simplified' },
			{ gamma: 0.5 },
			{ weight: 0.5 }
		  ]
		},
		{
		  elementType: 'labels',
		  stylers: [
			{ visibility: 'on' }
		  ]
		},
		{
		  featureType: 'water',
		  stylers: [
			{ color: '#ffffff' }
		  ]
		}
	];

	var mapOptions = {
		zoom: 12,
		center: brooklyn,
		mapTypeControlOptions: {
		  mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		},
		mapTypeId: MY_MAPTYPE_ID
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
		  mapOptions);

	var styledMapOptions = {
		name: 'Custom Style'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

/* ---------------------------------------------------------------------- */
/*	Menu Toggle Function
/* ---------------------------------------------------------------------- */

function MenuToggle() {
	var a = jQuery(window).width();
	var b = 1000
	if (a <= b) {
		jQuery("#menus ul") .parent('li') .addClass('sub-icon');
		jQuery("#menus ul") .hide();
	} else {
			jQuery("#menus ul,#menus") .show();
	}
}

/* ---------------------------------------------------------------------- */
/*	Sticky Script
/* ---------------------------------------------------------------------- */

jQuery(function($) {
	
	$(document).ready( function() {
		"use strict";

		/* ---------------------------------------------------------------------- */
		/*	Menu Script
		/* ---------------------------------------------------------------------- */

		$('.navigation').stickUp({
			parts: {
			  0:'home',
			  1:'features',
			  2: 'updates',
			  3: 'installation',
			  4: 'one-pager',
			  5: 'extras',
			  6: 'wordpress',
			  7: 'contact'
			},
			itemClass: 'menuItem',
			itemHover: 'active',
			topMargin: 'auto'
		});
		
		/* ---------------------------------------------------------------------- */
		/*	Music Player Sticky
		/* ---------------------------------------------------------------------- */
		
		// if($('.plyer-sec').length){
			// $('.plyer-sec').stickUp({
				// parts: {
				  // 0:'home',
				  // 1:'features',
				  // 2: 'updates',
				  // 3: 'installation',
				  // 4: 'one-pager',
				  // 5: 'extras',
				  // 6: 'wordpress',
				  // 7: 'contact'
				// },
				// itemClass: 'menuItem',
				// itemHover: 'active',
				// topMargin: 'auto'
			// });
		// }
	});
});