import { Invoice } from '../models/Invoice';
import { Paging } from '../models/Paging';

interface Status {
    key: string;
    value: boolean;
}

export interface GetInvoiceResponse {
    data: Array<
        Omit<Invoice, 'status'> & {
            status: Status[];
        }
    >;
    paging: Paging;
}
