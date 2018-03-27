import { ScoreFileType } from "@app/shared/scoreFileType.enum";

export interface ProcessingState {
    inProgress: boolean;
    fileType: ScoreFileType;
}