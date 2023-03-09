import React from 'react';
import { render, screen } from '@testing-library/react';
import InvoiceListPage from './InvoiceListPage';

describe('Invoice List Page', () => {
    it('should render the invoice list page', () => {
        render(<InvoiceListPage />);
    const headerText = screen.getByText('Invoice List');
    expect(headerText).toBeInTheDocument();
    });
});
