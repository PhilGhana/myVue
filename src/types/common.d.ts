declare namespace IAjax {
    interface Result<D = any, E = any> {
        data: D;
        errors: E;
        refresh: any;
        message: any;
    }
    interface Paginate<R = any> {
        content: R[];
        total: number;
        page: number;
        perPage: number;
    }
}
