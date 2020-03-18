"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const themesParser_1 = require("./themesParser");
const outputWritter_1 = require("./outputWritter");
const path_1 = require("path");
const OUTPUT_PATH = './src/themes/';
function validateThemesEqual(themeA, themeB) {
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
function parseAndValidateThemeFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new themesParser_1.default();
        const data = yield parser.readThemeFiles();
        const themes = Object.keys(data);
        for (let i = 1; i < themes.length; i++) {
            const themeA = themes[i - 1];
            const themeB = themes[i];
            validateThemesEqual({
                name: themeA,
                definition: data[themeA]
            }, {
                name: themeB,
                definition: data[themeB]
            });
        }
        return data;
    });
}
function generateTSFiles(themes) {
    return __awaiter(this, void 0, void 0, function* () {
        const utilsFile = new outputWritter_1.OutputWritter(path_1.join(OUTPUT_PATH, './colorUtils.ts'));
        const defaultThemesFile = new outputWritter_1.OutputWritter(path_1.join(OUTPUT_PATH, './defaultThemes.ts'));
        const typesFile = new outputWritter_1.OutputWritter(path_1.join(OUTPUT_PATH, './themeTypes.d.ts'));
        typesFile.writeLine('declare module \'azure-iot-fluent-css\' {');
        const themeDefs = Object.keys(themes);
        typesFile.writeLine(`export type DefinedThemes = '${themeDefs.join('\' | \'')}'`, 1);
        typesFile.writeLine();
        typesFile.writeLine('export interface ThemeColorDefinition { }', 1);
        typesFile.writeLine();
        const allProperties = new Set();
        const sections = {};
        let typesDefined = false;
        defaultThemesFile.writeLine('import { CustomTheme } from \'./themeTypes\';');
        defaultThemesFile.writeLine();
        defaultThemesFile.writeLine('export const DefaultThemes: {');
        defaultThemesFile.writeLine('[theme: string]: CustomTheme', 1);
        defaultThemesFile.writeLine('} = {');
        for (const [themeName, themeSections] of Object.entries(themes)) {
            defaultThemesFile.writeLine(`${themeName}: {`, 1);
            for (const [sectionName, sectionVariables] of Object.entries(themeSections)) {
                defaultThemesFile.writeLine(`${sectionName}: {`, 2);
                if (!typesDefined) {
                    const sectionTypeName = `${sectionName.replace(/^./, g => g.toUpperCase())}Colors`;
                    sections[sectionName] = sectionTypeName;
                    typesFile.writeLine(`export interface ${sectionTypeName} extends ThemeColorDefinition {`, 1);
                }
                for (const [property, value] of Object.entries(sectionVariables)) {
                    defaultThemesFile.writeLine(`'${property}': '${value}',`, 3);
                    if (!typesDefined) {
                        allProperties.add(property);
                        typesFile.writeLine(`'${property}': string;`, 2);
                    }
                }
                defaultThemesFile.writeLine('},', 2);
                if (!typesDefined) {
                    typesFile.writeLine('}', 1);
                    typesFile.writeLine();
                }
            }
            defaultThemesFile.writeLine('},', 1);
            if (!typesDefined) {
                typesFile.writeLine('export interface CustomTheme {', 1);
                for (const [sectionName, sectionTypeName] of Object.entries(sections)) {
                    typesFile.writeLine(`${sectionName}?: ${sectionTypeName};`, 2);
                }
                typesFile.writeLine('}', 1);
                typesDefined = true;
            }
        }
        typesFile.writeLine('}');
        defaultThemesFile.writeLine('};');
        //  ============= UTILS
        utilsFile.writeLine('import { CustomTheme } from \'./themeTypes\';');
        utilsFile.writeLine();
        utilsFile.writeLine('export function createCustomThemeStylesheet(theme: CustomTheme) {');
        utilsFile.writeLine('let embeddedStyles = \'\\n/** Custom theme **/\\n:root[theme="custom"] {\\n\\n\';', 1);
        utilsFile.writeLine();
        utilsFile.writeLine('for (const [themeSection, values] of Object.entries(theme)) {', 1);
        utilsFile.writeLine('embeddedStyles += `    /* ${themeSection} */\\n`;', 2);
        utilsFile.writeLine();
        utilsFile.writeLine('for (const [propertyName, propertyValue] of Object.entries(values)) {', 2);
        utilsFile.writeLine('embeddedStyles += `    ${propertyName}: ${propertyValue};\\n`;', 3);
        utilsFile.writeLine('}', 2);
        utilsFile.writeLine();
        utilsFile.writeLine('embeddedStyles += \'\\n\';', 2);
        utilsFile.writeLine('}', 1);
        utilsFile.writeLine('return `<style type="text/css">${embeddedStyles}</style>`;', 1);
        utilsFile.writeLine('}');
        utilsFile.writeLine();
        utilsFile.writeLine('export function clearThemeProperties(DOMElement: HTMLElement) {');
        utilsFile.writeLine('for (const color of [', 1);
        for (const property of allProperties) {
            utilsFile.writeLine(`'${property}',`, 2);
        }
        utilsFile.writeLine(']) {', 1);
        utilsFile.writeLine('DOMElement.style.removeProperty(color);', 2);
        utilsFile.writeLine('}', 1);
        utilsFile.writeLine('}');
        defaultThemesFile.flush();
        typesFile.flush();
        utilsFile.flush();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const themes = yield parseAndValidateThemeFiles();
            yield generateTSFiles(themes);
            return 0;
        }
        catch (e) {
            console.error(e);
            return 1;
        }
    });
}
main();
