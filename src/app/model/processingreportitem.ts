import {Operators} from "./operators"

export class ProcessingReportItem {
    dispatchId: String;
    fileName: String;
    fileType: String;
    captureDevice: String;
    startTime: Date;
    endTime: Date;
    author: Operators;
}