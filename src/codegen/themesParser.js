"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const readline_1 = require("readline");
const THEMES_DIR = path_1.join(process.cwd(), 'src/themes/');
const COLORS_PATH = path_1.join(process.cwd(), 'src/_colors.css');
const THEME_FILENAME_PATTERN = new RegExp(/_color\.(.*)\.css/);
const CSS_CUSTOM_PROPERTY_COLOR_MATCH = new RegExp(/--color-(.*)/, 'gi');
const CSS_CUSTOM_PROPERTY_DATA_COLOR_MATCH = new RegExp(/--data-color-.*/, 'gi');
const CSS_VAR_MATCH = new RegExp(/var\((.*)\)/, 'gi');
const CSS_SECTION_MATCH = new RegExp(/\/\*(.*)\*\//, 'gi');
const CSS_COMMENT_START_MATCH = new RegExp(/\/\*/, 'gi');
const CSS_COMMENT_END_MATCH = new RegExp(/\*\//, 'gi');
class ThemesParser {
    constructor() { }
    readThemeFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            let globalVariables = {};
            const globalColors = yield ThemesParser.parseCSSFile(COLORS_PATH); // Colors file has the global colors that are shared across themes
            for (const globalSection of Object.values(globalColors)) {
                globalVariables = Object.assign({}, globalSection, globalVariables);
            }
            const themesData = {};
            const files = yield util_1.promisify(fs_1.readdir)(THEMES_DIR);
            for (const filename of files) {
                const filenameMatch = filename.match(THEME_FILENAME_PATTERN);
                if (filenameMatch) {
                    const themeName = filenameMatch[filenameMatch.length - 1];
                    const themeFileData = yield ThemesParser.parseCSSFile(path_1.join(THEMES_DIR, filenameMatch[0]), globalVariables);
                    themesData[themeName] = themeFileData;
                }
            }
            return themesData;
        });
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
    static parseCSSFile(filePath, globalVariables = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const colorValues = {};
            const rl = readline_1.createInterface({ input: fs_1.createReadStream(filePath) });
            let insideComment = false;
            let currentSection = '';
            try {
                for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                    const line = rl_1_1.value;
                    const sectionMatch = line.match(CSS_SECTION_MATCH);
                    if (!insideComment && sectionMatch) {
                        currentSection = sectionMatch[0]
                            .replace(/\/\*/, '') // Remove start of comment
                            .replace(/\*\//, '') // Remove end of comment
                            .trim()
                            .replace(/([-_ ][a-z])/gi, (g) => g.toUpperCase()
                            .replace(/[-_ ]/, '')) // Make CammelCase
                            .replace(/^./g, (g) => g.toLowerCase()); // Ensure first char is lowercase
                        colorValues[currentSection] = {};
                    }
                    else if (insideComment && line.match(CSS_COMMENT_END_MATCH)) {
                        insideComment = false;
                        continue;
                    }
                    else if (line.match(CSS_COMMENT_START_MATCH)) {
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
                            }
                            else {
                                colorValues[currentSection][propertyName] = value;
                            }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return colorValues;
        });
    }
}
exports.default = ThemesParser;
