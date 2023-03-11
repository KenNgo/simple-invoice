export interface GetInvoiceRequestParams {
    fromDate?: string;
    toDate?: string;
    pageNum?: number;
    pageSize?: number;
    sortBy?: string;
    ordering?: string;
    status?: string;
    keyword?: string;
}
