import { useState, useEffect } from 'react';
import { Input, List, Button, Select, Table, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {getOrgToken, getInvoiceList} from '../../services/InvoiceService';

interface Invoice {
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

let invoices: Invoice[] = [];

// let invoices: Invoice[] = [
//     { id: 'INV001', customerName: 'John Doe', date: '2022-02-01', amount: 500, status: 'paid' },
//     { id: 'INV002', customerName: 'Jane Smith', date: '2022-02-03', amount: 250, status: 'unpaid' },
//     { id: 'INV003', customerName: 'Bob Johnson', date: '2022-02-05', amount: 1000, status: 'paid' },
//     { id: 'INV004', customerName: 'Alice Brown', date: '2022-02-07', amount: 750, status: 'unpaid' },
//     { id: 'INV005', customerName: 'Peter Lee', date: '2022-02-09', amount: 300, status: 'paid' },
//     { id: 'INV006', customerName: 'Tom Wilson', date: '2022-02-11', amount: 1500, status: 'unpaid' },
//     { id: 'INV007', customerName: 'Amy Chen', date: '2022-02-13', amount: 200, status: 'paid' },
//     { id: 'INV008', customerName: 'David Wang', date: '2022-02-15', amount: 100, status: 'unpaid' },
//     { id: 'INV009', customerName: 'Lisa Zhang', date: '2022-02-17', amount: 800, status: 'paid' },
//     { id: 'INV010', customerName: 'Kevin Liu', date: '2022-02-19', amount: 400, status: 'unpaid' },
// ];

const InvoiceListPage: React.FC = () => {
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const [sortedBy, setSortedBy] = useState<string>('');
    const [filteredByStatus, setFilteredByStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [orgToken, setOrgToken] = useState<string>('');

    let navigate = useNavigate();

    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        setSearchText('');
        setFilteredByStatus('');
    };

    const handleSort = (sortOrder: string, dataIndex: string) => {
        setSortedBy(sortOrder === 'ascend' ? dataIndex : '');
    };

    const handleFilter = (selectedValue: string) => {
        setFilteredByStatus(selectedValue);
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
          setPageSize(pageSize);
        }
    };

    const filteredData = filteredByStatus
    ? invoiceList.filter((item: Invoice) => item.status === filteredByStatus)
    : invoiceList;

    const sortedData = _.orderBy(filteredData, sortedBy, sortedBy ? 'asc' : 'desc');

    const searchedData = searchedColumn ? sortedData.filter((item: Invoice) => {
        return item['invoiceNumber'].toString().toLowerCase().includes(searchText.toLowerCase());
    })
    : sortedData;

    const pagedData = searchedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: searchedData.length,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total: number) => `Total ${total} items`,
    };

    useEffect(() => {
        // setInvoiceList(invoices);
        const access_token = sessionStorage.getItem('access_token');
        // get org_token
        async function fetchInvoiceList(accessToken: string|null) {
            const orgToken = await getOrgToken(accessToken);
            setOrgToken(orgToken);
            const data = await getInvoiceList(access_token, orgToken);
            console.log('data length', data.length);
            for(let i=0; i<data.length; i++) {
                const item: Invoice = data[i];
            }
            console.log("invoices", invoices);
        }
        fetchInvoiceList(access_token);
        
    }, []);

    return (
        <>
            <Input.Search
                placeholder="Search"
                allowClear
                onSearch={(value) => handleSearch([value], () => {}, 'customerName')}
                style={{ width: '250px', marginBottom: '16px' }}
                prefix={<SearchOutlined />}
            />
            <Select
                defaultValue=""
                style={{ width: '150px', marginBottom: '16px', marginRight: '16px' }}
                onChange={handleFilter}>
                <Select.Option value="">All</Select.Option>
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="unpaid">UnPaid</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
            </Select>
            <Table
                dataSource={pagedData}
                pagination={paginationConfig}
                rowKey="id"
                size="middle"
                scroll={{ x: 1000 }}
            >
                <Table.Column title="Invoice ID" dataIndex="id" />
                <Table.Column title="Customer Name" dataIndex="customerName" />
                <Table.Column title="Date" dataIndex="date" />
                <Table.Column title="Amount" dataIndex="amount" />
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    filters={[
                        { text: 'Paid', value: 'paid' },
                        { text: 'Pending', value: 'pending' },
                    ]}
                    filteredValue={filteredByStatus ? [filteredByStatus] : null}
                    onFilter={(value, record: any) => record.status.includes(value)}
                />
                <Table.Column
                    title="Action"
                    key="action"
                    render={(text: any, record: Invoice) => (
                        <Space size="middle">
                            <Button type="primary" size="small">
                                View
                            </Button>
                            <Button size="small" danger>
                                Delete
                            </Button>
                        </Space>
                    )}/>
            </Table>
        </>
    );
};
  
export default InvoiceListPage;