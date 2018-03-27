export class Instrument {
    id: number;
    name: string;
    instrumentPitch: string;
    voiceNumber: number;
    constructor(name: string, instrumentPitch: string, voiceNumber: number) {
        this.name = name;
        this.instrumentPitch = instrumentPitch;
        this.voiceNumber = voiceNumber;
    }
}
