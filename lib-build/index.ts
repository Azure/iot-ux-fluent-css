import ThemesParser, { ThemeDefinition, ThemesData } from './themesParser';
import { OutputWritter } from './outputWritter';
import { join } from 'path';

const OUTPUT_PATH = './src/themes/';

interface Theme {
    name: string;
    definition: ThemeDefinition;
}

function validateThemesEqual(themeA: Theme, themeB: Theme) {
    const aSections = Object.getOwnPropertyNames(themeA.definition);
    const bSections = Object.getOwnPropertyNames(themeB.definition);

    if (aSections.length !== bSections.length) {
        throw `Theme '${themeA.name}' has ${aSections.length} sections (${aSections.join(', ')}) and theme '${themeB.name}' has ${bSections.length} sections (${bSections.join(', ')})`;
    }

    for (const section of aSections) {
        const aSectionProperties = Object.getOwnPropertyNames(themeA.definition[section]);
        const bSectionProperties = Object.getOwnPropertyNames(themeB.definition[section]);

        if (aSectionProperties.length !== bSectionProperties.length) {
            throw `Section '${section}' has different properties on theme '${themeA.name}' (${aSectionProperties.join(', ')}) and theme '${themeB.name}' (${bSectionProperties.join(', ')})`;
        }

        for (const property of aSectionProperties) {
            if (!bSectionProperties.includes(property)) {
                throw `Property '${property}' exists on section '${section}' for theme '${themeA.name}' but not for theme '${themeB.name}'`;
            }
        }
    }
}

async function parseAndValidateThemeFiles() {
    const parser = new ThemesParser();
    
    const data = await parser.readThemeFiles();

    const themes = Object.keys(data);
    for (let i = 1; i < themes.length; i++) {
        const themeA = themes[i - 1];
        const themeB = themes[i];

        validateThemesEqual({
            name: themeA,
            definition: data[themeA]
        },
        {
            name: themeB,
            definition: data[themeB]
        })
    }

    return data;  
}

async function generateTSFiles(themes: ThemesData) {
    const utilsFile = new OutputWritter(join(OUTPUT_PATH, './colorUtils.ts'));
    const defaultThemesFile = new OutputWritter(join(OUTPUT_PATH, './defaultThemes.ts'));
    const typesFile = new OutputWritter(join(OUTPUT_PATH, './themeTypes.ts'));

    const themeDefs = Object.keys(themes);
    typesFile.writeLine(`export type DefinedThemes = '${themeDefs.join('\' | \'')}'`);
    typesFile.writeLine();

    typesFile.writeLine('export interface ThemeColorDefinition { }');
    typesFile.writeLine();

    const allProperties = new Set<string>();
    const sections: { [sectionName: string]: string } = {};
    let typesDefined = false;

    defaultThemesFile.writeLine('import { CustomTheme } from \'./themeTypes\';');
    defaultThemesFile.writeLine();
    defaultThemesFile.writeLine('export const DefaultThemes: {');
    defaultThemesFile.writeLine('[theme: string]: CustomTheme', true);
    defaultThemesFile.writeLine('} = {');
    for (const [themeName, themeSections] of Object.entries(themes)) {
        defaultThemesFile.writeLine(`${themeName}: {`, true);
        for (const [sectionName, sectionVariables] of Object.entries(themeSections)) {
            defaultThemesFile.writeLine(`    ${sectionName}: {`, true);

            if (!typesDefined) {
                const sectionTypeName = `${sectionName.replace(/^./, g => g.toUpperCase())}Colors`;
                sections[sectionName] = sectionTypeName;
                
                typesFile.writeLine(`export interface ${sectionTypeName} extends ThemeColorDefinition {`);
            }

            for (const [property, value] of Object.entries(sectionVariables)) {
                defaultThemesFile.writeLine(`        '${property}': '${value}',`, true);

                if (!typesDefined) {
                    allProperties.add(property);
                    typesFile.writeLine(`'${property}': string;`, true);
                }
            }

            defaultThemesFile.writeLine('    },', true);

            if (!typesDefined) {
                typesFile.writeLine('}');
                typesFile.writeLine();
            }
        }

        defaultThemesFile.writeLine('},', true);

        if (!typesDefined) {
            typesFile.writeLine('export interface CustomTheme {');

            for (const [sectionName, sectionTypeName] of Object.entries(sections)) {
                typesFile.writeLine(`${sectionName}?: ${sectionTypeName};`, true);
            }

            typesFile.writeLine('}');
            typesDefined = true;
        }
    }

    defaultThemesFile.writeLine('};');

    //  ============= UTILS
    utilsFile.writeLine('import { CustomTheme } from \'./themeTypes\';')
    utilsFile.writeLine();
    utilsFile.writeLine('export function createCustomThemeStylesheet(theme: CustomTheme) {');
    utilsFile.writeLine('let embeddedStyles = \'\\n/** Custom theme **/\\n:root[theme="custom"] {\\n\\n\';', true);
    utilsFile.writeLine();
    utilsFile.writeLine('for (const [themeSection, values] of Object.entries(theme)) {', true);
    utilsFile.writeLine('    embeddedStyles += `    /* ${themeSection} */\\n`;', true);
    utilsFile.writeLine();
    utilsFile.writeLine('    for (const [propertyName, propertyValue] of Object.entries(values)) {', true)
    utilsFile.writeLine('        embeddedStyles += `    ${propertyName}: ${propertyValue};\\n`;', true);
    utilsFile.writeLine('    }', true);
    utilsFile.writeLine();
    utilsFile.writeLine('    embeddedStyles += \'\\n\';', true);
    utilsFile.writeLine('}', true);
    utilsFile.writeLine('return `<style type="text/css">${embeddedStyles}</style>`;', true);
    utilsFile.writeLine('}');
    utilsFile.writeLine();

    utilsFile.writeLine('export function clearThemeProperties(DOMElement: HTMLElement) {');
    utilsFile.writeLine('for (const color of [', true);

    for (const property of allProperties) {
        utilsFile.writeLine(`    '${property}',`, true);
    }

    utilsFile.writeLine(']) {', true);
    utilsFile.writeLine('    DOMElement.style.removeProperty(color);', true);
    utilsFile.writeLine('}', true);
    utilsFile.writeLine('}');

    defaultThemesFile.flush();
    typesFile.flush();
    utilsFile.flush();
}

async function main() {
    try {
        const themes = await parseAndValidateThemeFiles();
        await generateTSFiles(themes);
        return 0;
    } catch (e) {
        console.error(e);
        return 1;
    }
}

main();