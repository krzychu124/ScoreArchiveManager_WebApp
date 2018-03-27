import { ScoreType } from "./scoreType.enum";
import { ScoreTitle } from "./scoreTitle";
import { Instrument } from "./instrument";
import { Score } from "./score";
import { ScoreBookTitle } from "@app/shared/scoreBookTitle";

export class ScoreBook {
    id: number;
    scoreType: ScoreType;
    scoreBookTitle: ScoreBookTitle;
    instrument: Instrument;
    scoreList: Array<Score> = [];

    constructor(scoreType: ScoreType, scoreBookTitle: ScoreBookTitle, instrument: Instrument) {
        this.scoreType = scoreType;
        this.scoreBookTitle = scoreBookTitle;
        this.instrument = instrument;
        // this.scoreList = [];
    }
}
