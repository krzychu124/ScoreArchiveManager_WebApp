import { ScoreTitle } from "./scoreTitle";
import { Instrument } from "./instrument";
import { ScoreType } from "./scoreType.enum";
import { User } from "./user";
import { PDFFile } from "./PDFFile";
import { MuseScoreFile } from "./MuseScoreFile";
import { ImageFile } from "./ImageFile";
import { GenericFile } from "@app/shared/GenericFile";

export class Score {
    private id: number;
    scoreTitle: ScoreTitle;
    scoreType: ScoreType;
    instrument: Instrument;
    private cretedBy: User;
    private lastModifiedBy: User;
    private lastModifiedTime: number;
    pdfFiles: Array<GenericFile> = [];
    museScoreFiles: Array<GenericFile> = [];
    imageFiles: Array<GenericFile> = [];
    othersFiles: Array<GenericFile> = [];
    constructor(scoreTitle: ScoreTitle, scoreType: ScoreType, instrument: Instrument) {
        this.scoreTitle = scoreTitle;
        this.scoreType = scoreType;
        this.instrument = instrument;
    }

    getId(): number {
        return this.id;
    }
    getCreatedBy(): User {
        let copy: User = new User();
        copy.id = this.cretedBy.id;
        copy.userName = this.cretedBy.userName;
        return copy;
    }
    getModifiedBy(): User {
        let copy: User = new User();
        copy.id = this.lastModifiedBy.id;
        copy.userName = this.lastModifiedBy.userName;
        return copy;
    }
    getLastModifiedTime(): number {
        return this.lastModifiedTime;
    }
}
