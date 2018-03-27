import { ScoreFileType } from "@app/shared/scoreFileType.enum";

export interface FileInfo {
    titleId: number;
    scoreTypeId: number;
    instrumentId: number;
    scoreFileType: ScoreFileType;
}