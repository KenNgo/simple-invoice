export interface Invoice {
    invoiceId: string;
    invoiceNumber: string;
    description: string;
    type: string;
    currency: string;
    totalAmount: number;
    totalDiscount: number;
    totalPaid: number;
    totalTax: number;
    dueDate: string;
    balanceAmount: number;
    status: string;
}
