import React, { useState, Component } from 'react';
import { Form, Input, Button, Select, Upload, message, DatePicker, Checkbox} from 'antd';
import { LoadingOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import ErrorComponent from '../ErrorComponent';
import { Link } from 'react-router-dom';
let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
export default class AddClient extends Component {
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
            appList:[
                {
                    id: "",
                    app_name:""
                }
            ]
        }
        this.avatarUpload = this.avatarUpload.bind(this);
        this.getApplicationlList = this.getApplicationlList.bind(this);
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
        this.getApplicationlList();
    }
    
    getApplicationlList = () => {
        let formData = {};
        formData.module = 'MASA';
        formData.channelId = 'MASAPLAYER';
        formData.requestId = 'IBOPLAYERAPP2';
        formData.requestData = {
            isApplication: true,
            createdBy: localStorageData.id
        }
        apiService
        .appList(formData)
        .then((response) => {
            if (typeof response.status != "undefined" && response.status) {
                this.setState({
                    appList: response.data.ApplicationList,
                });
            }
        })
    }

    onRoleClick() {
        apiService
            .roleList(0)
            .then((response) => {
                if (typeof response.success != "undefined" && response.success) {
                    this.setState({
                        rolesData: response.data,
                    });
                }
            })
    }

    avatarUpload = () => {
        //return true;
        this.setState({
            loading: false,
            imageUrl: this.state.imageUrl
        });
    }

    idCardUpload = () => {
        this.setState({
            loading: false,
            userIdCard: this.state.userIdCard
        });
    }


    onFinish = (values) => {
        
        let formInputData = JSON.stringify(values);
        let formInputDataL = JSON.parse(formInputData);
        
        values.created_by = localStorageData.id;
        values.group_id = '2';
        values.module = 'MASA';
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            channelName:formInputDataL.channelName,
            clientId:formInputDataL.clientId,
            secretKey: formInputDataL.secretKey,
            creditPoint:formInputDataL.creditPoint,
            email:formInputDataL.email,
            creatorId:localStorageData.id
        };

        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {

            apiService.addClient(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'Client added successfully',
                        userIdCard: false,
                        imageUrl: false
                    });
                    this.onReset();
                } else {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: addUserResponse.msg ? addUserResponse.msg :'Client already exist or invalid inputs!',
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

    onAppChangeCheck = () => {

    }

    createUIForApplist(){
        return this.state.appList.map((el, i) => (
            <Col span={8}>
                <Checkbox value={el.id}>{el.app_name}</Checkbox>
            </Col>
        ))
     }
    
    render() {
        const { componentSize } = this.state;

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
                                <i className="fa fa-align-justify"></i> Add Client{" "}
                                <small className="text-muted">Form</small>
                                <Link to="/clients" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Client List</Link>
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
                                            <Form.Item hasFeedback label="ChannelName" name="channelName" 
                                                rules={[
                                                    { required: true, message: "Please input channel name" }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            
                                            <Form.Item hasFeedback label="Client Id" name="clientId" 
                                                rules={[

                                                    { required: true, message: "Please input ClientId!", whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item hasFeedback label="SecretKey" name="secretKey" 
                                                rules={[

                                                    { required: true, message: "Please input secret!", whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            
											<Form.Item hasFeedback label="Add Credit" name="creditPoint"
                                                rules={[
                                                    
                                                    { whitespace: true, message: "Should not contain whitespace." },
                                                    () => ({
                                                        validator(_, value) {
                                                          if (!value) {
                                                            return Promise.reject();
                                                          }

                                                          if (isNaN(value)) {
                                                            return Promise.reject("Credit Point has to be a number.");
                                                          }
                                                          if (value.length < 1) {
                                                            return Promise.reject("Credit Point can't be less than 1 digits");
                                                          }
                                                          if(localStorageData.roleId == "2" && value >= localStorageData.resCreditPoint){
                                                            return Promise.reject("Credit Point should be less than your credit point!");
                                                          }
                                                          if (value.length > 99) {
                                                            return Promise.reject("Credit Point can't be more than 99 digits");
                                                          }
                                                          return Promise.resolve();
                                                        },
                                                      }),
                                                ]}>
                                                <Input />
											</Form.Item>
                                            <Form.Item hasFeedback label="Email" name="email" 
                                                rules={[
                                                    {type: 'email',message: 'The input is not valid E-mail!'},
                                                    { required: true, message: "Please input Email!"},
                                                    { whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
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