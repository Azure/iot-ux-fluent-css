export declare class OutputWritter {
    private size;
    private buffer;
    private head;
    private outputFilePath;
    constructor(filePath: string);
    private ensureSizeAvailable;
    writeLine(line?: string, indentationLevel?: number): void;
    private writeAutogenComment;
    flush(): Promise<void>;
}
