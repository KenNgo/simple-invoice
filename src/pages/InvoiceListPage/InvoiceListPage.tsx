import { useState, useEffect } from 'react';
import { Input, List, Button, Select, Table, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useNavigate } from "react-router-dom";
import {getOrgToken, getInvoiceList} from '../../services/InvoiceService';
import './InvoiceListPage.scss';

interface Invoice {
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

// interface Invoice {
//     id: string;
//     customerName: string;
//     date: string;
//     amount: number;
//     status: string;
// }

// let invoices: Invoice[] = [
//     { id: 'INV001', customerName: 'John Doe', date: '2022-02-01', amount: 500, status: 'paid' },
//     { id: 'INV002', customerName: 'Jane Smith', date: '2022-02-03', amount: 250, status: 'unpaid' },
//     { id: 'INV003', customerName: 'Bob Johnson', date: '2022-02-05', amount: 1000, status: 'unpaid' },
//     { id: 'INV004', customerName: 'Alice Brown', date: '2022-02-07', amount: 750, status: 'unpaid' },
//     { id: 'INV005', customerName: 'Peter Lee', date: '2022-02-09', amount: 300, status: 'unpaid' },
//     { id: 'INV006', customerName: 'Tom Wilson', date: '2022-02-11', amount: 1500, status: 'unpaid' },
//     { id: 'INV007', customerName: 'Amy Chen', date: '2022-02-13', amount: 200, status: 'unpaid' },
//     { id: 'INV008', customerName: 'David Wang', date: '2022-02-15', amount: 100, status: 'unpaid' },
//     { id: 'INV009', customerName: 'Lisa Zhang', date: '2022-02-17', amount: 800, status: 'unpaid' },
//     { id: 'INV010', customerName: 'Kevin Liu', date: '2022-02-19', amount: 400, status: 'unpaid' },
// ];

const InvoiceListPage: React.FC = () => {
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const [sortedBy, setSortedBy] = useState<string>('');
    const [filteredByStatus, setFilteredByStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [orgToken, setOrgToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    ? invoiceList.filter((item: Invoice) => {
        return item.status.toLocaleLowerCase() === filteredByStatus.toLocaleLowerCase();
    })
    : invoiceList;

    const sortedData = _.orderBy(filteredData, sortedBy, sortedBy ? 'asc' : 'desc');

    const searchedData = searchedColumn ? sortedData.filter((item: Invoice) => {
        return item['invoiceNumber'].toString().toLowerCase().includes(searchText.toLowerCase());
        // return item['customerName'].toString().toLowerCase().includes(searchText.toLowerCase());
    })
    : sortedData;

    const pagedData = searchedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: searchedData.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total: number) => `Total ${total} items`,
    };

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
            navigate('/');
            return;
        }
        // get org_token
        async function fetchInvoiceList(accessToken: string|null) {
            setIsLoading(true);
            try {
                const orgToken = await getOrgToken(accessToken);
                const data = await getInvoiceList(access_token, orgToken);
                if (data.length) {
                    let invoices: Invoice[] = [];
                    for(let i=0; i<data.length; i++) {
                        const item: Invoice = {
                            invoiceId: data[i].invoiceId,
                            invoiceNumber: data[i].invoiceNumber,
                            description: data[i].description,
                            type: data[i].type,
                            currency: data[i].currency,
                            totalAmount: data[i].totalAmount,
                            totalDiscount: data[i].totalDiscount,
                            totalPaid: data[i].totalPaid,
                            totalTax: data[i].totalTax,
                            dueDate: data[i].dueDate,
                            balanceAmount: data[i].balanceAmount,
                            status: data[i].status[0].key,
                        };
                        invoices.push(item);
                    }
                    setInvoiceList(invoices);
                }
                // setInvoiceList(invoices);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                navigate('/');
            }
        }
        fetchInvoiceList(access_token);
    }, []);

    return (
        <>
            {isLoading ? (
                <div className='loading'>
                    <Spin />
                </div>
            ) : (
                <div className='page-container'>
                    <h2>Invoice List</h2>
                    <div className='invoice-list-wrapper'>
                        <Input.Search
                            placeholder="Search"
                            allowClear
                            onSearch={(value) => handleSearch([value], () => {}, 'invoiceNumber')}
                            style={{ width: '250px', marginBottom: '16px' }}
                            prefix={<SearchOutlined />}
                        />
                        <Select
                            defaultValue=""
                            style={{ width: '150px', marginBottom: '16px', marginRight: '16px' }}
                            onChange={handleFilter}>
                            <Select.Option value="">All</Select.Option>
                            <Select.Option value="paid">Paid</Select.Option>
                            {/* <Select.Option value="unpaid">Unpaid</Select.Option> */}
                            <Select.Option value="overdue">Overdue</Select.Option>
                        </Select>
                        <Table
                            dataSource={pagedData}
                            pagination={paginationConfig}
                            rowKey="invoiceId"
                            size="middle"
                            scroll={{ x: 1000 }}
                        >
                            {/* <Table.Column title="Invoice ID" dataIndex="id" />
                            <Table.Column title="Customer Name" dataIndex="customerName" />
                            <Table.Column title="Date" dataIndex="date" />
                            <Table.Column title="Amount" dataIndex="amount" /> */}
                            <Table.Column title="Invoice Number" dataIndex="invoiceNumber" />
                            <Table.Column title="Description" dataIndex="description" />
                            <Table.Column title="Type" dataIndex="type" />
                            <Table.Column title="Currency" dataIndex="currency" />
                            <Table.Column title="Total Amout" dataIndex="totalAmount" />
                            <Table.Column title="Total Discount" dataIndex="totalDiscount" />
                            <Table.Column title="Total Paid" dataIndex="totalPaid" />
                            <Table.Column title="Total Tax" dataIndex="totalTax" />
                            <Table.Column title="Due Date" dataIndex="dueDate" />
                            <Table.Column title="Balance" dataIndex="balanceAmount" />
                            <Table.Column title="Status" dataIndex="status"/>
                        </Table>
                    </div>
                </div>
            )}
        </>
    );
};
  
export default InvoiceListPage;