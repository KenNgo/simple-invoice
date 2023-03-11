import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, PaginationProps, Row, Select, Spin } from 'antd';
import { SorterResult, SortOrder } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceTable from '../../components/Invoice/InvoiceTable';
import { Invoice } from '../../interfaces/models/Invoice';
import { GetInvoiceRequestParams } from '../../interfaces/requests/getInvoiceRequest';
import { getOrgToken } from '../../services/auth/getToken';
import { fetchInvoices } from '../../services/invoice/fetchInvoices';
import { createNewInvoice } from '../../services/InvoiceService';
import { camelCaseToUpperCase } from '../../utils/helper';
import './InvoiceListPage.scss';

const SORT_ASC = 'ASCENDING';
const SORT_DESC = 'DESCENDING';

const defaultInvoicesParams: GetInvoiceRequestParams = {
    pageNum: 1,
    pageSize: 10,
};

const defaultPaginationConfig: PaginationProps = {
    defaultCurrent: defaultInvoicesParams.pageNum,
    defaultPageSize: defaultInvoicesParams.pageSize,
    pageSizeOptions: [10, 20, 50, 100],
};

const InvoiceListPage: React.FC = () => {
    const [invoiceParams, setInvoiceParams] = useState(defaultInvoicesParams);
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [paginationConfig, setPaginationConfig] = useState<PaginationProps>(defaultPaginationConfig);
    const [sortedBy, setSortedBy] = useState<string | undefined>(undefined);
    const [ordering, setOrdering] = useState<SortOrder>(null);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [selectedInvoiceType, setSelectedInvoiceType] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [orgToken, setOrgToken] = useState<string | null>(null);

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

    const onSearchKeyword = (value: string) => {
        const params = invoiceParams;
        params.keyword = value;

        setKeyword(value);
        fetchInvoiceList(params);
    };

    const onSelectInvoiceType = (selected: string) => {
        if (selected === selectedInvoiceType) return;
        const params = invoiceParams;

        params.status = selected !== '' ? selected : undefined;

        setSelectedInvoiceType(selected);
        fetchInvoiceList(params);
    };

    const onTablePaginationChanged = (page: number, size: number) => {
        const params = {
            ...invoiceParams,
            pageNum: page,
            pageSize: size,
        };
        setInvoiceParams(params);
        fetchInvoiceList(params);
    };

    const onTableChanged = (sorter: SorterResult<Invoice> | SorterResult<Invoice>[]) => {
        if (Array.isArray(sorter)) {
            return;
        } else {
            const { field, order } = sorter;
            if (field === sortedBy && order === ordering) return;

            const params = invoiceParams;
            const sortField = field?.toString();
            const sortParam = camelCaseToUpperCase(sortField ?? null);
            const orderParam = order === 'ascend' ? SORT_ASC : order === 'descend' ? SORT_DESC : null;

            if (sortParam != null) {
                params.sortBy = sortParam;
            }

            if (orderParam != null) {
                params.ordering = orderParam;
            }

            setSortedBy(sortField);
            setOrdering(order ?? null);
            fetchInvoiceList(params);
        }
    };

    // get org_token and then get invoice list
    async function fetchInvoiceList(params: GetInvoiceRequestParams) {
        setIsLoading(true);
        let access_token = accessToken;
        let org_token = orgToken;

        if (access_token == null) {
            access_token = sessionStorage.getItem('access_token');

            if (!access_token) {
                navigate('/');
                return;
            }

            setAccessToken(access_token);
        }

        try {
            if (org_token == null) {
                org_token = await getOrgToken(access_token);
                setOrgToken(org_token);
            }

            const result = await fetchInvoices(access_token, org_token, params);

            if (result == null) {
                setInvoiceList([]);
                return;
            } else {
                const { invoices, paging } = result;

                setPaginationConfig({
                    ...paginationConfig,
                    current: paging.pageNumber,
                    pageSize: paging.pageSize,
                    total: paging.totalRecords,
                });
                setInvoiceList(invoices);
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            navigate('/');
        }
    }

    // Used for first time mounted
    useEffect(() => {
        fetchInvoiceList(invoiceParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(event.target.value);
    };

    const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(event.target.value);
    };

    const handleSortCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortCode(event.target.value);
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    };

    const handleCountryCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountryCode(event.target.value);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const handlePostCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostCode(event.target.value);
    };

    const handleInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvoiceNumber(event.target.value);
    };

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };

    const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(event.target.value);
    };

    const handleInvoiceDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvoiceDate(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    };

    const handleItemDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemDescription(event.target.value);
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(event.target.value));
    };

    const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRate(parseInt(event.target.value));
    };

    const handleItemUOMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemUOM(event.target.value);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        // create new invoice
        const newInvoice = {
            data: [
                {
                    bankAccount: {
                        bankId: '',
                        sortCode: '09-01-01',
                        accountNumber: '12345678',
                        accountName: 'John Terry',
                    },
                    currency: 'GBP',
                    currencySymbol: '£',
                    customer: {
                        id: 'b605ad26-dd5d-4ea3-a7de-a0b7c5219528',
                        firstName: 'Nguyen',
                        lastName: 'Dung 2',
                        name: 'Dung 2',
                        contact: {
                            email: 'nguyendung2@101digital.io',
                            mobileNumber: '+6597594971',
                        },
                        addresses: [
                            {
                                addressType: 'BILLING',
                                override: false,
                                isDefault: false,
                                premise: 'CT11',
                                city: 'hanoi',
                                county: 'hoangmai',
                                postcode: '1000',
                                countryCode: 'VN',
                                customFields: [],
                            },
                        ],
                    },
                    description: 'Invoice is issued to Akila Jayasinghe',
                    dueDate: '2021-06-04',
                    extensions: [
                        {
                            id: '293b2b3f-f70c-476d-a68d-14a62fd2392f',
                            addDeduct: 'ADD',
                            name: 'tax',
                            total: 91.0,
                            type: 'PERCENTAGE',
                            value: 10.0,
                        },
                        {
                            id: '8d4baeb6-dcd8-46c6-ab83-a44050183128',
                            addDeduct: 'DEDUCT',
                            name: 'discount',
                            total: 10.0,
                            type: 'FIXED_VALUE',
                            value: 10.0,
                        },
                    ],
                    invoiceDate: '2021-05-27',
                    invoiceId: 'f90280ab-70e2-48ba-b911-e27fffc73bc1',
                    invoiceNumber: `INV12345670433_${new Date().getTime()}`,
                    invoiceSubTotal: 910.0,
                    totalDiscount: 110.0,
                    totalTax: 101.0,
                    totalAmount: 991.0,
                    totalPaid: 0.0,
                    balanceAmount: 991.0,
                    numberOfDocuments: 0,
                    documents: [
                        {
                            documentId: '96ea7d60-89ed-4c3b-811c-d2c61f5feab2',
                            documentName: 'Bill',
                            documentUrl: 'http://url.com/#123',
                        },
                    ],
                    items: [
                        {
                            itemReference: 'itemRef',
                            description: 'Honda RC150',
                            quantity: 1.0,
                            rate: 1000.0,
                            amount: 910.0,
                            orderIndex: 1,
                            itemName: 'Honda Motor',
                            itemUOM: 'KG',
                            customFields: [
                                {
                                    key: 'taxiationAndDiscounts_Name',
                                    value: 'VAT',
                                },
                            ],
                            extensions: [
                                {
                                    id: '9a49c6c1-de0c-4337-921b-b02a501a06c8',
                                    addDeduct: 'ADD',
                                    name: 'tax',
                                    total: 10.0,
                                    type: 'FIXED_VALUE',
                                    value: 10.0,
                                },
                                {
                                    id: '173f3a7f-1731-400c-8d89-38186ae5d691',
                                    addDeduct: 'DEDUCT',
                                    name: 'tax',
                                    total: 100.0,
                                    type: 'PERCENTAGE',
                                    value: 10.0,
                                },
                            ],
                            netAmount: 1000.0,
                        },
                    ],
                    merchant: {
                        id: '6bf32cc4-2dfb-40c6-bd41-a6aea55fd4dc',
                        addresses: [],
                    },
                    payments: [],
                    referenceNo: '#123456',
                    invoiceReference: '#123456',
                    status: [
                        {
                            key: 'Overdue',
                            value: true,
                        },
                    ],
                    subStatus: [],
                    type: 'TAX_INVOICE',
                    version: '1',
                    invoiceGrossTotal: 1000.0,
                    customFields: [
                        {
                            key: 'invoiceCustomField',
                            value: 'value',
                        },
                    ],
                },
            ],
        };
        setIsModalVisible(false);
        await createNewInvoice(accessToken, orgToken, newInvoice);
        await fetchInvoiceList(invoiceParams);
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
                            placeholder='Search Invoice Number'
                            allowClear
                            defaultValue={keyword}
                            onSearch={(value) => onSearchKeyword(value)}
                            style={{ width: '250px', marginBottom: '16px' }}
                            prefix={<SearchOutlined />}
                        />
                        <Select
                            defaultValue={selectedInvoiceType}
                            style={{ width: '150px', marginBottom: '16px', marginRight: '16px' }}
                            onChange={onSelectInvoiceType}
                        >
                            <Select.Option value=''>All</Select.Option>
                            <Select.Option value='Paid'>Paid</Select.Option>
                            <Select.Option value='Overdue'>Overdue</Select.Option>
                        </Select>
                        <Button type='primary' onClick={showModal}>
                            Create Invoice
                        </Button>

                        <InvoiceTable
                            sortBy={sortedBy}
                            ordering={ordering}
                            dataSource={invoiceList}
                            pagination={{
                                ...paginationConfig,
                                onChange: onTablePaginationChanged,
                            }}
                            onChange={(pagination, filters, sorter, extras) => onTableChanged(sorter)}
                        />
                    </div>
                </div>
            )}
            <Modal title='Create New Invoice' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form name='basic' onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Row>
                        <Col span={24}>
                            <h3>Bank Account</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label='Account Number'
                                name='accountNumber'
                                rules={[{ required: true, message: 'Please input your account number!' }]}
                            >
                                <Input value={accountNumber} onChange={handleAccountNumberChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Account Name'
                                name='accountName'
                                rules={[{ required: true, message: 'Please input your Account name!' }]}
                            >
                                <Input value={accountName} onChange={handleAccountNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Sort Code'
                                name='sortCode'
                                rules={[{ required: true, message: 'Please input your sort code!' }]}
                            >
                                <Input value={sortCode} onChange={handleSortCodeChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h3>Customer</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label='First Name'
                                name='firstName'
                                rules={[{ required: true, message: 'Please input your first name!' }]}
                            >
                                <Input value={firstName} onChange={handleFirstNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Last Name'
                                name='lastName'
                                rules={[{ required: true, message: 'Please input your last name!' }]}
                            >
                                <Input value={lastName} onChange={handleLastNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Email' name='email' rules={[{ required: false, message: '' }]}>
                                <Input value={email} onChange={handleEmailChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Phone' name='phone' rules={[{ required: false, message: '' }]}>
                                <Input value={phone} onChange={handlePhoneChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Country Code'
                                name='countryCode'
                                rules={[{ required: false, message: '' }]}
                            >
                                <Input value={countryCode} onChange={handleCountryCodeChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Post Code' name='postCode' rules={[{ required: false, message: '' }]}>
                                <Input value={postCode} onChange={handlePostCodeChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Country' name='country' rules={[{ required: false, message: '' }]}>
                                <Input value={country} onChange={handleCountryChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='City' name='city' rules={[{ required: false, message: '' }]}>
                                <Input value={city} onChange={handleCityChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h3>Invoice</h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Invoice Number'
                                name='invoiceNumber'
                                rules={[{ required: true, message: 'Please input invoice number' }]}
                            >
                                <Input value={invoiceNumber} onChange={handleInvoiceNumberChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Currency'
                                name='currency'
                                rules={[{ required: true, message: 'Please input currency' }]}
                            >
                                <Input value={currency} onChange={handleCurrencyChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Invoice Date'
                                name='invoiceDate'
                                rules={[{ required: false, message: '' }]}
                            >
                                <Input value={invoiceDate} onChange={handleInvoiceDateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Due Date' name='dueDate' rules={[{ required: false, message: '' }]}>
                                <Input value={dueDate} onChange={handleDueDateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label='Description'
                                name='description'
                                rules={[{ required: false, message: '' }]}
                            >
                                <Input value={description} onChange={handleDescriptionChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h3>Item</h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Item Name'
                                name='itemName'
                                rules={[{ required: true, message: 'Please input item name' }]}
                            >
                                <Input value={itemName} onChange={handleItemNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Description'
                                name='itemDescription'
                                rules={[{ required: false, message: '' }]}
                            >
                                <Input value={itemDescription} onChange={handleItemDescriptionChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Quantity'
                                name='quantity'
                                rules={[{ required: true, message: 'Please input quantity' }]}
                            >
                                <Input value={quantity} onChange={handleQuantityChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Rate' name='rate' rules={[{ required: false, message: '' }]}>
                                <Input value={rate} onChange={handleRateChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Item UOM' name='itemUOM' rules={[{ required: false, message: '' }]}>
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
