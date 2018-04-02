Common IoT Fluent CSS Library
================================

The Common IoT Fluent CSS Library is a minimal set of styles, themes and colors that are standardized across the Azure IoT organization. It is created to help unify the look and feel of common experiences across the various teams. The library provides extremely easy theming using predefined color variables.

Usage
-----
Install as a package via npm with the command `npm install @azure-iot/ux-fluent-css`.

You have a few options when it comes to consuming the css.

Option 1: Import the theme directly into your styles using SASS.

```sass import
@import "~@azure-iot/ux-fluent-css/src/[theme]/color.defaults";
```

Option 2: Import the theme into the build pipeline 

```sass build
const themePath = path.resolve(`./node_modules/@azure-iot/ux-fluent-css/src/${theme}`);

{
    loader: 'sass-loader',
    options: {
        includePaths: themePath
    }
}
```

Customization
-------------
It is easy to customize and build on top of the Common IoT Fluent CSS Library. 

Each theme consists of two SASS files. `_color.palette.scss` contains a list of base colors standardized by the Azure IoT design studio. `_color.defaults.scss` introduces more extensive structural variables, providing a list of predefined colors that can be easily applied to common pieces of shared UI. 

Example coming soon...