import { EOL } from "os";
import { promisify } from "util";
import { writeFile } from "fs";

const OUTPUT_INDENT = '    ';

export class OutputWritter {
    size: number;
    buffer: Buffer;
    head: number;
    outputFilePath: string;

    constructor(filePath: string) {
        this.size = 1024;
        this.buffer = Buffer.alloc(this.size);
        this.head = 0;
        this.outputFilePath = filePath;

        this.ensureSizeAvailable = this.ensureSizeAvailable.bind(this);
        this.writeLine = this.writeLine.bind(this);
        this.flush = this.flush.bind(this);
    }

    ensureSizeAvailable(size: number) {
        if (this.buffer.length - this.head < size) {
            var oldBuffer = this.buffer;
            var newSize = this.size + (this.size >> 1) + size;

            this.buffer = Buffer.alloc(newSize);
            oldBuffer.copy(this.buffer);
            this.size = newSize;
        }
    }

    writeLine(line: string = '', indented: boolean = false) {
        if (indented) {
            this.ensureSizeAvailable(4);
            this.buffer.write(OUTPUT_INDENT, this.head);
            this.head += 4;
        }

        const lineLength = Buffer.byteLength(line);
        this.ensureSizeAvailable(lineLength);
        this.buffer.write(line, this.head);
        this.head += lineLength;

        const eolLength = Buffer.byteLength(EOL);
        this.ensureSizeAvailable(eolLength);
        this.buffer.write(EOL, this.head);
        this.head += eolLength;
    }

    async flush() {
        await promisify(writeFile)(this.outputFilePath, this.buffer.slice(0, this.head), { flag: 'w+', encoding: 'utf8' });
    }
}
