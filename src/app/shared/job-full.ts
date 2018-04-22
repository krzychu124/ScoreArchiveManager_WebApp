import { JobBasic } from "@app/shared/job-basic";
import { User } from "@app/shared/user";

export interface JobFull extends JobBasic {
    creator: string;
    lastModifiedBy: string;
    editors: User[];
    deleted: boolean;
}
