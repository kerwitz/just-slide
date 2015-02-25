# just-slide

[![Flattr](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=kerwitz&url=https%3A%2F%2Fgithub.com%2Fkerwitz%2Fjust-slide)
[![Bower version](https://badge.fury.io/bo/just-slide.svg)](http://badge.fury.io/bo/just-slide)

A very simplistic pure Javascript, no-dependencies approach to a slider component.

From time to time I need to include a slider into a customers website and far too often do I end up
spending more time on setting up and tweaking a heavy jQuery slider than I really want to.
just-slide is a very basic approach to a slider component that does not require jQuery or any other
dependency.

## Basic usage
1. Grab the [current release](https://github.com/kerwitz/just-slide/releases) or install using bower:

   `bower install just-slide`

   > **Note:** the files in this repository might be unstable, please install the latest release
   > in favor over taking the files from the repository directly.

2. Include the needed files in your html file:

   ```html
   <!-- include the styling in the head. -->
   <link rel="stylesheet" href="lib/just-slide/css/just-slide.min.css">
   <!-- include the Javascript in the body. -->
   <script src="lib/just-slide/js/just-slide.min.js"></script>
   ```
3. Mark up your slider:

   ```html
   <section id="slider">
       <button>&larr; Previous child</button>
       <button>Next child &rarr;</button>
       <div>
           <article>First child here.</article>
           <article>Second child here.</article>
       </div>
   </section>
   ```
4. Initiate just-slide:

   ```js
   var slider = document.getElementById( 'slider' ),
       buttons = slider.getElementsByTagName( 'button' ),
       slider_identifier = justSlide.make.slider( slider );
   justSlide.make.leftNavigationButton( buttons[ 0 ], slider_identifier );
   justSlide.make.rightNavigationButton( buttons[ 1 ], slider_identifier );
   ```

## Advanced usage

### Compatibilities

just-slide is fully AMD (e.g. requireJS) and commonJS compatible but works just well without them.
If no require or define functions are found the justSlide object gets exposed in the global scope
for you to use, or else it registers itself as an AMD or commonJS module and can be loaded just like
you are used to:

#### Global scope
```js
// justSlide object resides in the global scope.
var slider_identifier = justSlide.make.slider( document.getElementById( 'slider' ) );
```

#### AMD
```js
requirejs( [ 'justSlide' ], function( justSlide ) {
 var slider_identifier = justSlide.make.slider( document.getElementById( 'slider' ) );
});
```

#### CommonJS
```js
var justSlide = require( './justSlide' ),
 slider_identifier = justSlide.make.slider( document.getElementById( 'slider' ) );
```

### Styling
By default just-slide applies very little styling to your elements, it will only float the children,
make their parent container absolutely positioned and add `overflow:hidden` to the section. The
height of the slider will be set on each slide based on the height of the currently visible child.
The width of the children wrapper and each children are calculated based on the number of children.
You may style all elements to your liking. Have a look at the `css\themes\` folder for some inspiration.
You can use CSS transforms to animate the slide effect and / or the height adjustment.

#### CSS classes used by just-slide
| Class            | Element | Description                                                                                          |
|------------------|---------|------------------------------------------------------------------------------------------------------|
| `just-slide`     | slider  | Applied to the slider once it gets enhanced through `justSlide.make.slider()`.                       |
| `at-first-slide` | slider  | just-slide will apply this class to the container if there are no previous children to navigate to.  |
| `at-last-slide`  | slider  | just-slide will apply this class to the container if there are no following children to navigate to. |

### Navigating within the slider
You have two choices for setting up navigation controls for your slider. You may either use the
wrapper functions `justSlide.make.leftNavigationButton()` and `justSlide.make.rightNavigationButton()`
or use the `justSlide.navigate.left()`, `justSlide.navigate.right()` or `justSlide.navigate.to()`
functions directly and assign them to the events of your liking by yourself. The `justSlide.make.*`
functions will do the same but they handle the different implementations for event listeners for you.
Have a look at the public API depicted below for information about the listed methods.

### Data attributes

#### data-current-slide (default: 0)
This attributes holds the currently visible child of the slider. It is updated whenever one of the
`justSlide.navigate.*` functions is called. Initial value defaults to `0`, so the slider will start
off at the first slide in the source. Note that counting starts at 0. You can customize at which slide the
slider should start off by providing your own value on the markup:
```html
<section id="slider" data-current-slide="1">
    <!-- ... -->
</section>
```
**Warning:** do not interfere with this value after the slider has been initialized. If you need to
navigate within the slider use the `justSlide.navigate.*` functions below.

## Public API

### Make

#### justSlide.make.slider( {element} element )
Initializes justSlide on the provided element.
Returns the internal `slider_identifier` which must be used as a reference to the slider when calling
any other method on it.
```js
var slider_identifier = justSlide.make.slider( document.getElementById( 'slider' ) );
```

#### justSlide.make.leftNavigationButton( {element} button, {number} slider_identifier )
This function will assign the `justSlide.navigate.left()` function to the click event of `button`.
```js
// Hook #leftButton up with justSlide.navigate.left() as a click event callback.
justSlide.make.leftNavigationButton(
    document.getElementById( 'leftButton' ),
    slider_identifier
);
```

#### justSlide.make.rightNavigationButton( {element} button, {number} slider_identifier )
This function will assign the navigate.right function to the click event of `button`.
```js
// Hook #rightButton up with justSlide.navigate.right() as a click event callback.
justSlide.make.rightNavigationButton(
    document.getElementById( 'rightButton' ),
    slider_identifier
);
```

#### justSlide.make.elementCache( {number|element} slider )
This function (re-)generates the element cache for the provided slider.
The element cache contains references to the slider, the child wrapper and the children of the slider.
Call this function manually if you add or remove the children.
```js
// Rebuild the cache for #slider.
justSlide.make.elementCache( document.getElementById( 'slider' ) );
justSlide.make.elementCache( slider_identifier );
```

### Navigate

#### justSlide.navigate.to( {number} child_index, {number} slider_identifier )
Use this function to navigate to a specific child of the slider.
```js
// Navigate to the fourth child (counting starts at 0).
justSlide.navigate.to( 3, slider_identifier );
```

#### justSlide.navigate.left( {number} slider_identifier )
Use this function to navigate one child to the left. If the current child is the first one this
function will do nothing.
```js
justSlide.navigate.left( slider_identifier );
```

#### justSlide.navigate.right( {number} slider_identifier )
Use this function to navigate one child to the right. If the current child is the the last one
this function will do nothing.
```js
justSlide.navigate.left( slider_identifier );
```

## Contributing

1. To contribute please fork this repository:

   ```
   git clone https://github.com/kerwitz/just-slide.git
   ```
2. Install all dependencies with npm:

   ```
   cd path\to\just-slide
   npm install
   ```
3. After that you can make use of Grunt to watch the less and Javascript files within the project:

   ```
   grunt
   ```

   This will initiate the watch task and makes sure that the CSS and minified Javascript files are
   always up to date.
4. Once you have made the desired changes to your fork you can open a pull request on this repository.
   Please report any problems with just-slide as issues on this repository.

## Changelog

Have a look at the [changelog](https://github.com/kerwitz/just-slide/blob/master/CHANGELOG.md) and
the [releases](https://github.com/kerwitz/just-slide/releases).

## License: MIT
Copyright (c) 2015 Marco Kerwitz <marco@kerwitz.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
