export type DefinedThemes = 'dark' | 'light'

export interface ThemeColorDefinition { }

export interface ContentBackgroundColors extends ThemeColorDefinition {
    '--color-content-background-primary': string;
    '--color-content-background-secondary': string;
}

export interface StateColors extends ThemeColorDefinition {
    '--color-state-hover': string;
    '--color-state-selected': string;
    '--color-state-selected-hover': string;
    '--color-state-disabled': string;
}

export interface AccentColors extends ThemeColorDefinition {
    '--color-accent': string;
    '--color-accent-hover': string;
    '--color-accent-selected': string;
    '--color-accent-selected-hover': string;
    '--color-accent-foreground': string;
}

export interface StatusColors extends ThemeColorDefinition {
    '--color-status-success': string;
    '--color-status-success-foreground': string;
    '--color-status-informational': string;
    '--color-status-informational-foreground': string;
    '--color-status-warning': string;
    '--color-status-warning-foreground': string;
    '--color-status-danger': string;
    '--color-status-danger-foreground': string;
}

export interface ForegroundColors extends ThemeColorDefinition {
    '--color-foreground-default': string;
    '--color-foreground-complementary': string;
    '--color-foreground-inactive': string;
    '--color-foreground-disabled': string;
    '--color-foreground-secondary': string;
}

export interface MastheadColors extends ThemeColorDefinition {
    '--color-masthead-background': string;
    '--color-masthead-foreground': string;
    '--color-masthead-button-hover': string;
    '--color-search-background': string;
    '--color-search-background-hover': string;
    '--color-search-text-hover': string;
    '--color-search-text-placeholder': string;
}

export interface MainNavColors extends ThemeColorDefinition {
    '--color-main-nav-background': string;
    '--color-main-nav-background-hover': string;
    '--color-main-nav-background-selected': string;
    '--color-main-nav-foreground-primary': string;
    '--color-main-nav-foreground-secondary': string;
}

export interface AlertColors extends ThemeColorDefinition {
    '--color-global-background-success': string;
    '--color-global-foreground-success': string;
    '--color-global-background-informational': string;
    '--color-global-foreground-informational': string;
    '--color-global-background-warning': string;
    '--color-global-foreground-warning': string;
    '--color-global-background-error': string;
    '--color-global-foreground-error': string;
}

export interface DataColors extends ThemeColorDefinition {
    '--data-color-1': string;
    '--data-color-2': string;
    '--data-color-3': string;
    '--data-color-4': string;
    '--data-color-5': string;
    '--data-color-6': string;
    '--data-color-7': string;
    '--data-color-8': string;
    '--data-color-9': string;
    '--data-color-10': string;
    '--data-color-11': string;
    '--data-color-12': string;
    '--data-color-13': string;
    '--data-color-14': string;
    '--data-color-15': string;
    '--data-color-16': string;
    '--data-color-17': string;
    '--data-color-18': string;
    '--data-color-19': string;
    '--data-color-20': string;
    '--data-color-21': string;
    '--data-color-22': string;
    '--data-color-23': string;
    '--data-color-24': string;
    '--data-color-25': string;
    '--data-color-26': string;
    '--data-color-27': string;
    '--data-color-28': string;
    '--data-color-29': string;
    '--data-color-30': string;
    '--data-color-31': string;
    '--data-color-32': string;
    '--data-color-33': string;
    '--data-color-34': string;
    '--data-color-35': string;
    '--data-color-36': string;
    '--data-color-37': string;
    '--data-color-38': string;
    '--data-color-39': string;
    '--data-color-40': string;
    '--data-color-41': string;
    '--data-color-42': string;
}

export interface CustomTheme {
    contentBackground?: ContentBackgroundColors;
    state?: StateColors;
    accent?: AccentColors;
    status?: StatusColors;
    foreground?: ForegroundColors;
    masthead?: MastheadColors;
    mainNav?: MainNavColors;
    alert?: AlertColors;
    data?: DataColors;
}
