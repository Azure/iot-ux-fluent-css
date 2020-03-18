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
const os_1 = require("os");
const util_1 = require("util");
const fs_1 = require("fs");
const OUTPUT_INDENT = '    ';
class OutputWritter {
    constructor(filePath) {
        this.size = 1024;
        this.buffer = Buffer.alloc(this.size);
        this.head = 0;
        this.outputFilePath = filePath;
        this.ensureSizeAvailable = this.ensureSizeAvailable.bind(this);
        this.writeLine = this.writeLine.bind(this);
        this.flush = this.flush.bind(this);
        this.writeAutogenComment = this.writeAutogenComment.bind(this);
        this.writeAutogenComment();
    }
    ensureSizeAvailable(size) {
        if (this.buffer.length - this.head < size) {
            var oldBuffer = this.buffer;
            var newSize = this.size + (this.size >> 1) + size;
            this.buffer = Buffer.alloc(newSize);
            oldBuffer.copy(this.buffer);
            this.size = newSize;
        }
    }
    writeLine(line = '', indentationLevel = 0) {
        if (indentationLevel) {
            this.ensureSizeAvailable(4 * indentationLevel);
            for (let i = 0; i < indentationLevel; i++) {
                this.buffer.write(OUTPUT_INDENT, this.head);
                this.head += 4;
            }
        }
        const lineLength = Buffer.byteLength(line);
        this.ensureSizeAvailable(lineLength);
        this.buffer.write(line, this.head);
        this.head += lineLength;
        const eolLength = Buffer.byteLength(os_1.EOL);
        this.ensureSizeAvailable(eolLength);
        this.buffer.write(os_1.EOL, this.head);
        this.head += eolLength;
    }
    writeAutogenComment() {
        this.writeLine('/**');
        this.writeLine(' * THIS IS AN AUTOGENERATED FILE, YOU SHOULD NOT MODIFY IT MANUALLY');
        this.writeLine(' * TO REGENERATE THIS FILE RUN `NPM RUN CODEGEN`.');
        this.writeLine(' */');
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.promisify(fs_1.writeFile)(this.outputFilePath, this.buffer.slice(0, this.head), { flag: 'w+', encoding: 'utf8' });
        });
    }
}
exports.OutputWritter = OutputWritter;