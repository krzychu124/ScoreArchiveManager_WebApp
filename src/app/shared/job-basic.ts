import { JobType } from "@app/shared/jobType";
import { GenericFile } from "@app/shared/GenericFile";
import { JobStatus } from "@app/shared/jobStatus";

export interface JobBasic {
    id:number;
    name: string;
    jobType: JobType;
    attachedFiles: GenericFile[];
    jobStatus: JobStatus;
    description: string;
    created: Date;
    modified:Date;
}
