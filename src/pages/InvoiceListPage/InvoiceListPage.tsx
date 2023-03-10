import { useState, useEffect } from 'react';
import { Input, Select, Table, Spin, Button, Modal, Form, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useNavigate } from "react-router-dom";
import {getOrgToken, getInvoiceList, createNewInvoice} from '../../services/InvoiceService';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string|null>('');
    const [orgToken, setOrgToken] = useState<string|null>('');

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [accountNumber, setAccountNumber] = useState<string>('12345678');
    const [accountName, setAccountName] = useState<string>('John Terry');
    const [sortCode, setSortCode] = useState<string>('09-01-01');
    const [firstName, setFirstName] = useState<string>('Nguyen');
    const [lastName, setLastName] = useState<string>('Dung 2');
    const [email, setEmail] = useState<string>('nguyendung2@101digital.io');
    const [phone, setPhone] = useState<string>('+6597594971');
    const [countryCode, setCountryCode] = useState<string>('VN');
    const [postCode, setPostCode] = useState<string>('1000');
    const [country, setCountry] = useState<string>('hoangmai');
    const [city, setCity] = useState<string>('Hanoi');
    const [invoiceNumber, setInvoiceNumber] = useState<string>('INV12345670433');
    const [currency, setCurrency] = useState<string>('GBP');
    const [invoiceDate, setInvoiceDate] = useState<string>('2021-05-27');
    const [dueDate, setDueDate] = useState<string>('2021-05-27');
    const [description, setDescription] = useState<string>('');
    const [itemName, setItemName] = useState<string>('Honda Motor');
    const [itemDescription, setItemDescription] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [rate, setRate] = useState<number>(1);
    const [itemUOM, setItemUOM] = useState<string>('KG');


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
    // get org_token and then get invoice list
    async function fetchInvoiceList() {
        setIsLoading(true);
        const access_token = sessionStorage.getItem('access_token');
        await setAccessToken(access_token);
        if (!access_token) {
            navigate('/');
            return;
        }
        await setAccessToken(access_token);
        try {
            const orgToken = await getOrgToken(access_token);
            await setOrgToken(orgToken);
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

    useEffect(() => {
        fetchInvoiceList();
    }, []);

    const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(event.target.value);
    }

    const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(event.target.value);
    }

    const handleSortCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortCode(event.target.value);
    }

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    }

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    }

    const handleCountryCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountryCode(event.target.value);
    }

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }

    const handlePostCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostCode(event.target.value);
    }

    const handleInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvoiceNumber(event.target.value);
    }

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    }

    const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(event.target.value);
    }

    const handleInvoiceDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvoiceDate(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    }

    const handleItemDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemDescription(event.target.value);
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(event.target.value));
    }

    const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRate(parseInt(event.target.value));
    }

    const handleItemUOMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemUOM(event.target.value);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        // create new invoice
        const newInvoice = {
            "data": [
                {
                    "bankAccount": {
                        "bankId": "",
                        "sortCode": "09-01-01",
                        "accountNumber": "12345678",
                        "accountName": "John Terry"
                    },
                    "currency": "GBP",
                    "currencySymbol": "£",
                    "customer": {
                        "id": "b605ad26-dd5d-4ea3-a7de-a0b7c5219528",
                        "firstName": "Nguyen",
                        "lastName": "Dung 2",
                        "name": "Dung 2",
                        "contact": {
                            "email": "nguyendung2@101digital.io",
                            "mobileNumber": "+6597594971"
                        },
                        "addresses": [
                            {
                                "addressType": "BILLING",
                                "override": false,
                                "isDefault": false,
                                "premise": "CT11",
                                "city": "hanoi",
                                "county": "hoangmai",
                                "postcode": "1000",
                                "countryCode": "VN",
                                "customFields": []
                            }
                        ]
                    },
                    "description": "Invoice is issued to Akila Jayasinghe",
                    "dueDate": "2021-06-04",
                    "extensions": [
                        {
                            "id": "293b2b3f-f70c-476d-a68d-14a62fd2392f",
                            "addDeduct": "ADD",
                            "name": "tax",
                            "total": 91.00000,
                            "type": "PERCENTAGE",
                            "value": 10.00000
                        },
                        {
                            "id": "8d4baeb6-dcd8-46c6-ab83-a44050183128",
                            "addDeduct": "DEDUCT",
                            "name": "discount",
                            "total": 10.00000,
                            "type": "FIXED_VALUE",
                            "value": 10.00000
                        }
                    ],
                    "invoiceDate": "2021-05-27",
                    "invoiceId": "f90280ab-70e2-48ba-b911-e27fffc73bc1",
                    "invoiceNumber": `INV12345670433_${new Date().getTime()}`,
                    "invoiceSubTotal": 910.00000,
                    "totalDiscount": 110.00000,
                    "totalTax": 101.00000,
                    "totalAmount": 991.00000,
                    "totalPaid": 0.00000,
                    "balanceAmount": 991.00000,
                    "numberOfDocuments": 0,
                    "documents": [
                        {
                            "documentId": "96ea7d60-89ed-4c3b-811c-d2c61f5feab2",
                            "documentName": "Bill",
                            "documentUrl": "http://url.com/#123"
                        }
                    ],
                    "items": [
                        {
                            "itemReference": "itemRef",
                            "description": "Honda RC150",
                            "quantity": 1.00000,
                            "rate": 1000.00000,
                            "amount": 910.00000,
                            "orderIndex": 1,
                            "itemName": "Honda Motor",
                            "itemUOM": "KG",
                            "customFields": [
                                {
                                    "key": "taxiationAndDiscounts_Name",
                                    "value": "VAT"
                                }
                            ],
                            "extensions": [
                                {
                                    "id": "9a49c6c1-de0c-4337-921b-b02a501a06c8",
                                    "addDeduct": "ADD",
                                    "name": "tax",
                                    "total": 10.00000,
                                    "type": "FIXED_VALUE",
                                    "value": 10.00000
                                },
                                {
                                    "id": "173f3a7f-1731-400c-8d89-38186ae5d691",
                                    "addDeduct": "DEDUCT",
                                    "name": "tax",
                                    "total": 100.00000,
                                    "type": "PERCENTAGE",
                                    "value": 10.00000
                                }
                            ],
                            "netAmount": 1000.00000
                        }
                    ],
                    "merchant": {
                        "id": "6bf32cc4-2dfb-40c6-bd41-a6aea55fd4dc",
                        "addresses": []
                    },
                    "payments": [],
                    "referenceNo": "#123456",
                    "invoiceReference": "#123456",
                    "status": [
                        {
                            "key": "Overdue",
                            "value": true
                        }
                    ],
                    "subStatus": [],
                    "type": "TAX_INVOICE",
                    "version": "1",
                    "invoiceGrossTotal": 1000.00000,
                    "customFields": [
                        {
                            "key": "invoiceCustomField",
                            "value": "value"
                        }
                    ]
                }
            ]
        };
        setIsModalVisible(false);
        await createNewInvoice(accessToken, orgToken, newInvoice);
        await fetchInvoiceList();
        setIsModalVisible(false);
        // setInvoiceList([...invoiceList, newInvoice]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

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
                            placeholder="Search Invoice Number"
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
                            <Select.Option value="overdue">Overdue</Select.Option>
                        </Select>
                        <Button type="primary" onClick={showModal}>
                            Create Invoice
                        </Button>
                        <Table
                            dataSource={pagedData}
                            pagination={paginationConfig}
                            rowKey="invoiceId"
                            size="middle"
                            scroll={{ x: 1000 }}
                        >
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
            <Modal title="Create New Invoice" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Row>
                        <Col span={24}><h3>Bank Account</h3></Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Account Number" name="accountNumber" rules={[{ required: true, message: 'Please input your account number!' }]}>
                                <Input value={accountNumber} onChange={handleAccountNumberChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Account Name" name="accountName" rules={[{ required: true, message: 'Please input your Account name!' }]}>
                                <Input value={accountName} onChange={handleAccountNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Sort Code" name="sortCode" rules={[{ required: true, message: 'Please input your sort code!' }]}>
                                <Input value={sortCode} onChange={handleSortCodeChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}><h3>Customer</h3></Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                                <Input value={firstName} onChange={handleFirstNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                                <Input value={lastName} onChange={handleLastNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: false, message: '' }]}>
                                <Input value={email} onChange={handleEmailChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Phone" name="phone" rules={[{ required: false, message: '' }]}>
                                <Input value={phone} onChange={handlePhoneChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Country Code" name="countryCode" rules={[{ required: false, message: '' }]}>
                                <Input value={countryCode} onChange={handleCountryCodeChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Post Code" name="postCode" rules={[{ required: false, message: '' }]}>
                                <Input value={postCode} onChange={handlePostCodeChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Country" name="country" rules={[{ required: false, message: '' }]}>
                                <Input value={country} onChange={handleCountryChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="City" name="city" rules={[{ required: false, message: '' }]}>
                                <Input value={city} onChange={handleCityChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h3>Invoice</h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Invoice Number" name="invoiceNumber" rules={[{ required: true, message: 'Please input invoice number' }]}>
                                <Input value={invoiceNumber} onChange={handleInvoiceNumberChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Currency" name="currency" rules={[{ required: true, message: 'Please input currency' }]}>
                                <Input value={currency} onChange={handleCurrencyChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: false, message: '' }]}>
                                <Input value={invoiceDate} onChange={handleInvoiceDateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Due Date" name="dueDate" rules={[{ required: false, message: '' }]}>
                                <Input value={dueDate} onChange={handleDueDateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Description" name="description" rules={[{ required: false, message: '' }]}>
                                <Input value={description} onChange={handleDescriptionChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h3>Item</h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Item Name" name="itemName" rules={[{ required: true, message: 'Please input item name' }]}>
                                <Input value={itemName} onChange={handleItemNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Description" name="itemDescription" rules={[{ required: false, message: '' }]}>
                                <Input value={itemDescription} onChange={handleItemDescriptionChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please input quantity' }]}>
                                <Input value={quantity} onChange={handleQuantityChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Rate" name="rate" rules={[{ required: false, message: '' }]}>
                                <Input value={rate} onChange={handleRateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Item UOM" name="itemUOM" rules={[{ required: false, message: '' }]}>
                                <Input value={itemUOM} onChange={handleItemUOMChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};
  
export default InvoiceListPage;