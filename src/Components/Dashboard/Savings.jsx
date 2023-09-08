import { Button, Form, Modal, Input, Card, Pagination, Progress } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { UserAuth } from "../../Context/AuthContext";

const Savings = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState(false);
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [amountData, setAmountData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Add search query state

    const {
        addSavings,
        fetchData,
        refresh,
        editData,
        deleteData,
        fetchTotalAmounts,
    } = UserAuth();

    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        fetchData("savings").then((savingsData) => {
            setData(
                savingsData.sort(
                    (saving1, saving2) =>
                        new Date(saving2.deadline) - new Date(saving1.deadline)
                )
            );
            // console.log("savingsdata: ", savingsData);
        });
        fetchTotalAmounts().then((userCreditDebit) => {
            setAmountData(userCreditDebit);
            // console.log("amountData: ", amountData);
        });
    }, [fetchData, refresh, fetchTotalAmounts]);

    const CardsPerPage = 2;
    const startIndex = (currentPage - 1) * CardsPerPage;
    const endIndex = startIndex + CardsPerPage;

    const filteredData = data
        ? data.filter((card) =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];
    const visibleCards = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const OnClickAddSavings = () => {
        // console.log("Add savings clicked");
        setIsAdding(true);
    };

    const handleAddSavings = (cardData) => {

        if (!cardData.description) {
            cardData.description = " ";
        }
        cardData.amount = Number(cardData.amount);

        addSavings(cardData);
    }

    const resetAddSavings = () => {
        // console.log("Add savings finished");
        setIsAdding(false);
    }

    const onDeleteData = (cardData) => {
        // console.log("card data on delete: ", cardData);
        Modal.confirm({
            title: "Are you sure you want to delete this savings record?",
            onOk: () => {
                deleteData("savings", cardData.id);
            }
        });
    }

    const onEditData = (cardData) => {
        setIsEditing(true);
        setEditingData(cardData);
    }

    const resetEditing = () => {
        setIsEditing(false);
        setEditingData(null);
    }

    const handleEdit = (cardData) => {

        if (!cardData.description) {
            cardData.description = " ";
        }
        cardData.amount = Number(cardData.amount)

        editData("savings", editingData.id, cardData);
    }

    const savingsProgress = (cardData) => {
        const userTotalCredit = amountData[0];
        const userTotalDebit = amountData[1];

        const userTotalSavings = userTotalCredit - userTotalDebit;

        //percentage
        const progress = Math.round((userTotalSavings / cardData.amount) * 100)
        // console.log("progress: ", progress);
        return progress;
    }

    return (
        <div>
            <div className="add-delete-button">
                <Button style={{ fontWeight: 700, blockSize: 45, marginTop: -10 }} onClick={OnClickAddSavings}>Add Savings</Button>
            </div>
                    {/* Add search input field */}
            <Input
                type="text"
                placeholder="Search by title"
                style={{marginTop: -7, marginBottom: 15}}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="savings-page">

                <Modal
                    title="Add Savings"
                    okText="Save"
                    open={isAdding}
                    onCancel={resetAddSavings}
                    onOk={() => {
                        addForm
                            .validateFields()
                            .then((values) => {
                                addForm.resetFields();
                                handleAddSavings(values);
                                resetAddSavings();
                            })
                            .catch((error) => {
                                console.log("add savings error: ", error);
                            })
                    }}
                >
                    <Form
                        form={addForm}
                        name="add"
                        autoComplete="off"
                        onFinish={handleAddSavings}
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            initialValue=""
                            style={{marginLeft: 32}}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your savings title!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="text"
                            />
                        </Form.Item>


                        <Form.Item
                            label="Amount"
                            name="amount"
                            initialValue=""
                            style={{ marginLeft: 9 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your amount!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="number"
                                min="0"
                                placeholder='1000'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            initialValue=""
                            rules={[
                                {
                                  validator(rule, description){
                                    return new Promise((resolve, reject) => {
                                      if (description?.length > 80){
                                        reject("Description cannot exceed 80 characters!")
                                      }
                                      else{
                                        resolve();
                                      }})
                                  } 
                                }
                              ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="text"
                                
                            />
                        </Form.Item>

                        <Form.Item
                            label="Deadline"
                            name="deadline"
                            initialValue=""
                            style={{marginLeft: 6}}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the deadline date!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="date"
                            />
                        </Form.Item>

                    </Form>

                </Modal>

                <Modal
                    title="Edit Savings"
                    okText="Save"
                    open={isEditing}
                    onCancel={() => {
                        editForm
                            .validateFields()
                            .then(() => {
                                editForm.resetFields();
                                resetEditing();
                                // console.log("onc editing data: ", editingData);
                            })
                    }}
                    onOk={() => {
                        editForm
                            .validateFields()
                            .then((values) => {
                                editForm.resetFields();
                                handleEdit(values);
                                resetEditing();
                            })
                            .catch((error) => {
                                console.log("edit savings error: ", error);
                            })
                    }}

                >
                    <Form
                        form={editForm}
                        name="edit"
                        autoComplete="off"
                        onFinish={handleEdit}
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            initialValue={editingData?.title}
                            style={{marginLeft: 32}}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your savings title!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="text"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Amount"
                            name="amount"
                            initialValue={editingData?.amount}
                            style={{marginLeft: 9}}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your amount!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="number"
                                min="0"
                                placeholder='1000'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            initialValue={editingData?.description}
                            rules={[
                                {
                                  validator(rule, description){
                                    return new Promise((resolve, reject) => {
                                      if (description?.length > 100){
                                        reject("Description cannot exceed 100 characters!")
                                      }
                                      else{
                                        resolve();
                                      }})
                                  } 
                                }
                              ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="text"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Deadline"
                            name="deadline"
                            initialValue={editingData?.deadline}
                            style={{marginLeft: 6}}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the deadline date!',
                                },
                            ]}
                        >
                            <Input
                                style={{width: 390}}
                                type="date"
                            />
                        </Form.Item>

                    </Form>

                </Modal>

                <div className="card-container">
                    {visibleCards.map((card) => (
                        <Card key={card.id} title={card.title}
                            actions={[
                                <EditOutlined onClick={() => {
                                    resetEditing();
                                    onEditData(card);
                                }} />,
                                <DeleteOutlined onClick={() => onDeleteData(card)} style={{ color: "red" }} />,
                            ]}>
                            <p>Amount: {card.amount}</p>
                            <p>Description: {card.description}</p>
                            <p>Deadline: {card.deadline}</p>
                            <Progress style={{ marginTop: 2, marginBottom: 5}} type="circle" percent={savingsProgress(card)} size="default" />
                            <div> {amountData[0] - amountData[1]} / {card.amount}</div>
                        </Card>
                    ))}
                </div>

                {/*SEARCH SAVINGS!!! AND LAYOUT OF FORMS!!! */}
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    style={{marginBottom: -15}}
                    total={data?.length}
                    pageSize={CardsPerPage}
                />
            </div>
        </div>
    );
}

export default Savings;