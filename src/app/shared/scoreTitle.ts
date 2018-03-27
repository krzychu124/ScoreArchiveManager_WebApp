import { ScoreType } from "./scoreType.enum";

export class ScoreTitle {
    id: number;
    title: string;
    number: number;
    scoreType: ScoreType;
    constructor(title: string, number: number, scoreType: ScoreType) {
        this.title = title;
        this.number = number;
        this.scoreType = scoreType;
    }
}