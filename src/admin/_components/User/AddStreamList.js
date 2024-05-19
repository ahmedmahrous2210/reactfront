import React, { useState, Component } from 'react';
import { Form, Input, Button, Select, Upload, message, DatePicker} from 'antd';
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import ErrorComponent from '../ErrorComponent';
import { Link } from 'react-router-dom';
const { Option } = Select;
export default class AddStreamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentSize: 'middle',
            setComponentSize: 'middle',
            loader: false,
            loading: false,
            imageUrl: false,
            userIdCard: false,
            successMsg: '',
            showAlert: false,
            alertType: 'danger',
            alertBody: '',
            isEditForm: false,
            editId: this.props.match.params.id || null,
            rolesData: [],
            activationCode:''
        }
        this.generateToken = this.generateToken.bind(this);
    }

    formRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };

    componentDidMount(props) {
        if (this.state.editId !== null) {
            this.setState({
                isEditForm: true
            });
        }
    }

    generateToken() {
        var result           = '';
        //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var characters       = '0123456789';
        //var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            characters.length));
        }
        if(result !== ''){
            
            this.formRef.current.setFieldsValue({
                //activation_code:result.toUpperCase()
                activation_code:result
            });
            this.setState({
                activationCode: result
            });
        }
        
       
    }

    onFinish = (values) => {
        //console.log("values" + JSON.stringify(values));
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        values.created_by = localStorageData.id;
        values.group_id = '3';
        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {

            apiService.AddStreamListActivation(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'StreamList added successfully',
                        userIdCard: false,
                        imageUrl: false
                    });
                    this.onReset();
                } else {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'StreamList already exist or invalid inputs!',
                    });
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    loader: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertBody: 'Something went wrong!',
                });
            });
        });
    }
    render() {
        const { componentSize, activationCode } = this.state;
        const onFormLayoutChange = ({ size }) => {
            this.setState({
                setComponentSize: size,
                componentSize: size
            });
        };
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-align-justify"></i> Add Stream activation{" "}
                                <small className="text-muted">Form</small>
                                {/* <Link to="/users" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Users List</Link> */}
                            </CardHeader>
                            <CardBody>
                                {this.state.showAlert ? <AlertMsgComponent alertBody={this.state.alertBody} alertType={this.state.alertType} /> : ""}
                                <Form
                                    ref={this.formRef}
                                    name="register"
                                    onFinish={this.onFinish}
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 14,
                                    }}
                                    layout="horizontal"
                                    initialValues={{
                                        size: componentSize,
                                    }}
                                    onValuesChange={onFormLayoutChange}
                                    size={componentSize}
                                >
                                    <div className="col-md-12 row">
                                        <div className="col-md-8">
                                            <Form.Item hasFeedback label="StreamList" name="streamlist" value={this.state.isEditForm ? this.state.streamlist : ''}
                                                rules={[
                                                    { required: true, message: "Please input streamlist!" },
                                                    { whitespace: false, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item hasFeedback label="Select Plan" name="selected_plan" 
                                                rules={[
                                                    { required: true, message: "Please choose plan!" },
                                                    
                                                ]}>
                                                <Select defaultValue="Weekly" name="selected_plan">
                                                    <Option value="Weekly">Weekly</Option>
                                                    <Option value="Quertly">Quertly</Option>
                                                    <Option value="Monthly">Monthly</Option>
                                                    <Option value="halfyearly">Half Yearly</Option>
                                                    <Option value="yearly">Yearly</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item hasFeedback label="Activation Code" readOnly={true} extra="Click button to generate activation code."  rules={[
                                                    { required: true, message: "Please input activation!" }
                                                ]}>
                                                <Row gutter={8}>
                                                <Col span={12}>
                                                    <Form.Item hasFeedback
                                                    rules={[
                                                    { required: true, message: "Please choose plan!" },
                                                    
                                                    ]}
                                                    name="activation_code"
                                                    value={activationCode}
                                                    noStyle
                                                    
                                                    rules={[{ required: true, message: 'Please input the activation code you got!' }]}
                                                    >
                                                    <Input readOnly />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Button htmlType="button" onClick={this.generateToken}>Get Code</Button>
                                                </Col>
                                                </Row>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"
                                    >Submit</Button>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    };
}