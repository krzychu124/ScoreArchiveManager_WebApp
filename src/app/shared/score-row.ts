import { ScoreTitle } from "@app/shared/scoreTitle";
import { ScoreType } from "@app/shared/scoreType.enum";
import { Instrument } from "@app/shared/instrument";

export interface ScoreRow {
    id: number;
    scoreTitle: ScoreTitle;
    scoreType: ScoreType;
    instrument: Instrument;
}