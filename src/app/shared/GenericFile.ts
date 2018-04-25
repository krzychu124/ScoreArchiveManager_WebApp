import { ScoreFileType } from "./scoreFileType.enum";
import { ScoreType } from "./scoreType.enum";
import { Instrument } from "@app/shared/instrument";
import { ScoreTitle } from "@app/shared/scoreTitle";

export class GenericFile {
    id: number;
    fileName: string;
    originalFileName: string;
    scoreTitle: ScoreTitle;
    scoreType: ScoreType;
    instrument: Instrument;
    scoreId: number;
    url: string;
    fileSize: number;
    fileExtension: string;
    scoreFileType: ScoreFileType;
    deleted: boolean;
    created: Date;
    thumbnail: string;
}
