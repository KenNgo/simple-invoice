import { AxiosResponse } from 'axios';
import { FETCH_INVOICES_API_URL } from '../../constants/api';
import { Invoice } from '../../interfaces/models/Invoice';
import { GetInvoiceRequestParams } from '../../interfaces/requests/getInvoiceRequest';
import { GetInvoiceResponse } from '../../interfaces/responses/getInvoiceResponse';
import api from '../api';

export const fetchInvoices = async (
    accessToken: string | null,
    orgToken: string | null,
    params: GetInvoiceRequestParams
) => {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}`, 'org-token': `${orgToken}` },
        params: params,
    };

    return await api.get(FETCH_INVOICES_API_URL, config).then((response: AxiosResponse<GetInvoiceResponse>) => {
        const { status, data } = response;
        const result = data;

        if (status === 200 && result != null) {
            const invoiceData: Invoice[] = result.data.map((invoice) => {
                const status = invoice.status.find((s) => s.value)?.key ?? '';

                return {
                    ...invoice,
                    status: status,
                };
            });

            return {
                paging: result.paging,
                invoices: invoiceData,
            };
        }

        return null;
    });
};
