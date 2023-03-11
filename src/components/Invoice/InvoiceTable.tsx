import { Table, TableProps } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { Invoice } from '../../interfaces/models/Invoice';

type InvoiceTableProps = {
    sortBy?: string;
    ordering?: SortOrder;
} & TableProps<Invoice>;

export const InvoiceTable = (props: InvoiceTableProps) => {
    const { sortBy, ordering } = props;

    return (
        <Table rowKey='invoiceId' size='middle' scroll={{ x: 1000 }} {...props}>
            <Table.Column title='Invoice Number' dataIndex='invoiceNumber' />
            <Table.Column title='Description' dataIndex='description' />
            <Table.Column title='Type' dataIndex='type' sorter sortOrder={sortBy === 'type' ? ordering : null} />
            <Table.Column
                title='Currency'
                dataIndex='currency'
                sorter
                sortOrder={sortBy === 'currency' ? ordering : null}
            />
            <Table.Column
                title='Total Amout'
                dataIndex='totalAmount'
                sorter
                sortOrder={sortBy === 'totalAmount' ? ordering : null}
            />
            <Table.Column
                title='Total Discount'
                dataIndex='totalDiscount'
                sorter
                sortOrder={sortBy === 'totalDiscount' ? ordering : null}
            />
            <Table.Column
                title='Total Paid'
                dataIndex='totalPaid'
                sorter
                sortOrder={sortBy === 'totalPaid' ? ordering : null}
            />
            <Table.Column
                title='Total Tax'
                dataIndex='totalTax'
                sorter
                sortOrder={sortBy === 'totalTax' ? ordering : null}
            />
            <Table.Column
                title='Due Date'
                dataIndex='dueDate'
                sorter
                sortOrder={sortBy === 'dueDate' ? ordering : null}
            />
            <Table.Column
                title='Balance'
                dataIndex='balanceAmount'
                sorter
                sortOrder={sortBy === 'balanceAmount' ? ordering : null}
            />
            <Table.Column title='Status' dataIndex='status' sorter sortOrder={sortBy === 'status' ? ordering : null} />
        </Table>
    );
};

export default InvoiceTable;
