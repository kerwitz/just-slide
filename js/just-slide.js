( function( name, definition ) {
    if ( typeof define === 'function' && typeof define.amd === 'object' ) define( definition );
    else if ( typeof module !== 'undefined' ) module.exports = definition();
    else {
        this.kerwitz || ( this.kerwitz = {} );
        this.kerwitz[ name ] = definition();
    }
}( 'justSlide', function() {
    /**
     * _options contains all .. options.
     */
    var _options = {
        classes: {
            enhanced: 'just-slide',
            at_last_slide: 'at-last-slide',
            at_first_slide: 'at-first-slide'
        },
        attributes: {
            current_slide_index: 'data-current-slide'
        }
    },
    /**
     * Holds references to the slider elements.
     */
    _element_cache = { slider: [], slides: [], wrapper: [] },
    /**
     * _helper contains all private methods which should not be made accessible through the module.
     */
    _helper = {
        /**
         * Update the data-current-slide attribute on the slider.
         *
         * Provide 1 or -1 to shift the current slide index one right or left or set is_absolute to
         * be true to set current slide to a specific value.
         *
         *     // Shift to the next slide.
         *     _helper.updateCurrentSlideIndex( 1, slide_identifierr );
         *
         *     // Set to the fourth slide.
         *     _helper.updateCurrentSlideIndex( 3, slider_identifier, true );
         *
         * This method will also have an eye on wether the slider is at the first or last slide and
         * applies _options.classes.at_first_slide and _options.classes.at_last_slide accordingly.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {number}  amount              1, -1 or a specific index
         * @param  {number}  slider_identifier
         * @param  {boolean} [is_absolute=false] Wether or not to set a specific index
         * @return {number}  The new value of data-curent-slide
         */
        updateCurrentSlideIndex: function( amount, slider_identifier, is_absolute ) {
            var slider = _element_cache.slider[ slider_identifier ],
                slides = _element_cache.slides[ slider_identifier ],
                current_slide_index = _helper.getCurrentSlideIndex( slider_identifier );
            // If is_absolute is not defined let it default to false.
            is_absolute = typeof is_absolute !== 'undefined' ? false : is_absolute;
            // Update the current_slide_index (but don't store it yet).
            current_slide_index = is_absolute ? amount : current_slide_index + amount;
            // If the new current_slide_index is not within the allowed range exit early without
            // storing it. We don't allow navigation beyond the existing slides.
            if ( current_slide_index > slides.length -1 || current_slide_index < 0 ) return;
            // If we made it here we are safe to store the current_slide_index.
            slider.setAttribute( _options.attributes.current_slide_index, current_slide_index );
            // Update the boundary classes on the slider.
            if ( current_slide_index === 0 ) {
                _helper.addClass( slider, _options.classes.at_first_slide );
            } else {
                _helper.removeClass( slider, _options.classes.at_first_slide );
            }
            if ( current_slide_index === slides.length -1 ) {
                _helper.addClass( slider, _options.classes.at_last_slide );
            } else {
                _helper.removeClass( slider, _options.classes.at_last_slide );
            }
            return current_slide_index;
        },
        /**
         * Get the value of the data-current-slide attribute.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {number} slider_identifier
         * @return {number} Either the value of data-current-slide or 0 if undefined
         */
        getCurrentSlideIndex: function( slider_identifier ) {
            var slider = _element_cache.slider[ slider_identifier ];
            return parseInt( slider.getAttribute( _options.attributes.current_slide_index ) ) || 0;
        },
        /**
         * Move the slider to the slide at current-slide-index.
         *
         * Assumes that the current slide value has previously been updated.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {number} slider_identifier
         */
        slide: function( slider_identifier ) {
            var wrapper      = _element_cache.wrapper[ slider_identifier ],
                slides       = _element_cache.slides[ slider_identifier ],
                new_position = ( wrapper.offsetWidth / slides.length ) * _helper.getCurrentSlideIndex( slider_identifier ),
                definition   = 'translate(-' + new_position + 'px, 0px)';
            // Freaking browser prefixes *sigh*..
            wrapper.style.transform       = definition;
            wrapper.style.webkitTransform = definition;
            wrapper.style.mozTransform    = definition;
            wrapper.style.msTransform     = definition;
            wrapper.style.oTransform      = definition;
            // Scale to fit.
            _self.scale.vertically( slider_identifier );
        },
        /**
         * Add class to element.
         *
         * Not using classList because of lack of support in IE9.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @link   http://caniuse.com/#search=classList
         * @param  {element} element
         * @param  {string}  class_name
         */
        addClass: function( element, class_name ) {
            element.className += ' ' + class_name;
        },
        /**
         * Remove class from element.
         * 
         * Not using classList because of lack of support in IE9.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @link   http://caniuse.com/#search=classList
         * @param  {element} element
         * @param  {string}  class_name
         */
        removeClass: function( element, class_name ) {
            element.className = element.className.replace(
                new RegExp( '(?:^|\\s)' + class_name + '(?!\\S)' ),
                ''
            );
        },
        /**
         * Assign a callback to the event of element.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {element}  element
         * @param  {string}   event_name
         * @param  {function} callback
         */
        on: function( element, event_name, callback ) {
            if ( element.attachEvent ) {
                element.attachEvent( 'on' + event_name, callback );
            } else {
                element.addEventListener( event_name, callback );
            }
        }
    },
    /**
     * Wraps the justSlide element into a variable to make self references more easy.
     */
    _self = {
        make: {
            /**
             * Initializes justSlide on the specified element.
             *
             * The slider element should contain article elements wrapped within a div container:
             * - section: slider
             *   - div: wrapper
             *      - article: slide one
             *      - article: slide two
             *      - article: slide three
             *   - /div: wrapper
             * - /section: slider
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} element
             * @return {number}  Identifier for the slider
             */
            slider: function( element ) {
                var slider_identifier = _self.make.elementCache( element );
                _helper.addClass( element, _options.classes.enhanced );
                _helper.updateCurrentSlideIndex( 0, slider_identifier );
                _self.scale.horizontally( slider_identifier );
                _helper.slide( slider_identifier );
                return slider_identifier;
            },
            /**
             * Applies navigate.left as a callback to the click event of the button_element.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} button_element
             * @param  {number}  slider_identifier
             */
            leftNavigationButton: function( button_element, slider_identifier ) {
                _helper.on( button_element, 'click', function() {
                    _self.navigate.left( slider_identifier );
                    return false;
                } );
            },
            /**
             * Applies navigate.right as a callback to the click event of the button_element.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} button_element
             * @param  {number}  slider_identifier
             */
            rightNavigationButton: function( button_element, slider_identifier ) {
                _helper.on( button_element, 'click', function() {
                    _self.navigate.right( slider_identifier );
                } );
            },
            /**
             * (Re-)generate the element cache for the provided slider.
             *
             * When provided with a slider_identifier (number) this method will replace the original
             * cache entries for that identifier with the newly generated. If provided with a dom
             * element the generated cache entries will simply be appended.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number|element} slider_identifier Either the slider_identifier or the dom element
             * @return {number}         slider_identifier
             */
            elementCache: function( slider_identifier ) {
                var slider_element;
                if ( typeof slider === 'number' || typeof slider === 'string' ) {
                    slider_identifier = parseInt( slider_identifier );
                    // Regenerate the element cache for this slider.
                    slider_element = _element_cache.slider[ slider_identifier ];
                    _element_cache.wrapper[ slider_identifier ] = slider_element.getElementsByTagName( 'div' )[ 0 ];
                    _element_cache.slides[ slider_identifier ] = slider_element.getElementsByTagName( 'article' );
                } else {
                    slider_element = slider_identifier;
                    _element_cache.slider.push( slider_element );
                    slider_identifier = _element_cache.slider.length - 1;
                    _element_cache.wrapper[ slider_identifier ] = slider_element.getElementsByTagName( 'div' )[ 0 ];
                    _element_cache.slides[ slider_identifier ] = slider_element.getElementsByTagName( 'article' );
                }
                return slider_identifier;
            }
        },
        scale: {
            /**
             * Update the dimensions of the different parts of the slider.
             *
             * This method calculates the width of the wrapper and the slides based on the current
             * width of the slider. It is called once on the intialization of the slider and you may
             * call it manually whenever the number of slides changes.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number} slider_identifier
             */
            horizontally: function( slider_identifier ) {
                // Get the required elements from our element cache.
                var slider  = _element_cache.slider[ slider_identifier ],
                    wrapper = _element_cache.wrapper[ slider_identifier ],
                    slides  = _element_cache.slides[ slider_identifier ];
                // The wrapper needs to have enough space for each slide.
                wrapper.style.width = ( 100 * slides.length ) + '%';
                // Eeach slide must take equal space within the wrapper.
                for( var i = 0; i < slides.length; i++ ) {
                    slides[ i ].style.width = ( 100 / slides.length ) + '%';
                }
            },
            /**
             * Update the height of the slider based on the height of the currently visible slide.
             *
             * Called once on every slide. You may want to call it manually whenever the height of
             * the current slide has changed.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number} slider_identifier
             */
            vertically: function( slider_identifier ) {
                // Get the required elements from our element cache.
                var slider = _element_cache.slider[ slider_identifier ],
                    current_slide = _element_cache.slides[ slider_identifier ][ _helper.getCurrentSlideIndex( slider_identifier ) ];
                // Make enough vertical space for the current slide to be completely visible.
                slider.style.height = current_slide.offsetHeight + 'px';
            }
        },
        navigate: {
            /**
             * Navigates to the slide at slide_index.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number}  slide_index
             * @param  {element} slider_identifier
             */
            to: function( slide_index, slider_identifier ) {
                _helper.updateCurrentSlideIndex( slide_index, slider_identifier, true );
                _helper.slide( slider_identifier );
            },
            /**
             * Navigates to the slide left to the current one.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} slider_identifier
             */
            left: function( slider_identifier ) {
                _helper.updateCurrentSlideIndex( -1, slider_identifier );
                _helper.slide( slider_identifier );
            },
            /**
             * Navigates to the slide right to the current one.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} slider_element
             */
            right: function( slider_identifier ) {
                _helper.updateCurrentSlideIndex( 1, slider_identifier );
                _helper.slide( slider_identifier );
            }
        }
    };
    return _self;
} ) );
