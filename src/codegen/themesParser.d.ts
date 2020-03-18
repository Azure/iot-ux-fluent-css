interface PropertySection {
    [property: string]: string;
}
export interface ThemeDefinition {
    [section: string]: PropertySection;
}
export interface ThemesData {
    [theme: string]: ThemeDefinition;
}
export default class ThemesParser {
    constructor();
    readThemeFiles(): Promise<ThemesData>;
    /**
     * Parses a css theme file.
     *
     * Theme files all attach to the following rules:
     * - The file name indicates the theme name (_color.${themeName}.css),
     *   this same one matches the root attribute definition
     * - Each section starts with a one line comment that indicates the section name
     *   \/\* Section Name \*\/
     * - There's no variables outside a section.
     * - Multi line comments are allowed, but the comment has to have the starting symbol in
     *   it's own line (\/\*) and the ending symbol also in it's own line (\*\/)
     *
     * @remarks This parsing method asumes these rules, it doesn't validate them.
     */
    private static parseCSSFile;
}
export {};
