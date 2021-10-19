export namespace ActionTypes {

    export namespace CompanySave {
        export interface Request {
            id: number;
            name: string;
            roleId: number;
            enabled: 1 | 0;
            locked: 1| 0;
        }
    }
}
