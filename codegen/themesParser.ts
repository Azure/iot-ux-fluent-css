import { readdir, createReadStream } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { createInterface } from 'readline';

const THEMES_DIR = join(process.cwd(), 'src/themes/');
const COLORS_PATH = join(process.cwd(), 'src/_colors.css');

const THEME_FILENAME_PATTERN = new RegExp(/_color\.(.*)\.css/);

const CSS_CUSTOM_PROPERTY_COLOR_MATCH = new RegExp(/--color-(.*)/, 'gi');
const CSS_CUSTOM_PROPERTY_DATA_COLOR_MATCH = new RegExp(/--data-color-.*/, 'gi');
const CSS_VAR_MATCH = new RegExp(/var\((.*)\)/, 'gi');
const CSS_SECTION_MATCH = new RegExp(/\/\*(.*)\*\//, 'gi');

const CSS_COMMENT_START_MATCH = new RegExp(/\/\*/, 'gi');
const CSS_COMMENT_END_MATCH = new RegExp(/\*\//, 'gi');

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
    constructor() { }

    public async readThemeFiles() {
        let globalVariables = {};
        const globalColors = await ThemesParser.parseCSSFile(COLORS_PATH); // Colors file has the global colors that are shared across themes
        for (const globalSection of Object.values(globalColors)) {
            globalVariables = {
                ...globalSection,
                ...globalVariables
            };
        }

        const themesData: ThemesData = {};
        const files = await promisify(readdir)(THEMES_DIR);
        for (const filename of files) {
            const filenameMatch = filename.match(THEME_FILENAME_PATTERN);
            if (filenameMatch) {
                const themeName = filenameMatch[filenameMatch.length - 1];
                const themeFileData = await ThemesParser.parseCSSFile(join(THEMES_DIR, filenameMatch[0]), globalVariables);

                themesData[themeName] = themeFileData;
            }
        }

        return themesData;
    }

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
    private static async parseCSSFile(filePath: string, globalVariables: PropertySection = {}): Promise<ThemeDefinition> {
        const colorValues: ThemeDefinition = {};
        const rl = createInterface({ input: createReadStream(filePath) });

        let insideComment = false;
        let currentSection = '';
        for await (const line of rl) {
            const sectionMatch = line.match(CSS_SECTION_MATCH);
            if (!insideComment && sectionMatch) {
                currentSection = sectionMatch[0]
                    .replace(/\/\*/, '') // Remove start of comment
                    .replace(/\*\//, '') // Remove end of comment
                    .trim()
                    .replace(/([-_ ][a-z])/gi, (g) => g.toUpperCase().replace(/[-_ ]/, ''))
                    .replace(/^./g, (g) => g.toLowerCase()); // Ensure cammelCase
                
                colorValues[currentSection] = {};
            } else if (insideComment && line.match(CSS_COMMENT_END_MATCH)) {
                insideComment = false;
                continue;
            } else if (line.match(CSS_COMMENT_START_MATCH)) {
                insideComment = true;
                continue;
            }

            if (!insideComment && line) {
                if (line.match(CSS_CUSTOM_PROPERTY_COLOR_MATCH) || line.match(CSS_CUSTOM_PROPERTY_DATA_COLOR_MATCH)) {
                    const withoutSemiColon = line.replace(';', '');
                    let [propertyName, value] = withoutSemiColon.split(':');
                    value = value.trim();
                    propertyName = propertyName.trim();

                    const varMatch = value.match(CSS_VAR_MATCH);
                    if (varMatch) {
                        const mappedValue = globalVariables[value.replace(/(var\()|(\)$)/g, '')]; // Remove var() and use only the var name
                        if (!mappedValue) {
                            throw `Variable does not exist: ${value}`;
                        }
                        
                        colorValues[currentSection][propertyName] = mappedValue;
                    } else {
                        colorValues[currentSection][propertyName] = value;
                    }
                }
            }
        }

        return colorValues;
    }
}