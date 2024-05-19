import React, { Component } from 'react';
import { Form, Input,Button, Modal, } from 'antd';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import Users from '../User/Users';
// import Users from '../User/Users';
// import AddUserForm from '../User/AddUserForm';
const { Search } = Input;
export default class SearchMacLocal extends Component {
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
            editId: '',
            rolesData: [],
            activationCode: '',
            searchUserList: [],
            module:"",
            addNewUser: false,
            showAddNewUserBtn:false,
            modalVisible:false,
            confirmLoading:false,
            modalBodyContent:'',
            isTrailVal:'2',
            switchSelectedModule:'',
            userList:[]
        }
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
        
        
        values.module = this.state.module;
        values.isTrail = this.state.isTrailVal;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            macAddress: values.search_key.toLowerCase()
        };
        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        this.setState({ loader: true, showAlert: false,alertBody:'', searchUserList:[], addNewUser: false,
        showAddNewUserBtn:false }, () => {

            apiService.searchMac(formData).then((searchMacData) => {
               //console.log("searchMacData", searchMacData);
                if (typeof searchMacData.status != 'undefined' && searchMacData.status && searchMacData.data.Users.length > 0) {
                    this.setState({
                        loader: false,
                        userList:searchMacData.data.Users
                    });
                }else{
                    Modal.error({
                        title: 'Not Found',
                        content: (
                          <div>
                            <p>No details found for {values.search_key}, please check your mac value.</p>
                          </div>
                        ),
                        onOk() {},
                    });
                    this.setState({
                        loader: false
                    });
                }
            }).catch(error => {
                console.log(error);
                Modal.error({
                    title: 'Account Search Details! ',
                    content: (
                      <div>
                        <p>Something went wrong!</p>
                      </div>
                    ),
                    onOk() {},
                });
                this.setState({
                    loader: false
                });
            });
        });
    }

    makeMacAddressFormat = (e, fieldName, formRef) => {
        let value = e.target.value;
        var max_count=value.length>=16 ? 16 : value.length;
        for(let i=2; i<max_count; i+=3) {
            if (value[i] !== ':')
            value = [value.slice(0,i),':',value.slice(i)].join('');
        }
        formRef.current.setFieldsValue({[fieldName]:value});
    }

    render() {
        const { componentSize } = this.state;
        const onFormLayoutChange = ({ size }) => {
            this.setState({
                setComponentSize: size,
                componentSize: size
            });
        };
        const onSearch = value => this.onFinish({ "search_key": value});
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-search"></i> Mac Check{" "}
                                <small className="text-muted">Form</small>
                                
                            </CardHeader>
                            <CardBody>
                                {this.state.showAlert ? <AlertMsgComponent alertBody={this.state.alertBody} alertType={this.state.alertType} /> : ""}
                                {this.state.showAddNewUserBtn ? <div className='text-center'><Button type="primary"
                                style={{"padding": "0.34rem 2.0rem"}} className="btn btn-success" onClick={this.addNewUser}>Add New User</Button></div>: null}
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
                                    autoComplete="off"
                                >
                                               
                                    <Form.Item hasFeedback label="Mac address " name="check_search_key" rules={[
                                        {
                                            required: true,
                                            message: 'Please input mac id'
                                        },
                                        () => ({
                                            validator(_, value) {
                                                if (!value) {
                                                    return Promise.reject();
                                                }
                                                //if (!validMacRegexp.test(value)) {
                                                //    return Promise.reject("Please input valid mac address!");
                                                //}
                                                
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}>
                                        <Search
                                            placeholder="Mac Id - XX:XX:XX:XX:XX"
                                            allowClear
                                            htmlType="submit"
                                            enterButton="Check"
                                            size="large"
                                            onSearch={onSearch}
                                            onChange={(e) => this.makeMacAddressFormat(e, 'check_search_key', this.formRef)}
                                        />
                                    </Form.Item>
                                    
                                </Form>
                                
                            </CardBody>
                        </Card>
                        
                    </Col>
                    
                </Row>
                 <>
                 {this.state.userList.length  > 0 ? <Users userList={this.state.userList}/>: null}
                 </>                   
            </div>
        );
    };
}