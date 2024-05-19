import React, { Component } from 'react';
import { Form, Input, Select,Button, Modal, } from 'antd';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import dateFormat, { masks } from "dateformat";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
// import Users from '../User/Users';
// import AddUserForm from '../User/AddUserForm';
const { Search } = Input;
const { Option } = Select;

// const newResCredVal = (isTrailVal) => {
//     if(typeof isTrailVal == 'undefined' || isTrailVal === null || isTrailVal ==''){
//       return "Not uploaded";
//     }else if(isTrailVal == '1'){
//       return 0;
//     }else if(isTrailVal == '2'){
//       return 1;
//     }else if(isTrailVal == '3'){
//       return 2;
//     }
//   }

var validMacRegexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
export default class CheckAndShowMacDetail extends Component {
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
            switchSelectedModule:''
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
        if (this.state.isTrailVal == '' ) {
            this.setState({
                loader: false,
                showAlert: true,
                alertType: 'danger',
                alertBody: 'Please Select Package!',
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

            apiService.searchUser(formData).then((addUserResponse) => {
                console.log(addUserResponse);
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status && addUserResponse.data.IBOMasaUser.length > 0) {

                    if(this.state.module === 'BAYIPTV'){
                        Modal.info({
                            title: 'Account Information! '+this.state.module,
                            content: (
                              <div>
                                <p>{addUserResponse.msg}</p>
                              </div>
                            ),
                            onOk() {},
                        });
                        
                        this.setState({
                            loader: false
                        });
                        return;
                    }

                    var todaysDate = new Date();
                    var d2 = new Date(addUserResponse.data.IBOMasaUser[0].expire_date);
                    var activeUser = todaysDate.getTime() <= d2.getTime();
                    var diffInExp =  d2.getTime() - todaysDate.getTime();
                    var Difference_In_Days = diffInExp / (1000 * 3600 * 24);
                   
                    var modyStr = 'Mac already activated until '+ dateFormat(addUserResponse.data.IBOMasaUser[0].expire_date, "mmmm dS, yyyy");
                    var dangerBack = 'success';
                    let IsTrailVal = addUserResponse.data.IBOMasaUser[0].is_trial;
                    var notActiveTrail = true;
                    var trailText = "Active";
            
                    if(this.state.module === 'MASA' && IsTrailVal === 0){
                        notActiveTrail = false;
                        trailText = 'Trail';

                        
                    }else if(this.state.module === 'VIRGINIA' && IsTrailVal === 1){
                        notActiveTrail = false;
                        trailText = 'Trail';
                    }
                    else if(this.state.module === 'IBOAPP' && IsTrailVal === 1){
                        notActiveTrail = false;
                        trailText = 'Trail';
                    }
                   
                    if(activeUser){
                        let expreDate = addUserResponse.data.IBOMasaUser[0].expire_date ?? addUserResponse.data.IBOMasaUser[0].expiry_date; 
                        Modal.info({
                            title: 'Account Information! '+this.state.module,
                            content: <div>
                                <p><b>Mac: {addUserResponse.data.IBOMasaUser[0].mac_address}</b></p>
                                <p><b>Expire Date: { dateFormat(expreDate, "mmmm dS, yyyy")}</b></p>
                                <p><b>Status: {trailText}</b></p>
                            </div>,
                            onOk() {},
                        });
                        this.setState({
                            loader: false
                        });
                        return;
                    }else if(false === activeUser || false === notActiveTrail){
                       return;
                    }                    
                    this.setState({
                        loader: false
                    });
                } else {
                    if (typeof addUserResponse.status != 'undefined' && addUserResponse.status === false){
                        
                        Modal.warning({
                            title: 'Account Information! '+this.state.module,
                            content: (
                                <div>
                                {addUserResponse.msg}
                                </div>
                            ),
                            onOk() {},
                        });
                    
                        this.setState({
                            loader: false
                        });
                    }
                    
                }
            }).catch(error => {
                console.log(error);
                Modal.error({
                    title: 'Account Activation! '+this.state.module,
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

    addNewUser = () => {
        this.setState({
            addNewUser:true
        });
    }

    selectModule = (value) => {
        this.setState({
            module: value
        });
    }

    selectIsTrail = (value) => {
        this.setState({
            isTrailVal: value
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
        const onSearch = value => this.onFinish({ "search_key": value, "module": this.state.module});
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
                                    <Form.Item hasFeedback label="Select Module" name="module"
                                        rules={[
                                            { required: true, message: "Please Select Module!" },

                                        ]}>
                                        <Select name="module" onChange={this.selectModule}>
                                            <Option value="">Select Module Type</Option>
                                            {/* <Option value="MASA">MASA</Option> */}
                                            <Option value="VIRGINIA"><img src={'virginiatv.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> VIRGINIA</Option>
                                            <Option value="IBOAPP"><img src={'ibo_app.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> IBOAPP</Option>
                                            <Option value="ABEPLAYERTV"><img src={'abeplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> ABEPlayer</Option>
                                            <Option value="BOBPLAYER"><img src={'bobplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> BOBPlayer</Option>
                                            <Option value="MACPLAYER"><img src={'macplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> MacPlayer</Option>
                                            <Option value="HUSHPLAY"><img src={'hushplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> HushPlay</Option>
                                            <Option value="KTNPLAYER"><img src={'ktnplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> KtnPlayer</Option>
                                            <Option value="ALLPLAYER"><img src={'allplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> AllPlayer</Option>
                                            <Option value="FAMILYPLAYER"><img src={'familyplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> FamilyPlayer</Option>
                                            <Option value="KING4KPLAYER"><img src={'king4kplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> King4KPlayer</Option>
                                            <Option value="IBOSSPLAYER"><img src={'ibossplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> IBOSSPlayer</Option>
                                            <Option value="IBOXXPLAYER"><img src={'iboxxplayer.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> IBOXXPlayer</Option>
                                            <Option value="BOBPROTV"><img src={'bobprotv.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> BOBProTv</Option>
                                            <Option value="IBOSTB"><img src={'IBOSTB.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> IBOStb</Option>
                                            <Option value="IBOSOL"><img src={'IBOSOL.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> IBOSOL</Option>
                                            <Option value="DUPLEX"><img src={'DUPLEX.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> DuplexPlayer</Option>
                                            <Option value="FLIXNET"><img src={'FLIXNET.png'} style={{maxWidth:"50px"}} className="img-responsive img-thumbnail"/> FlixNetPlayer</Option>
                                        </Select>
                                    </Form.Item>
                                    
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

            </div>
        );
    };
}