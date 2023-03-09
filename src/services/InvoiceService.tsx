import axios from 'axios';

const MEMBERSHIP_API_URL = 'https://sandbox.101digital.io/membership-service/1.2.0/users/me';
const INVOICE_API_URL = `https://sandbox.101digital.io/invoice-service/1.0.0/invoices?pageNum=1&pageSize=10&dateType=INVOICE_DATE&sortBy=CREATED_DATE&ordering=ASCENDING`;

export async function getOrgToken(accessToken: string | null) {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    return await axios.get(MEMBERSHIP_API_URL, config).then(response => response?.data?.data?.memberships[0]?.token);
}

export async function getInvoiceList(accessToken: string | null, orgToken: string | null) {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}`, 'org-token': `${orgToken}` }
    };
    return await axios.get(INVOICE_API_URL, config).then(response => response?.data?.data);
}