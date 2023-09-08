import { Table, message, Modal, Input, Form, Select, Button } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";

const IncExpTable = (props) => {
    const { fetchData, deleteData, editData, refresh, fetchAccountTypes } = UserAuth();

    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [searchedText, setSearchedText] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [accountTypes, setAccountTypes] = useState([]);

    const [form] = Form.useForm();
    // console.log("prop budget type: ", props.budgetType);

    useEffect(() => {
        if (props.budgetType === "income") {
            fetchData("income",'C').then(incomeData => {
                setData(incomeData);
                // console.log("incomedata: ", incomeData);
                    
            });

            fetchAccountTypes("income").then(incomeTypes => {
                setAccountTypes(incomeTypes);
            })
        }
        else if (props.budgetType === "expense"){
            fetchData("expense",'D').then(expenseData => {
                setData(expenseData);
                // console.log("expense data: ", expenseData)
            })

            fetchAccountTypes("expense").then(expenseTypes => {
                setAccountTypes(expenseTypes);
            })
        }
        
    }, [fetchData, props.budgetType, refresh, fetchAccountTypes])

    // console.log("incexp table data: ", data)

    
    const columns = [
        {
          key: '1',
          title: 'Account Type',
          dataIndex: 'accountType',
          filters: accountTypes,
          filterMode: 'tree',
          filterSearch: true,
          onFilter: (value, record) => {
            // console.log("current value: ", value)
            // console.log("current filter record: ", record)
            return record.accountType.startsWith(value)
          },
        },
        
        searchedText ?  //if not searching then let user filter account types
        {
            key: '2',
            title: 'Title',
            dataIndex: 'title',
            filteredValue: [searchedText],      
            sorter : (record1, record2) => {  //for sorting
                return (record1.title).localeCompare(record2.title);  
            },
            onFilter : (value, record) => { //for searching 
                return record.title.toLowerCase().includes(value.toLowerCase());
            },
        } 
        : 
        {
            key: '2',
            title: 'Title',
            dataIndex: 'title',
            sorter : (record1, record2) => {
                return (record1.title).localeCompare(record2.title);  
            },
        },
        {
            key: '3',
            title: 'Amount',
            dataIndex: 'amount',
            sorter : (record1, record2) => {  //for sorting
                return record2.amount - record1.amount;  
            }
        },
        {
            key: '4',
            title: 'Transaction Description',
            dataIndex: 'transactionDescription'
        },
        {
            key: '5',
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            sorter : (record1, record2) => {  //for sorting
                return new Date(record2.transactionDate) - new Date(record1.transactionDate);  
            }
        },
        {
          key: '6',
          title: 'Actions',
          render: (record) => {
            return( 
            <>
            <EditOutlined onClick={() => {onEditData(record)}}/>
            <DeleteOutlined onClick={() => {onDeleteData(record)}} style={{color: "red", marginLeft: 15}}/>
            {/* {console.log("record: ", record)} */}
            </>
          )}
        }
      ]


    //ui edit clicked
    const onEditData = (record) => {
        // console.log("record on edit data: ", record);
        setEditingData({...record}); //copy of record being edited 
        setIsEditing(true);
        // console.log("isEditing: ", isEditing, " editingData: ", editingData);
    }

    //reset editing properties (cancel/finish editing)
    const resetEditing = () => {
        setEditingData(null);
        setIsEditing(false);
    }

    const handleEdit = (values) => {
        // console.log("handle edit values: ", values)
        if (!values.transactionDescription) {
            values.transactionDescription = " ";
        }
        values.amount = Number(values.amount);
        // values.transactionDate = Date(values.transactionDate);

        editData(props.budgetType, editingData.id, values);
      }

    const onDeleteData = (record) => {
    // console.log("delete record", record);
    Modal.confirm({
        title : "Are you sure you want to delete this record?",
        onOk: () => {
            deleteData(props.budgetType, record.id);
        }
        });
    }

      //deleted selected todos
    const deleteSelectedRecords = () => {
        if (selectedRecords.length === 0) {
        messageApi.info("No records have been selected!");
        // alert("No ToDos have been selected!");
        }
        else {
        // console.log("Selected Records", selectedRecords);
        const titleMessage = `Are you sure you want to delete these records? (${selectedRecords.length} records selected)`;
        Modal.confirm({
            title: titleMessage,
            
            onOk: () => {
            selectedRecords.forEach((dataID) => {
                deleteData(props.budgetType, dataID);
                setSelectedRecords([]);
                })
            }
        })
    }
    }

    return (
        <div>
            <Input.Search
                placeholder={`Search ${props.budgetType}`}
                style={{marginBottom: 5}}
                onSearch={(value) => setSearchedText(value)}
                onChange={(e) => setSearchedText(e.target.value)} /> {/* search while typing */}

            <Table columns={columns} dataSource={data} pagination={{pageSize : 5}} rowSelection={{
                type: 'checkbox',
                selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_NONE,
                    Table.SELECTION_INVERT,
                ],
                onChange: (keys) => {
                    setSelectedRecords(keys);
                }
            }} rowKey="id"></Table>

            <Modal
                title="Edit Income"
                okText="Save"
                open={isEditing}
                onCancel={() => {
                    form    //edit fields should immediately be that record's! check...
                    .validateFields()
                    .then(() => {
                        form.resetFields();
                        resetEditing();
                    })
                }}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            // form.resetFields();
                            handleEdit(values);
                            resetEditing();
                        })
                        .catch((error) => {
                            console.log("add income error: ", error);
                        })
                }}
                // okType="primary"
                // okButtonProps={{type: "primary", htmlType: "submit"}}

            >
                <Form
                    form={form}
                    // className=''
                    name="edit-record"
                    autoComplete="off"
                    initialValues={editingData}
                    // onFinish={}
                >
                    {/* <Typography.Title style={{marginLeft: 10}}>Add Income!</Typography.Title> */}
                
                    <Form.Item
                    label=""
                    name="accountType"
                    // initialValue={editingData?.accountType}
                    rules={[
                        // {
                        // required: true,
                        // message: 'Please choose the account type!',
                        // },
                        // {
                        //   validator: 
                        // }
                    ]}
                    // required
                    >
                        {/* <Space wrap>
                            
                        </Space> */}
                        <Select
                                placeholder="Account Type" 
                                // onClick={(values) => setAccountType(values.currentTarget.value)}
                                // defaultValue="Account type"
                                style={{
                                    width: '100%',
                                  }}
                                // onChange={(value) => setAccountType(value)}
                                options={accountTypes} //fetch account types from firebase!
                                // value={accountType}
                            >
                                
                            </Select>
                    </Form.Item>

                    <Form.Item
                        label="Title"
                        name="title"
                        // initialValue={editingData?.title}
                        style={{ marginLeft: 108 }}
                        rules={[
                            {
                            required: true,
                            message: 'Please input your transaction title!',
                            },
                        ]}
                        >
                        <Input 
                            type="text"
                            style={{ width: 315 }}
                            // value={transactionDescription}
                            // onChange={(e) => settransactionDescription(e.target.value)}
                            />
                    </Form.Item>

                    <Form.Item
                    label="Amount"
                    name="amount"
                    // initialValue={editingData?.amount}
                    style={{ marginLeft: 83}}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your amount!',
                        },
                        // // {
                        // //   validator: 
                        // // }
                    ]}
                    >
                        <Input 
                        type="number" 
                        min="0" 
                        style={{ width: 315 }}
                        // onInput={() => this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null}
                        placeholder='1000' 
                        // value={amount}
                        // onChange={(e) => setamount(e.target.value)}
                        />    
                    </Form.Item>

                    <Form.Item
                    label="Transaction Description"
                    name="transactionDescription"
                    // initialValue={editingData?.transactionDescription}
                    rules={[
                        {
                        // required: true,
                        // message: 'Please input your transaction description!',
                        },
                    ]}
                    >
                    <Input 
                        type="text"
                        style={{ width: 315}}
                        // value={transactionDescription}
                        // onChange={(e) => settransactionDescription(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Transaction Date"
                    name="transactionDate"
                    // initialValue={editingData?.transactionDate}
                    style={{ marginLeft: 30 }} 
                    rules={[
                        {
                        required: true,
                        message: 'Please input your transaction date!',
                        },
                        // {
                        //   validator: 
                        // }
                    ]}
                    >
                        <Input 
                        type="date"
                        style={{ width: 315 }} 
                        // placeholder='1000' 
                        // value={transactionDate}
                        // onChange={(e) => setamount(e.target.value)}
                        />    
                    </Form.Item>
        
                </Form>

            </Modal>
            {contextHolder /* popup message for deleting multiple records */} 
           
            <div className="add-delete-button">
                <Button onClick={deleteSelectedRecords} style={{color:"red", marginTop: 10}}>Delete Selected Records</Button>
            </div>

        </div>

        
    )

}

export default IncExpTable;