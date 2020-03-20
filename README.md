Azure IoT Fluent CSS Library
================================

The Azure IoT Fluent CSS Library is a minimal set of styles, themes and colors that are standardized across the Azure IoT organization. It is created to help unify the look and feel of common experiences across the various teams. The library provides extremely easy theming using predefined color variables.

Usage
-----
Install as a package via npm with the command `npm install @microsoft/azure-iot-ux-fluent-css`.

In your scss entry point you should import the normalize Sass file. This will import all the styles to the DOM and you should be able to use them freely in your css code.

```saas import
@import "~@microsoft/azure-iot-ux-fluent-css/src/normalize";
```

The whole library is mostly based on CSS custom properties, so once the normalize is imported you are free to use the variables on your code without having to import anything with Sass. The constants and mixins are exceptions to this, since these are defined using Sass.

Theming
-------

To theme your app, just make sure your html element has the `theme` attribute set to the name of one of the supported themes (see [themes](`./src/themes/readme.md`) for more info) and use one of the defined themed variables.


```
.symbol {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: $gutter-small;
    fill: var(--color-foreground-default);
    stroke: var('--color-foreground-default);
}
```

Customization
-------------

It is easy to customize and build on top of the Common IoT Fluent CSS Library. The library includes the colors in  CSS Custom properties, which means that you can just add your own declaration and it will either override or add up to the ones defined here.

We recommend adding all CSS Custom property declarations on the root file, since it's the technique supported by most browsers.

Note that if you want to add them to a specific theme you will ned to specify the theme attribute in the root element.

### Extend with a custom theme

To extend the supported themes, add your own theme declaration following the same pattern as the supported themes.

All variables have to be defined. Look at [themes](./src/themes/readme.md) for an explanation on what the different colors are for and how are they constructed.

```
:root[theme="christmas"] {
    --color-content-background-primary: #ff4136;
    --color-content-background-secondary: #36FF53;
    ...
}
```

Contributing
============

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.