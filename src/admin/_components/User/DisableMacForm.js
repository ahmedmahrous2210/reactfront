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
export default class DisableMacForm extends Component {
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

            apiService.disableMac(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status && addUserResponse.data.IBOMasaUser.length > 0) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'Mac Device found for Mac address - ' + values.search_key + ' !',
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
                        alertBody: addUserResponse.msg ? addUserResponse.msg : 'No Mac device found with given mac value or invalid inputs!',
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
                                <i className="fa fa-search"></i> Disable Mac{" "}
                                <small className="text-muted">Form</small>
                                
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
                                            {/* <Option value="MASA">MASA</Option>  */}
                                            <Option value="VIRGINIA"><img src={'virginiatv.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="virginiatv"/> VIRGINIA</Option>
                                            <Option value="IBOAPP"><img src={'ibo_app.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="ibo_app"/> IBOAPP</Option>
                                            <Option value="ABEPLAYERTV"><img src={'abeplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="abeplayer"/> ABEPlayer</Option>
                                            <Option value="BOBPLAYER"><img src={'bobplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="bobplayer"/> BOBPlayer</Option>
                                            <Option value="MACPLAYER"><img src={'macplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="macplayer"/> MacPlayer</Option>
                                            <Option value="HUSHPLAY"><img src={'hushplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="hushplayer"/> HushPlay</Option>
                                            <Option value="KTNPLAYER"><img src={'ktnplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="ktnplayer"/> KtnPlayer</Option>
                                            <Option value="ALLPLAYER"><img src={'allplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="allplayer"/> AllPlayer</Option>
                                            <Option value="FAMILYPLAYER"><img src={'familyplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="familyplayer"/> FamilyPlayer</Option>
                                            <Option value="KING4KPLAYER"><img src={'king4kplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="king4kplayer"/> King4KPlayer</Option>
                                            <Option value="IBOSSPLAYER"><img src={'ibossplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="ibossplayer"/> IBOSSPlayer</Option>
                                            <Option value="IBOXXPLAYER"><img src={'iboxxplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail" alt="iboxxplayer"/> IBOXXPlayer</Option>
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
                                            enterButton="Search and Disable"
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