Common IoT Fluent CSS Library
================================

The Common IoT Fluent CSS Library is a minimal set of styles, themes and colors that are standardized across the Azure IoT organization. It is created to help unify the look and feel of common experiences across the various teams. The library provides extremely easy theming using predefined color variables.

Usage
-----
Install as a package via npm with the command `npm install @azure-iot/ux-fluent-css`.

In your custom.scss, you’ll import the library's source Sass files. You are free to pick and choose the parts that you need. 

```sass import
@import "~@azure-iot/ux-fluent-css/src/colors";
@import "~@azure-iot/ux-fluent-css/src/mixins";
```

With that setup in place, you can begin to modify any of the Sass variables and maps in your custom.scss. 

Theming
-------

To theme your app, wrap the themed properties in @themify mixin. 

```
.symbol {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @include themify {
        fill: themed('color-fill-tile-symbol');
        stroke: themed('color-stroke-tile-symbol');
    }    
}
```

The above SCSS will generate two separate theme variations. 

```
.symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); }
  .theme-dark .symbol {
    fill: #FFFFFF;
    stroke: #FFFFFF; }
  .theme-light .symbol {
    fill: #212121;
    stroke: #212121; }
```

This technique is relatively efficient, as only the necessary css markups that vary between the themes are generated.

Customization
-------------
It is easy to customize and build on top of the Common IoT Fluent CSS Library. 
The library includes the colors in a Sass map of key value pairs. All Sass maps include the !default flag and can be overridden and extended without modifying the library's source code. 

### Modify map

To modify an existing color in our $themes map, simply redefine the key value pair in your custom Sass file:

```
$theme-dark: (
    color-fill-tile-symbol: #ff4136
);
```

### Add to map

To add a new color to one of our existing themes, add the new key and value:

```
$theme-dark: (
    color-fill-tile-symbol-new: #aa4136
);
```

### Remove from map

To remove colors from $themes, use map-remove:

```
$theme-dark: map-remove($theme-dark, "color-fill-tile-symbol");
```

### Extend $themes with a custom theme

To extend the $themes map with new themes, add the new map of colors:

```
$themes: (
    christmas: (
        color-fill-tile-symbol: #ff4136,
        color-stroke-tile-symbol: #36FF53
    )    
);
```

See the `example` directory for sample consumption code. Use `npm run build` to see the sample css output.