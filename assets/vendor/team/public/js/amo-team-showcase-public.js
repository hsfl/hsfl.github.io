"use strict";

(function( $ ) {

	var $window = $( window );

/*--------------------------------------------------------------------
 ▐	1. GENERAL
--------------------------------------------------------------------*/
	var general = {

		/**
		 * An asynchronous function call
		 *
		 * @since    1.0.0
		 */
		asyncCall: function( callback, delay ) {
			delay = delay || 1;
		setTimeout(function() {
			callback();
		}, delay);
	}
	}; // panel | OBJ

/*--------------------------------------------------------------------
 ▐	2. INFO PANEL
--------------------------------------------------------------------*/
	var infoPanel = {

		/**
		 * Init Magnific Popup (JS plugin) for certain thumbnails' grid
		 *
		 * @since    1.0.0
		 */
		initMagnificPopup: function( grid ) {
			grid.magnificPopup( {
				delegate:        '.amoteam-popup-link',
				type:            'inline',
				midClick:        true, // Allow opening popup on middle mouse click.
				mainClass:       "amoteam-modal" + (amoTeamVars['panel-alt-scroll'] ? ' amoteam-modal-alt-scroll' : ''),
				fixedContentPos: (! amoTeamVars[ 'panel-alt-scroll' ]),
				fixedBgPos:      true,
				overflowY:       "auto",
				closeBtnInside:  false,
				showCloseBtn:    false,
				preloader:       false,
				alignTop:        true,
				removalDelay:    340,
				callbacks: {
					beforeClose: function() { // Popup close has been initiated
						var panel = this.content;
						infoPanel.panelAnimation( panel )
					} // beforeClose
				} // callbacks
			} );
		}, // FNC


		
		/**
		 * Animate panel closing/opening
		 *
		 * @since    1.0.0
		 */
		panelAnimation: function( panel, open ) {
			var panel_alignment = panel.data( 'align' ),
			    outClass, inClass;

			// If panel alignment is 'center'
			if ( - 1 !== panel_alignment.indexOf( 'c' ) ) {
				inClass = 'amoteam-fadeIn';
				outClass = 'amoteam-fadeOut';
			} else {    // If panel alignment is 'left' or 'right'
				inClass = 'amoteam-fadeSlideIn-' + panel_alignment;
				outClass = 'amoteam-fadeSlideOut-' + panel_alignment;
			} // IF

			// apply panel animation classes
			if ( open ) { // on open panel
				panel.removeClass( outClass );
				panel.toggleClass( inClass );
			} else { // on close panel
				panel.removeClass( inClass );
				panel.toggleClass( outClass );
			}
		}, // FNC | panelAnimation


		/**
		 * Init info panel functionality
		 *
		 * @since    1.0.0
		 */
		panelInit: function() {

			// panel animation
			$( document ).on( 'click', '.amoteam-popup-link', function() {
				var panel = $( this.getAttribute( 'data-mfp-src' ) ),
				    subtitle;

				infoPanel.panelAnimation( panel, true );

				// fix title & subtitle block position
				general.asyncCall( function() {
					if ( panel.data( 'format' ).indexOf( 'image' ) > -1 ) {
						subtitle = panel.find( '.amoteam-panel__subtitle' );
						subtitle.parent().css( 'bottom', - subtitle.outerHeight() ).addClass( 'amoteam-opacity-1' );
					}
				} ); // end asyncCall

			} ); // ON click

			// load the panel image only on member thumbnail hover
			$( document ).on( 'mouseover', '.amoteam-popup-link', function() {
				var panel = $( this.getAttribute( 'data-mfp-src' ) );

				// panel image is not loaded yet
				if ( ! panel.data( 'img-loaded' ) ) {
				    var panelImage = panel.find( '.amoteam-panel__img' );

					// if panel image preload is off
					if ( ! panelImage.data( 'img-preloaded' ) ) {
						// load the image
						panelImage.attr( 'src', panelImage.data( 'src' ) );

						// set panel's flag when image loaded
						panel.data( 'img-loaded', true );
					} // IF | panel image preload

				} // IF panel image is not loaded yet

				//// show the image
				//panel.imagesLoaded().done( function() {
				//	panelImage.addClass( 'amoteam-opacity-1' );
				//} );
			} ); // ON mouseover

			// close panel
			$( document ).on( 'click', '.amoteam-btn-panel-close', function() {
				$.magnificPopup.close();
				$('.mfp-content' ).click();
			} );

			} // FNC | panelInit

	}; // panel | OBJ

/*--------------------------------------------------------------------
 ▐	3. SHORTCODES
--------------------------------------------------------------------*/
	var shortcodes = {

		/**
		 * Init needed functionality for certain/current shortcode, using its array of values.
		 *
		 * @since    1.0.0
		 */
		initShortcode: function( scArray ) {
			// If array of values for current shortcode is empty - return
			if ( scArray == false ) return;

			// for each shortcode load/init its functionality and dependencies
			$.each( scArray, function( i, scArray ) {
				//switch (scArray.type) {
				//	case 'team':
				//		break;
				//} // SWITCH

				var grid = $( scArray.scID );

				// A fix. Remove events and magnificPopup data (possibly from other plugins/scripts)
				// already applied to the thumbnails' container (grid var) and all <a> links inside it.
				var gridPlusLinks = grid.add( grid.find( 'a' ) ).removeData('magnificPopup');

				// Clear/remove all jQuery events only if such option is enabled in the plugin options
				if (amoTeamVars[ 'thumbs-clear-events' ]) {
					gridPlusLinks.off();
				} // IF

				shortcodes.initWookmarkSC( grid, scArray );
				infoPanel.initMagnificPopup( grid );
			} ); // EACH

		}, // FNC


		/**
		 * Init Wookmark (JavaScript, responsive grid plugin) for current/certain grid of thumbnails
		 *
		 * @since    1.0.0
		 */
		initWookmarkSC: function( grid, scArray ) {
			grid.imagesLoaded().done( function() {
				grid.wookmark( {
					align:         scArray.align,
					autoResize:    true,
					resizeDelay:   250,
					container:     grid,
					offset:        scArray.itemMargin,
					itemWidth:     scArray.itemWidth,
					flexibleWidth: ( scArray.fullWidth == 'yes' ) ? '100%' : true
				} ); // wookmark
			} ).done( function() {

				// js fix for round image style, if the initial image is not a rectangle
				if ( grid.hasClass('amoteam-round-style') ) {
					shortcodes.roundThumbnailFix( grid );

					grid.on( 'amoteam/wookmark-refresh', function( e, start ) {
						if ( ! start ) { // on resize/refresh only
							shortcodes.roundThumbnailFix( grid );
						}
					} );
				} // IF | image round style fix

				// show the grid
				grid.addClass( 'amoteam-visible' );
			} ); // imagesLoaded

		}, // FNC


		/**
		 * Fix for round thumbnails style of showcase;
		 * makes all thumbnails round not matter what aspect ration of the image is.
		 * Works because of changes added to Wookmark.js file.
		 *
		 * @since    1.0.0
		 */
		roundThumbnailFix: function( grid ) {
			grid.find('li').each( function() {
				var $this =  $(this );
				if ( $this.hasClass('amoteam-js-round-fix') ) {
					$this.find( '.amoteam-member-img' ).css( {
						width:  $this.width(),
						height: $this.width()
					} );
				}
			} ); // end EACH
		} // FNC


	}; // shortcodeHelpers | OBJ


	// Init Shortcodes
	shortcodes.initShortcode( amoTeamVars.teamSC );    // Team shortcode
	shortcodes.initShortcode( amoTeamVars.memberSC );  // Member shortcode


	// Load | Event
	$window.on( 'load', function() {

		// Init panel
		infoPanel.panelInit();

	} ); // ON load


})( jQuery );
