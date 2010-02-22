/*
 * Inflate - jQuery Plugin
 * A simple plugin that resizes an element and its ancestors, as required.
 *
 * Inflate provides constrained ($.inflateTo()) and unconstrained ($.inflate())
 * expansion. The constrained method allows an element to be inflated to fill
 * the entire dimension(s) of an ancestor element.
 *
 * Using either method, height and width can be inflated independently.
 *
 * Constrained Usage:
 * 	Inflate width and height
 *	$('selector').inflateTo( '.parent-selector' )
 *
 * 	Inflate width only
 *	$('selector').inflateTo( '.parent-selector', { height: false } )
 *
 * 	Inflate height only
 *	$('selector').inflateTo( '.parent-selector', { width: false } )
 *
 * Unconstrained Usage:
 * 	Expand width and height
 * 	$(selector).inflate({ width: 800, height: 600 })
 *
 *	Expand width only
 *	$(selector).inflate({ width: 800 })
 *
 *	Expand height only
 *	$(selector).expand({ height: 800 })
 *
 * Copyright (c) 2010 Rob Wilkerson
 * Examples and documentation at: TBD
 *
 * Version: 0.5.0 (2/22/2010)
 * Requires: jQuery v1.4+
 * Tested:   jQuery v1.4.1
 *           jQuery v1.4.2
 *
 * TODO:
 * 	- Implement width inflation. I didn't need that when this plugin was conceived
 * 	  so I haven't built the functionality.
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function($) {
	var settings;
	var e;
	var w;
	var h;

	$.fn.inflate = function( options ) {
		settings = $.extend({
				width: null,
				height: null,
				debug: false
			},
			options
		);

		this.each( function() {
			e = $(this);

			settings.width  = parseInt( settings.width ) || null;
			settings.height = parseInt( settings.height ) || null;

			if( isNaN( settings.width && isNaN( settings.height ) ) ) {
				return this;
			}

			/** TODO: Implement a variation to expand width. */
			if( settings.width && !isNaN( settings.width ) ) {
				// Not implemented
			}

			if( settings.height && !isNaN( settings.height ) ) {
				var delta      = settings.height - e.height();
				var previous_e = this;

				$(this).height( $(this).height() + delta );

				if( settings.debug ) {
					console.log( 'Added ' + delta + ' and resized matched element to ' + $(this).height() );
					console.log( 'Iterating over parent elements...' );
				}

				e.parentsUntil( document ).each( function() {
					if( settings.debug ) {
						console.log( '  => Current parent: ' + select( this ) );
						console.log( '  => Previous parent: ' + select( this ) );
					}

					/**
					 * Only adjust the height if the current element's height is less
					 * than the height of its container.
					 */
					if( $(this).height() < $(previous_e).outerHeight( true ) ) {
						$(this).height( $(this).height() + delta );

						if( settings.debug ) {
							console.log( '    => Resizing ' + this.tagName + ' (' + select( this ) + ') from ' + $(this).height() + ' (height) ' );
							console.log( '    => Resized to ' + $(this).height() );
						}
					}
					else {
						if( settings.debug ) {
							console.log( '    => No forced resize required.');
						}
					}

					previous_e = this;
				});
			}
		});

		return this;
	};

	/**
	 * Operates from the outside in by expanding an element (and its ancestors) to
	 * the confines of a given ancestor.
	 *
	 * @param		selector		The parent element selector
	 */
	$.fn.inflateTo = function( selector, options ) {
		settings = $.extend({
				width: false,
				height: true,
				debug: false
			},
			options
		);

		if( settings.debug ) {
			console.log( 'Settings passed to $.maximizeTo:' );
			for( var i in settings ) {
				console.log( '    => settings[' + i + '] = ' + settings[i] );
			}
		}

		this.each( function() {
			e = $(this);

			/** TODO: Implement a variation to maximize width. */
			if( settings.width ) {
				// Not implemented
			}

			if( settings.height ) {
				var previous_e   = selector;

				if( settings.debug ) {
					console.log( 'Maximizing height of ' + select( this ) + ' against ' + select( previous_e ) + ' (' + $(previous_e).height() + ')' );
				}

				$(e.parentsUntil( selector ).get().reverse()).add(this).each( function( i, value ) {
					/** The max height the current element can reach */
					h = $(previous_e).height();

					if( settings.debug ) {
						console.log( '  => Setting height of ' + select( this ) + ' against ' + select( previous_e ) + ' (' + h + ')' );
					}

					/**
					 * Adjust the available height for other visible siblings that aren't
					 * hidden or positioned outside of the normal flow.
					 */
					$(previous_e).children().not( this ).each( function() {
						/** TODO: maybe there's a better way to do this? */
						if( $(this).css( 'position' ) != 'absolute' && $(this).css( 'display' ) != 'none' && $(this).css( 'float' ) == 'none' ) {

							if( settings.debug ) {
								console.log( '    => -' + $(this).outerHeight( true ) + ' (' + select( this ) + ')' );
							}

							h -= $(this).outerHeight( true )
						}
						else {
							if( settings.debug ) {
								console.log( '    => -0 (No need to adjust for ' + select( this ) + ')' );
							}
						}
					});

					/**
					 * Set the element height with one final adjustment for the element's
					 * own padding, borders & margins
					 */
					$(this).height( h - ( $(this).outerHeight( true ) - $(this).height() ) );
					/** Give the next element access to its parent */
					previous_e = this;

					if( settings.debug ) {
						console.log( '  => Set height to ' + h + ' - ( ' + $(this).outerHeight( true ) + ' - ' + $(this).height() + ' )' );
					}
				});
			}
		});

		return this;
	}

	/**
	 * Helper function that attempts to format elements for display in debug
	 * messages..
	 */
	function select( elem ) {
		var selector = elem.tagName +
		               ( $(elem).attr('id') ? '#' + $(elem).attr('id') : '' ) +
									 ( $(elem).attr('class') ? '.' + $(elem).attr('class') : '' );
		return selector;
	}

	/**
	 * Code, um, borrowed from the Yahoo media player. Thanks, Yahoo.
	 *
	 * Since we're doing a lot of debug logging to the console, let's only
	 * do that if the console, you know, exists.
	 */
	if( !( 'console' in window ) || !( 'firebug' in console ) ) {
			var console_methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];

			window.console = {};
			for( var i = 0; i < console_methods.length; ++i ) {
				window.console[console_methods[i]] = function() {};
			}
	}
})(jQuery);
