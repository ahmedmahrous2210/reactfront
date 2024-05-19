import React, { Component } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
// import Reaptcha from 'reaptcha';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
// import { Link } from 'react-router-dom';
// import Users from '../User/Users';
// import AddUserForm from '../User/AddUserForm';
const { Search } = Input;
const { Option } = Select;
var validMacRegexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
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
            activationCode: '',
            searchUserList: [],
            module: "",
            resetModule: "",
            addNewUser: false,
            showAddNewUserBtn: false,
            showPlaylistForm: false,
            verified: false,
            playlist: [
                {
                    name: '',
                    url: ''
                }
            ],
            macAddress: ''
        }
        //this.generateToken = this.generateToken.bind(this);
    }

    formRef = React.createRef();
    addPlaylistFormRef = React.createRef();
    //addStreamFormRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };

    makeMacAddressFormat = (e, fieldName, formRef) => {
        let value = e.target.value;
        
        var max_count=value.length>=16 ? 16 : value.length;
        for(let i=2; i<max_count; i+=3) {
            if (value[i] !== ':')
            value = [value.slice(0,i),':',value.slice(i)].join('');
        }
        formRef.current.setFieldsValue({[fieldName]:value});
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

    addClickToAddMoreStreamlist() {
        this.setState(prevState => ({
            playlist: [...prevState.playlist, { playListName: "", playListUrl: "" }]
        }))
    }

    handlePlayListChange(i, e) {
        const { name, value } = e.target;
        var playlist = [...this.state.playlist];
        playlist[i] = { ...playlist[i], [name]: value };
        this.setState({ playlist });
    }

    removeClick(i) {
        var playlist = [...this.state.playlist];
        playlist.splice(i, 1);
        this.setState({ playlist });
    }

    createUIForStreamList() {
        return this.state.playlist.map((el, i) => (
            <Form.Item label="Stream Url" style={{ marginBottom: 0 }} key={i}  >
                <Form.Item

                    rule={[
                        { required: true, message: "Please Add Name!" },
                    ]}
                    style={{ display: 'inline-block', width: 'calc(30% - 8px)' }}>
                    <Input
                        placeholder="Stream Name"
                        name="name"
                        value={el.name || ''}
                        onChange={this.handlePlayListChange.bind(this, i)} />
                </Form.Item>
                <Form.Item

                    rule={[
                        { required: true, message: "Please Add Url!" },
                    ]}
                    style={{ display: 'inline-block', width: 'calc(31% - 8px)', margin: '0 1px' }}>
                    <Input
                        placeholder="Stream Url"
                        name="url"
                        value={el.url || ''}
                        onChange={this.handlePlayListChange.bind(this, i)} />
                </Form.Item>
                <input type='button' className='btn btn-sm btn-danger' style={{ "margin": "0px" }} value='remove' onClick={this.removeClick.bind(this, i)} />
            </Form.Item>
        ))
    }

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
        if (this.state.module == '') {
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
        this.setState({
            loader: true, showAlert: false, alertBody: '', searchUserList: [], addNewUser: false,
            showAddNewUserBtn: false
        }, () => {

            apiService.searchUser(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status && addUserResponse.data.IBOMasaUser.length > 0) {
                    var todaysDate = new Date();
                    var d2 = new Date(addUserResponse.data.IBOMasaUser[0].expire_date);
                    var activeUser = todaysDate.getTime() <= d2.getTime();
                    var modyStr = 'User found for Mac address - ' + values.search_key + '!';
                    var dangerBack = 'success';
                    var showPlaylistForm = true;
                    let IsTrailVal = addUserResponse.data.IBOMasaUser[0].is_trial;
                    var notActiveTrail = true;
                    if (this.state.module === 'MASA' && IsTrailVal === 0) {
                        notActiveTrail = false;
                    } else if (this.state.module === 'VIRGINIA' && IsTrailVal === 1) {
                        notActiveTrail = false;
                    }
                    else if (this.state.module === 'IBOAPP' && IsTrailVal === 1) {
                        notActiveTrail = false;
                    }

                    if (false === activeUser || false === notActiveTrail) {
                        modyStr = 'User found but status is expired! If you wish to add playlist, first activate user to add playlist!';
                        dangerBack = 'danger';
                        showPlaylistForm = false;

                    }
                    if (addUserResponse.data.IBOMasaUser[0].playlist_url.length > 0) {
                        // this.setState({
                        //     playlist:addUserResponse.data.IBOMasaUser[0].playlist_url
                        // });
                    }
                    this.setState({
                        macAddress: addUserResponse.data.IBOMasaUser[0].mac_address,
                        playlist: addUserResponse.data.IBOMasaUser[0].playlist_url
                    });
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: dangerBack,
                        alertBody: modyStr,
                        userIdCard: false,
                        imageUrl: false,
                        showPlaylistForm: showPlaylistForm,
                        searchUserList: addUserResponse.data.IBOMasaUser,
                        macAddress: addUserResponse.data.IBOMasaUser[0].mac_address
                    });
                    this.onReset();
                } else {
                    var mbodystr = 'No device found in system with provided MAC Address!';
                    if (typeof addUserResponse.statusCode != 'undefined' && addUserResponse.statusCode === 'C10012') {
                        this.setState({
                            showAddNewUserBtn: true
                        });
                        mbodystr = 'No device found in system with provided MAC Address! If you wish to add this mac address, Please click to add user!';
                    }
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: mbodystr,
                    });
                }
            }).catch(error => {
                console.log(error, "error");
                this.setState({
                    loader: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertBody: 'Something went wrong!',
                });
            });
        });
    }

    onFinishAddPlayList = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        values.module = this.state.module;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            macAddress: this.state.macAddress.toLowerCase(),
            createdBy: localStorageData.id,
            playlist: this.state.playlist
        };
        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        this.setState({
            loader: true, showAlert: false, alertBody: '', searchUserList: [], addNewUser: false,
            showAddNewUserBtn: false
        }, () => {

            apiService.addStreamListCommon(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'Streamlist added succesfully.',
                        userIdCard: false,
                        imageUrl: false
                    });
                    this.onReset();
                } else {

                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Failed to add streamlist!',
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




    resetPlaylist = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        if (values.mac_address == 0 || values.mac_address == '' || values.mac_address.length < 3) {
            Modal.error({
                title: 'Reset Playlist',
                content: (
                    <div>
                        <p>Please input valid mac id minimum of 3 digit!</p>
                    </div>
                ),
                onOk() { },
            });
            this.setState({
                loader: false
            });
            return;
        }
        if (this.state.resetModule == '') {
            Modal.error({
                title: 'Reset Playlist',
                content: (
                    <div>
                        <p>Please Select Module!</p>
                    </div>
                ),
                onOk() { },
            });
            this.setState({
                loader: false
            });

            return;
        }
        values.module = this.state.resetModule;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            macAddress: values.mac_address.toLowerCase(),
            createdBy: localStorageData.id
        };
        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        this.setState({ loader: true, showAlert: false, alertBody: '' }, () => {

            apiService.resetPlayist(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    Modal.success({
                        title: 'Reset Playlist',
                        content: (
                            <div>
                                <p>Playlist reset succefully!</p>
                            </div>
                        ),
                        onOk() { },
                    });
                    this.setState({
                        loader: false
                    });
                    // this.setState({
                    //     loader: false,
                    //     showAlert: true,
                    //     alertType: 'success',
                    //     alertBody: 'Playlist reset succefully!',
                    //     userIdCard: false,
                    //     imageUrl: false
                    // });
                    this.onReset();
                } else {
                    let msgStr = 'Playlist reset failed!';
                    if (typeof addUserResponse.statusCode != 'undefined' && addUserResponse.statusCode === 'C40014') {
                        msgStr = addUserResponse.msg ? addUserResponse.msg : "No playlist found for this mac to reset!";
                    }
                    Modal.error({
                        title: 'Reset Playlist',
                        content: (
                            <div>
                                <p>{msgStr}</p>
                            </div>
                        ),
                        onOk() { },
                    });
                    this.setState({
                        loader: false
                    });
                    // this.setState({
                    //     loader: false,
                    //     showAlert: true,
                    //     alertType: 'danger',
                    //     alertBody: 'Playlist reset failed!',
                    // });
                }
            }).catch(error => {
                console.log(error, "error");
                Modal.error({
                    title: 'Reset Playlist',
                    content: (
                        <div>
                            <p>Something went wrong!</p>
                        </div>
                    ),
                    onOk() { },
                });
                this.setState({
                    loader: false
                });
                // this.setState({
                //     loader: false,
                //     showAlert: true,
                //     alertType: 'danger',
                //     alertBody: 'Something went wrong!',
                // });
            });
        });
    }

    addNewUser = () => {
        this.setState({
            addNewUser: true
        });
    }

    selectModule = (value) => {
        this.setState({
            module: value
        });
    }

    selectResetModule = (value) => {
        this.setState({
            resetModule: value
        });
    }

    goBackToForm = () => {
        this.setState({
            showPlaylistForm: false
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
        const onSearch = value => this.onFinish({ "search_key": value, "module": this.state.module });
        const onResetPlaylist = value => this.resetPlaylist({ "mac_address": value, "module": this.state.resetModule });
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-search"></i> Playlist Addition{" "}
                                <small className="text-muted">Form</small>
                                
                            </CardHeader>
                            <CardBody>
                                {this.state.showAlert ? <AlertMsgComponent alertBody={this.state.alertBody} alertType={this.state.alertType} /> : ""}

                                {this.state.showPlaylistForm ?

                                    <Form
                                        ref={this.formRef}
                                        name="addStreamlist"
                                        onFinish={this.onFinishAddPlayList}
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

                                                <Form.Item hasFeedback label="Mac Address" value={this.state.macAddress} name="macAddress" readOnly={true}>

                                                    <span><b>{this.state.macAddress}</b></span>
                                                </Form.Item>
                                                {this.createUIForStreamList()}
                                                <Form.Item hasFeedback label=" ">
                                                    <Input type='button' value='Add More Streamlist ' onClick={this.addClickToAddMoreStreamlist.bind(this)} />
                                                </Form.Item>
                                               
                                            </div>
                                            <div className='col-md-4'></div>
                                            <Button
                                                htmlType="submit"
                                                style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                                className="ant-btn ant-btn btn btn-success feature-btn ant-col-offset-3"

                                            
                                            >Add Playlist</Button>
                                            <Button className="ant-btn ant-btn btn btn-success feature-btn ant-col-offset-4"
                                                style={{ "left": "31%", "padding": "0.34rem 2.0rem" }}
                                                onClick={this.goBackToForm}>&nbsp; Go Back</Button>


                                        </div>
                                        <Row>

                                        </Row>
                                    </Form>
                                    :
                                    <Form
                                        ref={this.addPlaylistFormRef}
                                        name="addPlaylist"
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
                                            
                                            </Select>
                                        </Form.Item>
                                        <Form.Item hasFeedback label="Mac address" name="playlist_search_key" rules={[
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
                                                onChange={(e) => this.makeMacAddressFormat(e, 'playlist_search_key', this.addPlaylistFormRef)}
                                            />
                                        </Form.Item>
                                    </Form>

                                }
                            </CardBody>
                        </Card> 
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-search"></i> Playlist Reset{" "}
                                <small className="text-muted">Form</small>

                            </CardHeader>
                            <CardBody>
                                <Form
                                    ref={this.formRef}
                                    name="resetPlaylist"
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
                                        <Select name="module" onChange={this.selectResetModule}>
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
                                            
                                        </Select>
                                    </Form.Item>
                                    <Form.Item hasFeedback label="Mac address " name="reset_search_key" rules={[
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
                                    ]} >
                                        <Search
                                            placeholder="Mac Id - XX:XX:XX:XX:XX"
                                            allowClear
                                            htmlType="submit"
                                            enterButton="Reset"
                                            size="large"
                                            onSearch={onResetPlaylist}
                                            onChange={(e) => this.makeMacAddressFormat(e, 'reset_search_key', this.formRef)}
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