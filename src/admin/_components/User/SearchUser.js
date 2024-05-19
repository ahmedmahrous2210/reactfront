import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import { Link } from 'react-router-dom';
import Users from './Users';
const { Search } = Input;
const { Option } = Select;
export default class SearchUser extends Component {
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
            activationCode: '',
            searchUserList: [],
            module:""
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
        var result = '';
        //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var characters = '0123456789';
        //var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                characters.length));
        }
        if (result !== '') {
            this.formRef.current.setFieldsValue({
                //activation_code:result.toUpperCase()
                activation_code: result
            });
            this.setState({
                activationCode: result
            });
        }

    }

    onFinish = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        if (values.search_key == 0 || values.search_key == '' || values.search_key.length < 3) {
            this.setState({
                loader: false,
                showAlert: true,
                alertType: 'danger',
                alertBody: 'Please input valid mac id minimum of 3 digit!',
                userIdCard: false,
                imageUrl: false
            });
            return;
        }
        if (this.state.module == '' ) {
            this.setState({
                loader: false,
                showAlert: true,
                alertType: 'danger',
                alertBody: 'Please Select Module!',
                userIdCard: false,
                imageUrl: false
            });
            return;
        }
        values.module = this.state.module;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            macAddress: values.search_key.toLowerCase()
        };
        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {

            apiService.searchUser(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status && addUserResponse.data.IBOMasaUser.length > 0) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'Users found for Mac address - ' + values.search_key + ' !',
                        userIdCard: false,
                        imageUrl: false,
                        searchUserList: addUserResponse.data.IBOMasaUser
                    });
                    this.onReset();
                } else {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'No User found with given mac value or invalid inputs!',
                    });
                }
            }).catch(error => {
                this.setState({
                    loader: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertBody: 'Something went wrong!',
                });
            });
        });
    }

    selectModule = (value) => {
        this.setState({
            module: value
        });
        console.log(value ,"====value====value");
    }
    render() {
        const { componentSize } = this.state;
        const onFormLayoutChange = ({ size }) => {
            this.setState({
                setComponentSize: size,
                componentSize: size
            });
        };
        const onSearch = value => this.onFinish({ "search_key": value, "module": this.state.module});
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-search"></i> Search User{" "}
                                <small className="text-muted">Form</small>
                                <Link to="/users" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Users List</Link>
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
                                    <Form.Item hasFeedback label="Select Module" name="module"
                                        rules={[
                                            { required: true, message: "Please Select Module!" },

                                        ]}>
                                        <Select name="module" onChange={this.selectModule}>
                                            <Option value="">Select Module Type</Option>
                                            {/* <Option value="MASA">MASA</Option> */}
                                            <Option value="VIRGINIA">VIRGINIA</Option>
                                            <Option value="IBOAPP">IBOAPP</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item hasFeedback label="Name" name="search_key" rules={[
                                        {
                                            required: true,
                                            message: 'Please input mac id'
                                        }
                                    ]}>
                                        <Search
                                            placeholder="MAC - xx:xx:xx:xx:xx"
                                            allowClear
                                            htmlType="submit"
                                            enterButton="Search"
                                            size="large"
                                            onSearch={onSearch}
                                        />
                                    </Form.Item>
                                </Form>
                                {this.state.searchUserList.length > 0 ?
                                    <Users userList={this.state.searchUserList} />
                                    : null}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    };
}