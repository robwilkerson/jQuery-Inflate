# jQuery Inflate

A jQuery plugin that resizes an element and its ancestors to a specified size or ancestor.

This sounds pretty simple, right? I thought so too. Then I started bumping into cleared floats that hide overflow, elements positioned outside of the document flow, space consumed by the presence of sibling elements, etc. It turns out that this isn't nearly as trivial and it would seem.

Inflate provides two different expansion mechanisms. Using either method, height and width can be inflated independently.

## Unconstrained Expansion

### `.inflate( [options] )`

Given an element of any dimensions, this method will resize that element horizontally and/or vertically to the specified size. In doing so, it will force ancestors all the way out to the document level to expand accordingly.

#### Usage

	/** Inflate width and height */
    $(selector).inflate({ width: 800, height: 600 });
    
    /** Inflate width only */
    $(selector).inflate({ width: 800 });
    
    /** Inflate height only */
    $(selector).inflate({ height: 600 });
    
#### Arguments

`options`
* `width` (int) The desired width. Defaults to `null` if horizontal resizing is not required/desired.
* `height` (int) The desired height. Defaults to `null` if vertical resizing is not required/desired.
* `debug` (bool) Whether to write debug messages to Firebug's console. Defaults to `false`.

#### Returns

The modified jQuery object for chaining.

## Constrained Expansion

### `.inflateTo( selector, [options] )`

Resizes an element to fill a container matched by the `selector` argument. This method respects padding, borders and margins of any ancestors between the element and the container.

#### Usage

	/** Inflate width and height */
    $(selector).inflateTo( selector );
    
    /** Inflate width only */
    $(selector).inflateTo( selector, { height: false } );
    
    /** Inflate height only */
    $(selector).inflateTo( selector, { width: false } );
    
#### Arguments

`options`
* `width` (bool) Whether to resize horizontally. Defaults to `false`.
* `height` (bool) Whether to resize vertically. Defaults to `false`.
* `debug` (bool) Whether to write debug messages to Firebug's console. Defaults to `false`.

#### Returns

The modified jQuery object for chaining.

## License

This code is licensed under the MIT license.

## Notes

Feel free to suggest improvements in a ticket or fork this project and improve upon it yourself.
