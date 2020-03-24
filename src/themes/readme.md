# Color themes

The files under this directory provide the color mappings for each theme. All files should have the exact same set of variables and should provide values for them.

The files have the following structure:

````
:root[theme="THEME_NAME"] {
  // ---- General

  // Content background
  --color-content-background-primary // Content area, command bar background, tiles background, cards background
  --color-content-background-secondary // background for panel and dashboard, color for placeholder on tiles in edit mode

  // State
  --color-state-hover // hover, focus
  --color-state-selected // selected
  --color-state-selected-hover // selected hover
  --color-state-disabled // background for disabled elements

  // Accent
  --color-accent // Main accent color
  --color-accent-hover // Accent shade for hover
  --color-accent-selected  // Accent shade for selected
  --color-accent-selected-hover // Accent shade for selected hover
  --color-accent-foreground // Foreground color to be used on top of the accent color

  // Status
  --color-status-success
  --color-status-success-foreground // Foreground to be used on top of the status success color
  --color-status-informational
  --color-status-informational-foreground // Foreground to be used on top of the status informational color
  --color-status-warning
  --color-status-warning-foreground // Foreground to be used on top of the status warning color
  --color-status-danger
  --color-status-danger-foreground // Foreground to be used on top of the status danger color

  // Foreground
  --color-foreground-default // Default color for foreground (text, icons)
  --color-foreground-complementary // complementary color to foreground-default
  --color-foreground-inactive
  --color-foreground-disabled
  --color-foreground-secondary // border lines
  --color-foreground-tertiary // less important separations, like borders between rows on grid

  // ---- Component specific
  // This are colors for specific components that shouldn't change
  // based on the main or accent colors

  // Masthead
  --color-masthead-background
  --color-masthead-foreground
  --color-masthead-button-hover
  --color-search-background
  --color-search-background-hover
  --color-search-text-hover
  --color-search-text-placeholder

  // Main nav
  --color-main-nav-background
  --color-main-nav-background-hover // Background for items in hover state
  --color-main-nav-background-selected // Background for the currently active item
  --color-main-nav-foreground-primary // Text color
  --color-main-nav-foreground-secondary // Borders and separators color

  // Alert - Global notifications
  --color-global-background-success
  --color-global-foreground-success
  --color-global-background-informational
  --color-global-foreground-informational
  --color-global-background-warning
  --color-global-foreground-warning
  --color-global-background-error
  --color-global-foreground-error
````

Each section has colors that either have to be defined, or can be calculated from other colors (both in the same section, in a different section or from the default light or dark themes).

## Content Background

@todo

## State

## Accent
`--color-accent` is the main color of this section and has to be provided. All others are steps from this colors based on the following logic:

@todo

## Status

All of the colors on this section have to be provided as they cannot be calculated.

## Foreground

`color-foreground-default` is the main color of this section and has to be provided. All others are steps from this colors based on the following logic:

@todo

## Masthead

`color-masthead-background` is the main color of this section and has to be provided. All others are steps from this colors based on the following logic:

@todo

## Main nav

@todo


## Alert

All of the colors on this section have to be provided as they cannot be calculated.