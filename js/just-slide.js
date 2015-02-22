( function( name, definition ) {
    if ( typeof define === 'function' && typeof define.amd === 'object' ) define( definition );
    else if ( typeof module !== 'undefined' ) module.exports = definition();
    else this[ name ] = definition();
}( 'justSlide', function() {
    /**
     * _options contains all .. options.
     */
    var _options = {
        regex: {
            class: function( class_name ) { return '(?:^|\\s)' + class_name + '(?!\\S)'; }
        },
        classes: {
            enhanced: 'just-slide',
            at_last_child: 'at-last-child',
            at_first_child: 'at-first-child'
        },
        attributes: {
            current_child_index: 'data-current-child-index'
        }
    },
    /**
     * Holds references to the slider elements.
     */
    _element_cache = { slider: [], children: [], wrapper: [] },
    /**
     * _helper contains all private methods which should not be made accessible through the module.
     */
    _helper = {
        /**
         * Update the data-current-child attribute on the slider_element.
         *
         * Provide 1 or -1 to shift the current-child one right or left or set is_absolute to be
         * true to set current-child to a specific child.
         *
         *     // Shift to the next child.
         *     _helper.updateCurrentChild( 1, slider );
         *
         *     // Set to the fourth child.
         *     _helper.updateCurrentChild( 3, slider, true );
         *
         * This method will also have an eye on wether the slider is at the first or last child and
         * applies _options.classes.at_first_child and _options.classes.at_last_child accordingly.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {number}  amount              1, -1 or a specific index
         * @param  {element} slider
         * @param  {boolean} [is_absolute=false] Wether or not to set a specific index
         * @return {number}  The new value of data-curent-child
         */
        updateCurrentChildIndex: function( amount, slider_identifier, is_absolute ) {
            var slider = _element_cache.slider[ slider_identifier ],
                children = _element_cache.children[ slider_identifier ],
                current_child_index = _helper.getCurrentChildIndex( slider_identifier );
            is_absolute = typeof is_absolute !== 'undefined' ? false : is_absolute;
            current_child_index = is_absolute ? amount : current_child_index + amount;
            // If the new current_child_index is not within the allowed range exit early without
            // storing it. We don't allow navigation beyond the existing child.
            if ( current_child_index > children.length -1 || current_child_index < 0 ) return;
            slider.setAttribute( _options.attributes.current_child_index, current_child_index );
            // Update the boundary classes on the slider.
            if ( current_child_index === 0 ) {
                _helper.addClass( slider, _options.classes.at_first_child );
            } else {
                _helper.removeClass( slider, _options.classes.at_first_child );
            }
            if ( current_child_index === _element_cache.children[ slider_identifier ].length -1 ) {
                _helper.addClass( slider, _options.classes.at_last_child );
            } else {
                _helper.removeClass( slider, _options.classes.at_last_child );
            }
            return current_child_index;
        },
        /**
         * Get the value of the data-current-child attribute of the slider element.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {element} slider
         * @return {number}  Either the value of data-current-child or 0 if undefined
         */
        getCurrentChildIndex: function( slider_identifier ) {
            var slider = _element_cache.slider[ slider_identifier ];
            return parseInt( slider.getAttribute( _options.attributes.current_child_index ) ) || 0;
        },
        /**
         * Move the slider to the child at child_index.
         *
         * Assumes that the current child value has previously been updated.
         *
         * @author Marco Kerwitz <marco@kerwitz.com>
         * @param  {number} slider_identifier
         */
        slide: function( slider_identifier ) {
            var wrapper = _element_cache.wrapper[ slider_identifier ],
                children = _element_cache.children[ slider_identifier ],
                new_position = ( wrapper.offsetWidth / children.length ) * _helper.getCurrentChildIndex( slider_identifier ),
                definition = 'translate(-' + new_position + 'px, 0px)';
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
            var regex = new RegExp( _options.regex.class( class_name ) );
            element.className = element.className.replace( regex, '' );
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
             * Applies required classes and callbacks to the provided element to make it slide.
             *
             * The slider element should contain article elements wrapped within a div container:
             * - section: slider
             *   - div: wrapper
             *      - article: child one
             *      - article: child two
             *      - article: child three
             *   - /div: wrapper
             * - /section: slider
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} element
             * @return {number}  Identifier for the slider
             */
            slider: function( element ) {
                var slider_identifier;
                slider_identifier = _self.make.elementCache( element );
                // The enhanced class may be used in css.
                _helper.addClass( element, _options.classes.enhanced );
                _helper.updateCurrentChildIndex( 0, slider_identifier );
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
                    _element_cache.children[ slider_identifier ] = slider_element.getElementsByTagName( 'article' );
                } else {
                    slider_element = slider_identifier;
                    _element_cache.slider.push( slider_element );
                    slider_identifier = _element_cache.slider.length - 1;
                    _element_cache.wrapper[ slider_identifier ] = slider_element.getElementsByTagName( 'div' )[ 0 ];
                    _element_cache.children[ slider_identifier ] = slider_element.getElementsByTagName( 'article' );
                }
                return slider_identifier;
            }
        },
        scale: {
            /**
             * Update the dimensions of the different parts of the slider.
             *
             * This method calculates the width of the child wrapper and the children based on the
             * current width of the slider. It is called once on the intialization of the slider
             * and you may call it manually whenever the \number of children changes.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number} slider_identifier
             */
            horizontally: function( slider_identifier ) {
                // Get the required elements from our element cache.
                var slider   = _element_cache.slider[ slider_identifier ],
                    wrapper  = _element_cache.wrapper[ slider_identifier ],
                    children = _element_cache.children[ slider_identifier ];
                // The wrapper needs to have enough space for each children.
                wrapper.style.width = ( 100 * children.length ) + '%';
                // Eeach children must take equal space within the wrapper.
                for( var i = 0; i < children.length; i++ ) {
                    children[ i ].style.width = ( 100 / children.length ) + '%';
                }
            },
            /**
             * Update the height of the slider based on the height of the currently visible child.
             *
             * Called once on every slide. You may want to call it manually whenever the height of
             * the current child has changed.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number} slider_identifier
             */
            vertically: function( slider_identifier ) {
                // Get the required elements from our element cache.
                var slider = _element_cache.slider[ slider_identifier ],
                    current_child = _element_cache.children[ slider_identifier ][ _helper.getCurrentChildIndex( slider_identifier ) ];
                // Make enough vertical space for the current child to be completely visible.
                slider.style.height = current_child.offsetHeight + 'px';
            }
        },
        navigate: {
            /**
             * Navigates to the child at child_index.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {number}  child_index
             * @param  {element} slider_identifier
             */
            to: function( child_index, slider_identifier ) {
                _helper.updateCurrentChildIndex( child_index, slider_identifier, true );
                _helper.slide( slider_identifier );
            },
            /**
             * Navigates to the child left to the current one.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} slider_identifier
             */
            left: function( slider_identifier ) {
                _helper.updateCurrentChildIndex( -1, slider_identifier );
                _helper.slide( slider_identifier );
            },
            /**
             * Navigates to the child right to the current one.
             *
             * @api
             * @author Marco Kerwitz <marco@kerwitz.com>
             * @param  {element} slider_element
             */
            right: function( slider_identifier ) {
                _helper.updateCurrentChildIndex( 1, slider_identifier );
                _helper.slide( slider_identifier );
            }
        }
    };
    return _self;
} ) );
