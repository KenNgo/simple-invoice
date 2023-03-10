import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import InvoiceListPage from './InvoiceListPage';

describe('Invoice List Page', () => {
    it('should render the invoice list page', () => {
        render(<InvoiceListPage />);
        const headerText = screen.getByText('Invoice List');
        expect(headerText).toBeInTheDocument();
    });
    it('should call API to get organisation token', async () => {
        const fetchOrganizationToken = jest.fn(); // Mock get organization token function
        render(<InvoiceListPage />);
        await waitFor(() => expect(fetchOrganizationToken).toHaveBeenCalled());
    });
    it('should call API to get invoice list', async () => {
        const fetInvoices = jest.fn(); // Mock fetchInvoices function
        render(<InvoiceListPage />);
        await waitFor(() => expect(fetInvoices).toHaveBeenCalled());
    });
    it('should call showModal when clicked', async () => {
        const showModalSpy = sinon.spy();
        const createInvoiceButton = screen.getByRole('button', { name: 'Create Invoice' });
        fireEvent.click(createInvoiceButton);
        await waitFor(() => {
            expect(showModalSpy.calledOnce).toBe(true);
        });
    });
    it('should call API to create invoice', async () => {
        const createInvoice = jest.fn(); // Mock create invoice function
        render(<InvoiceListPage />);
        await waitFor(() => expect(createInvoice).toHaveBeenCalled());
    });
});
