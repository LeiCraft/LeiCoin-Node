
export class Schedule {

    private timeout: NodeJS.Timeout;
    private finished = false;

    constructor(task: () => void, ms: number) {
        this.timeout = setTimeout(task, ms);
    }

    public cancel() {
        clearTimeout(this.timeout);
        this.finished = true;
    }

    public hasFinished() {
        return this.finished;
    }

}

export default Schedule;