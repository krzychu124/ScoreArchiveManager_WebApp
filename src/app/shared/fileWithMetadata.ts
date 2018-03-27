import { GenericFile } from "@app/shared/GenericFile";

export interface FileWithMetadata {
    content: string;
    fileMetadata: GenericFile;
}