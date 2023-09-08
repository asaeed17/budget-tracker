import { Button, Modal, Form, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { UserAuth } from "../../Context/AuthContext";
import IncExpTable from "./IncomeExpenseTable";

const Income = () => {
    const [form] = Form.useForm();
    const [isAddingIncome, setIsAddingIncome] = useState(false);
    const [incomeTypes, setIncomeTypes] = useState([]);

    const { addIncomeOrExpense, fetchAccountTypes } = UserAuth();
    
    useEffect(() => {
            
        fetchAccountTypes("income").then(incomeTypes => {
            setIncomeTypes(incomeTypes);
        })
        
    }, [fetchAccountTypes])

    const OnClickAddIncome = () => {
        // console.log("Add income clicked");
        setIsAddingIncome(true);
    }

    const resetAddIncome = () => {
        // console.log("Add income finished");
        setIsAddingIncome(false);
    }

    const handleAddIncome = (incomeValues) => {
        // console.log("Income added to firebase: ", incomeValues);
        // console.log("account type: ", accountType)
        // console.log("final form income values: ", incomeValues);
        if (!incomeValues.transactionDescription) {
            incomeValues.transactionDescription = " ";
        }
        incomeValues.amount = Number(incomeValues.amount);


        addIncomeOrExpense(incomeValues, 'C');
    }

    return (
        <div>
            <div className="add-delete-button">
                <Button style={{ fontWeight: 700, blockSize: 45, }} onClick={OnClickAddIncome}>Add Income</Button>
            </div>
            <Modal
                title="Add Income"
                okText="Save"
                open={isAddingIncome}
                onCancel={resetAddIncome}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleAddIncome(values);
                            resetAddIncome();
                        })
                        .catch((error) => {
                            console.log("add income error: ", error);
                        })
                }}

            >
                <Form
                    form={form}
                    name="add-income"
                    autoComplete="off"
                    onFinish={handleAddIncome}
                >

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Form.Item
                            label=""
                            name="accountType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose the account type!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Account Type"
                                style={{
                                    width: '100%',
                                }}
                                options={incomeTypes}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Title"
                            name="title"
                            style={{ marginLeft: 108 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your transaction title!',
                                },
                            ]}
                        >
                            <Input type="text" style={{ width: 315 }} />
                        </Form.Item>

                        <Form.Item
                            label="Amount"
                            name="amount"
                            style={{ marginLeft: 83 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your amount!',
                                },
                            ]}
                        >
                            <Input type="number" min="0" placeholder="1000"
                                style={{ width: 315 }} />
                        </Form.Item>

                        <Form.Item
                            label="Transaction Description"
                            name="transactionDescription"
                        >
                            <Input type="text" style={{ width: 315 }} />
                        </Form.Item>

                        <Form.Item
                            label="Transaction Date"
                            name="transactionDate"
                            style={{ marginLeft: 30 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your transaction date!',
                                },
                            ]}
                        >
                            <Input type="date" style={{ width: 315 }} />
                        </Form.Item>
                    </div>

                </Form>

            </Modal>

            <div style={{ marginTop: 20 }}>
                <IncExpTable budgetType="income" />
            </div>

        </div>

    );
}

export default Income;