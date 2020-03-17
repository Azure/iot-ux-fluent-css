import { CustomTheme } from './themeTypes';

export function createCustomThemeStylesheet(theme: CustomTheme) {
    let embeddedStyles = '\n/** Custom theme **/\n:root[theme="custom"] {\n\n';

    for (const [themeSection, values] of Object.entries(theme)) {
        embeddedStyles += `    /* ${themeSection} */\n`;

        for (const [propertyName, propertyValue] of Object.entries(values)) {
            embeddedStyles += `    ${propertyName}: ${propertyValue};\n`;
        }

        embeddedStyles += '\n';
    }
    return `<style type="text/css">${embeddedStyles}</style>`;
}

export function clearThemeProperties(DOMElement: HTMLElement) {
    for (const color of [
        '--color-content-background-primary',
        '--color-content-background-secondary',
        '--color-state-hover',
        '--color-state-selected',
        '--color-state-selected-hover',
        '--color-state-disabled',
        '--color-accent',
        '--color-accent-hover',
        '--color-accent-selected',
        '--color-accent-selected-hover',
        '--color-accent-foreground',
        '--color-status-success',
        '--color-status-success-foreground',
        '--color-status-informational',
        '--color-status-informational-foreground',
        '--color-status-warning',
        '--color-status-warning-foreground',
        '--color-status-danger',
        '--color-status-danger-foreground',
        '--color-foreground-default',
        '--color-foreground-complementary',
        '--color-foreground-inactive',
        '--color-foreground-disabled',
        '--color-foreground-secondary',
        '--color-masthead-background',
        '--color-masthead-foreground',
        '--color-masthead-button-hover',
        '--color-search-background',
        '--color-search-background-hover',
        '--color-search-text-hover',
        '--color-search-text-placeholder',
        '--color-main-nav-background',
        '--color-main-nav-background-hover',
        '--color-main-nav-background-selected',
        '--color-main-nav-foreground-primary',
        '--color-main-nav-foreground-secondary',
        '--color-global-background-success',
        '--color-global-foreground-success',
        '--color-global-background-informational',
        '--color-global-foreground-informational',
        '--color-global-background-warning',
        '--color-global-foreground-warning',
        '--color-global-background-error',
        '--color-global-foreground-error',
        '--data-color-1',
        '--data-color-2',
        '--data-color-3',
        '--data-color-4',
        '--data-color-5',
        '--data-color-6',
        '--data-color-7',
        '--data-color-8',
        '--data-color-9',
        '--data-color-10',
        '--data-color-11',
        '--data-color-12',
        '--data-color-13',
        '--data-color-14',
        '--data-color-15',
        '--data-color-16',
        '--data-color-17',
        '--data-color-18',
        '--data-color-19',
        '--data-color-20',
        '--data-color-21',
        '--data-color-22',
        '--data-color-23',
        '--data-color-24',
        '--data-color-25',
        '--data-color-26',
        '--data-color-27',
        '--data-color-28',
        '--data-color-29',
        '--data-color-30',
        '--data-color-31',
        '--data-color-32',
        '--data-color-33',
        '--data-color-34',
        '--data-color-35',
        '--data-color-36',
        '--data-color-37',
        '--data-color-38',
        '--data-color-39',
        '--data-color-40',
        '--data-color-41',
        '--data-color-42',
    ]) {
        DOMElement.style.removeProperty(color);
    }
}
