export interface Section {
    id: string;
    title: string;
    prefix: string;
    suffix: string;
    includeContent: boolean;
    indentSize: number;
    bulletStyle: string;
    spacingAfter: number;
    customPreview?: string;
}