import React, { Component } from 'react';
import Reaptcha from 'reaptcha';
import { Form, Input, Button, Select } from 'antd';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import { Link } from 'react-router-dom';
const { Option } = Select;
const newResCredVal = (isTrailVal) => {
    if (typeof isTrailVal == 'undefined' || isTrailVal === null || isTrailVal == '') {
        return "Not uploaded";
    } else if (isTrailVal == '1') {
        return 0;
    } else if (isTrailVal == '2') {
        return 1;
    } else if (isTrailVal == '3') {
        return 2;
    }
}
export default class AddUserForm extends Component {
    constructor(props) {
        super(props);
        this.captcha = null;
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
            editId: null,
            rolesData: [],
            moduleFrom: '',
            verified: false,
            playlist:[
                {
                    playListName:'',
                    playListUrl: ''
                }
            ]
        }
        this.avatarUpload = this.avatarUpload.bind(this);
        this.generateToken = this.generateToken.bind(this);
    }

    formRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };

    generateToken() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        //var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                characters.length));
        }
        if (result !== '') {

            this.formRef.current.setFieldsValue({
                activation_code: result.toUpperCase()
                //activation_code:result
            });
        }


    }

    addClickToAddMoreStreamlist(){
        this.setState(prevState => ({ 
            playlist: [...prevState.playlist, { playListName: "", playListUrl: "" }]
        }))
    }

    handlePlayListChange(i, e) {
        //console.log(i,"i-----------");
        const { name, value } = e.target;
        var playlist = [...this.state.playlist];
        playlist[i] = {...playlist[i], [name]: value};
        //playlist[i][e.target.name] = e.target.value;
        //console.log("playlist", playlist[i]);
        this.setState({ playlist });
     }
     
     removeClick(i){
        var playlist = [...this.state.playlist];
        playlist.splice(i, 1);
        this.setState({ playlist });
     }

    createUIForStreamList(){
        return this.state.playlist.map((el, i) => (
          

            <Form.Item label="Stream Url" style={{ marginBottom: 0 }} key={i}  >
                <Form.Item
                    
                    rule={[
                        { required: true, message: "Please Add Name!" },
                    ]} 
                    style={{ display: 'inline-block', width: 'calc(30% - 8px)' }}>
                    <Input
                        placeholder="Stream Name"
                        name="playListName"
                        value={el.playListName ||''} 
                        onChange={this.handlePlayListChange.bind(this, i)}/>
                </Form.Item>
                <Form.Item
                    
                    rule={[
                        { required: true, message: "Please Add Url!" },
                    ]} 
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 4px' }}>
                    <Input 
                        placeholder="Stream Url"
                        name="playListUrl"
                        value={el.playListUrl ||''}
                         onChange={this.handlePlayListChange.bind(this, i)} />
                </Form.Item>
                <input type='button' className='btn btn-sm btn-danger' style={{"margin":"0px"}} value='remove' onClick={this.removeClick.bind(this, i)}/>
            </Form.Item>        
        ))
     }
    onLoad = () => {
        this.setState({
            captchaReady: true
        });
    };

    onVerify = recaptchaResponse => {
        this.setState({
            verified: true
        });
    };
    componentDidMount(props) {
        console.log(typeof(this.state.moduleFrom), "this.state.moduleFrom");
        if (this.state.editId !== null) {
            this.setState({
                isEditForm: true
            });
        }
        if (this.props.moduleFrom !== '') {
            this.setState({
                moduleFrom: this.props.moduleFrom
            });
            this.formRef.current.setFieldsValue({
                isTrail: '2'
            });
        } else {
            this.formRef.current.setFieldsValue({
                isTrail: '1'
            });
        }

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
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        values.created_by = localStorageData.id;
        values.group_id = '3';
        values.module = values.module;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            appType: values.appType,
            macAddress: values.macAddress.toLowerCase(),
            expiryDate: values.expiryDate,
            isTrail: values.isTrail,
            email: values.email,
            createdBy: localStorageData.id,
            playlist: this.state.playlist
            // [
            //     {
            //         playListName: values.streamlist_url_name,
            //         playListUrl: values.streamlist_url
            //     },
            //     {
            //         playListName: values.streamlist_url_name2,
            //         playListUrl: values.streamlist_url2
            //     },
            //     {
            //         playListName: values.streamlist_url_name3,
            //         playListUrl: values.streamlist_url3
            //     },
            //     {
            //         playListName: values.streamlist_url_name4,
            //         playListUrl: values.streamlist_url4
            //     },
            //     {
            //         playListName: values.streamlist_url_name5,
            //         playListUrl: values.streamlist_url5
            //     },
            // ]
        };
        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {

            apiService.addUser(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    this.formRef.current.setFieldsValue({
                        isTrail: values.isTrail,
                        appType: values.appType,
                    });
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'User added successfully',
                        userIdCard: false,
                        imageUrl: false
                    });
                    if (localStorageData.roleId === 2) {
                        let dedcCredit = (values.module == 'MASA') ? values.isTrail : (values.isTrail == 1) ? 0 : (values.isTrail == 2) ? 1 : 3;
                        let resCreditPoint = (localStorageData.resCreditPoint - newResCredVal(dedcCredit));
                        //update reseller credit point with all specific session data
                        localStorage.setItem('userData_' + localStorage.getItem('token'), JSON.stringify({
                            'id': localStorageData.id,
                            'email': localStorageData.email,
                            'name': localStorageData.firstname,
                            'username': localStorageData.username,
                            'roleId': localStorageData.roleId,
                            'resCreditPoint': resCreditPoint,
                            'isVerifiedImage': true,
                            'userImage': "kljfkdfjk",
                            'userIdCard': "kdjfhkg",
                            'imageApproveComment': "kljg",
                            'roleName': localStorageData.roleId + "_" + localStorageData.id
                        }));
                    }
                    this.onReset();
                    setTimeout(() => { window.location.reload() }, 2000);

                } else {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'User already exist or invalid inputs!',
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
                                <i className="fa fa-align-justify"></i> Add User{" "}
                                <small className="text-muted">Form</small>
                                {this.state.moduleFrom !== '' ? null :
                                    <Link to="/users" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Users List</Link>}
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
                                    autoComplete="off"
                                >
                                    <div className="col-md-12 row">
                                        <div className="col-md-8">

                                            <Form.Item hasFeedback label="Select Module" name="module"
                                                rules={[
                                                    { required: true, message: "Please Select Module!" },

                                                ]}>
                                                <Select name="module">
                                                    <Option value="">Select App Type</Option>

                                                    {/* <Option value="MASA">MASA</Option> */}

                                                    <Option value="VIRGINIA">VIRGINIA</Option>
                                                    <Option value="IBOAPP">IBOAPP</Option>
                                                </Select>
                                            </Form.Item>
                                            {/* <Form.Item hasFeedback label="Select App Type" name="appType" 
                                                >
                                                <Select name="appType">
                                                    <Option value="">Select App Type</Option>
                                                    <Option value="android">Android</Option>
                                                    <Option value="lg">LG</Option>
                                                    <Option value="samsung">Samsung</Option>
                                                </Select>
                                            </Form.Item> */}

                                            <Form.Item hasFeedback label="Mac Address" name="macAddress" value={this.state.isEditForm ? this.state.macAddress : ''}
                                                rules={[
                                                    { required: true, message: "Please input mac address!" },
                                                    { whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item hasFeedback label="Select Plan" name="isTrail"
                                            >
                                                <Select defaultValue="1" name="isTrail">
                                                    {this.state.moduleFrom !== '' ? null :
                                                        <Option value="1">Weekly</Option>
                                                    }
                                                    <Option value="2">Yearly</Option>
                                                    <Option value="3">Lifetime</Option>
                                                </Select>
                                            </Form.Item>
                                            {/* <Form.Item hasFeedback label="Email" name="email" value={this.state.isEditForm ? this.state.email : ''}
                                                rules={[
                                                    { type: 'email',message: 'The input is not valid Email!'},
                                                   
                                                    { whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <Input />
                                            </Form.Item> */}
                                            {/* <Form.Item hasFeedback label="Expiry Date" size="58" name="expiryDate" value={this.state.isEditForm ? this.state.expiryDate : ''} rules={[{ required: true, message: "Please input Expiry Date!" }]} >
                                                <DatePicker format="YYYY-MM-DD" size="58"/>
                                            </Form.Item>
                                             */}
                                                
                                            
                                            {this.state.moduleFrom !== '' ? null : <div>
                                            {this.createUIForStreamList()}   
                                             <Form.Item hasFeedback label=" "
                                            >
                                               <Input type='button' value='Add More Streamlist ' onClick={this.addClickToAddMoreStreamlist.bind(this)}/>
                                            </Form.Item>  
                                                {/* <Form.Item label="Stream Url" style={{ marginBottom: 0 }}  >
                                                    <Form.Item
                                                        name="streamlist_url_name"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                                                        <Input name='streamlist_url_name'
                                                            placeholder="Stream Url Name"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="streamlist_url"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
                                                        <Input name='streamlist_url'
                                                            placeholder="Stream Url"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                </Form.Item>

                                                <Form.Item label="Stream Url 2" style={{ marginBottom: 0 }}>
                                                    <Form.Item
                                                        name="streamlist_url_name2"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                                                        <Input name='streamlist_url_name2'
                                                            placeholder="Stream Url Name2"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="streamlist_url2"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                                    >
                                                        <Input name='streamlist_url2'
                                                            placeholder="Stream Url2"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item label="Stream Url 3" style={{ marginBottom: 0 }}>
                                                    <Form.Item
                                                        name="streamlist_url_name3"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                                                        <Input name='streamlist_url_name3'
                                                            placeholder="Stream Url Name3"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="streamlist_url3"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                                    >
                                                        <Input name='streamlist_url3'
                                                            placeholder="Stream Url3"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item label="Stream Url 4" style={{ marginBottom: 0 }}>
                                                    <Form.Item
                                                        name="streamlist_url_name4"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                                                        <Input name='streamlist_url_name4'
                                                            placeholder="Stream Url Name4"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="streamlist_url3"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                                    >
                                                        <Input name='streamlist_url4'
                                                            placeholder="Stream Url4"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item label="Stream Url 5" style={{ marginBottom: 0 }}>
                                                    <Form.Item
                                                        name="streamlist_url_name5"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                                                        <Input name='streamlist_url_name5'
                                                            placeholder="Stream Url Name5"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="streamlist_url5"

                                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                                    >
                                                        <Input name='streamlist_url5'
                                                            placeholder="Stream Url5"
                                                            onChange={this.handleInputOnChange} />
                                                    </Form.Item>
                                                </Form.Item> */}
                                            </div>}
                                            <div className="row">
                                                <div className='col-md-3'></div>
                                                <div className='col-md-9'>
                                                    <Reaptcha
                                                        ref={e => (this.captcha = e)}
                                                        sitekey="6Lf-V-kdAAAAAI97IVi3fA8QVTA_jhr2KPth4G_5"
                                                        onVerify={this.onVerify}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"

                                        disabled={!this.state.verified}
                                    >Activate</Button>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    };
}