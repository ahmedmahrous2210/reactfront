import React, { Component } from 'react';
import { Form, Input, Select,Button, Modal, } from 'antd';
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import dateFormat, { masks } from "dateformat";
import {JsonToExcel} from 'react-json-excel';
import { apiService } from '../../_services/api.service';
import Loader from '../.././../Loader';
import AlertMsgComponent from '../../../AlertMsgComponent';
import Users from '../User/Users';
import AddUserForm from '../User/AddUserForm';
import cLogo from '../../../assets/img/ibosol-main.jpeg' 
const { Search } = Input;
const { Option } = Select;
var originalMac = "";
// const makeMacAddressFormat = (e) => {
// 	//(targetElement).v;
//     var value = e.target.value;
//     console.log(value, "targetElement");
// 	var max_count=value.length>=16 ? 16 : value.length;
// 	for(var i=2; i<max_count; i+=3) {
// 		if (value[i] !== ':')
//         value = [value.slice(0,i),':',value.slice(i)].join('');
// 	}
//     console.log(value, "value");
//     originalMac = value;
//     this.formRef.setFieldsValue({'search_key':value});
//     return e.target.value = value;
// 	return value;
// }
const newResCredVal = (isTrailVal) => {
    if(typeof isTrailVal == 'undefined' || isTrailVal === null || isTrailVal ==''){
      return "Not uploaded";
    }else if(isTrailVal == '1'){
      return 0;
    }else if(isTrailVal == '2'){
      return 1;
    }else if(isTrailVal == '3'){
      return 2;
    }
  }
var moduleVal = '';
var validMacRegexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
export default class CheckAndActivate extends Component {
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
            mac_address: '',
            activationRemarks:null
        }
        this.generateToken = this.generateToken.bind(this);
        this.activationRemarks = this.activationRemarks.bind(this);
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

    selectSwitchedModule = (value) => {
        this.setState({
            switchSelectedModule: value
        });
        
    }

    generateToken() {
        var result = '';
        var characters = '0123456789';
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                characters.length));
        }
        if (result !== '') {
            this.formRef.current.setFieldsValue({
                activation_code: result
            });
            this.setState({
                activationCode: result
            });
        }

    }

    makeMacAddressFormat = (e) => {
        var value = e.target.value;
        var max_count=value.length>=16 ? 16 : value.length;
        for(var i=2; i<max_count; i+=3) {
            if (value[i] !== ':')
            value = [value.slice(0,i),':',value.slice(i)].join('');
        }
        this.formRef.current.setFieldsValue({'search_key':value});
    }

    onFinish = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        //if(!validMacRegexp.test(values.search_key) && moduleVal !=='BAYIPTV'){
        //    this.setState({
        //        loader: false,
        //        showAlert: true,
        //        alertType: 'danger',
        //        alertBody: 'Please input valid mac id!',
        //        userIdCard: false,
        //        imageUrl: false
        //    });
        //    return; 
        //}

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
            macAddress: values.search_key.toLowerCase(),
            activationRemarks:this.state.activationRemarks
        };

        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        //console.log("formData", formData);return false;
        this.setState({ loader: true, showAlert: false, alertBody:'', searchUserList:[], addNewUser: false,
        showAddNewUserBtn:false }, () => {

            apiService.searchUser(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status && addUserResponse.data.IBOMasaUser.length > 0) {

                    if(this.state.module === 'BAYIPTV'){
                        var dmMSg = addUserResponse.msg+', Do you still want to activate and extend expiry period?';
                        if(addUserResponse.statusCode === '000000' && addUserResponse.httpCode ==='200'){
                            dmMSg = addUserResponse.msg+', Do you want to add and activate this Mac?';
                        }
                        Modal.confirm({
                            title: 'Activate Account - '+ this.state.module,
                            content: dmMSg,
                            onOk : () => {
                              return new Promise((resolve, reject) => {
                                this.editUser({
                                    "userId":"BAYIPTVXXX",
                                    "macAddress":addUserResponse.data.IBOMasaUser[0].mac_address,
                                    "isTrail": values.isTrail
                                });
                                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                              }).catch((error) => console.log('Oops errors!', error));
                            },
                            onCancel() {},
                        });
                        this.setState({
                            loader: false
                        });
                        return;
                    }

                    var todaysDate = new Date();
                    var d2 = new Date(addUserResponse.data.IBOMasaUser[0].expire_date);
                    var activeUser = todaysDate.getTime() <= d2.getTime();
                   
                    var modyStr = 'Mac already activated until '+ dateFormat(addUserResponse.data.IBOMasaUser[0].expire_date, "mmmm dS, yyyy");
                   
                    let IsTrailVal = addUserResponse.data.IBOMasaUser[0].is_trial;
                    var notActiveTrail = true;
            
                    if(this.state.module === 'MASA' && IsTrailVal === 0){
                        notActiveTrail = false;
                        
                    }else if(this.state.module === 'VIRGINIA' && IsTrailVal === 1){
                        notActiveTrail = false;
                    }else if(this.state.module === 'IBOAPP' && IsTrailVal === 1){
                        notActiveTrail = false;
                    }else if(this.state.module === 'MACPLAYER' && IsTrailVal === 1){
                        notActiveTrail = false;
                    }else if(this.state.module === 'HUSHPLAY' && IsTrailVal === 1){
                        notActiveTrail = false;
                    }else if(this.state.module === 'KTNPLAYER' && IsTrailVal === 1){
                        notActiveTrail = false;
                    }
                    
                    if(activeUser){
                        Modal.confirm({
                            title: 'Activate Account - '+ this.state.module,
                            content: modyStr+', Do you still want to activate and extend expiry period?',
                            onOk : () => {
                              return new Promise((resolve, reject) => {
                                this.editUser({
                                    "userId":addUserResponse.data.IBOMasaUser[0].id,
                                    "macAddress":addUserResponse.data.IBOMasaUser[0].mac_address,
                                    "isTrail": values.isTrail
                                });
                                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                              }).catch((error) => console.log('Oops errors!', error));
                            },
                            onCancel() {},
                        });
                        this.setState({
                            loader: false
                        });
                        return;
                    }else if(false === activeUser || false === notActiveTrail){
                        this.editUser({
                          "userId":addUserResponse.data.IBOMasaUser[0].id,
                          "macAddress":addUserResponse.data.IBOMasaUser[0].mac_address,
                          "isTrail": values.isTrail
                        });return;
                    }
                                        
                    this.setState({
                        loader: false
                    });
                } else {
                    if (typeof addUserResponse.status != 'undefined' && addUserResponse.status === false){
                        if(addUserResponse.statusCode === 'C10019'){
                            Modal.warning({
                                title: 'Account Activation! '+this.state.module,
                                content: (
                                  <div>
                                    <p>{addUserResponse.msg}</p>
                                  </div>
                                ),
                                onOk() {},
                            });
                            
                        }else{
                            if(this.state.module === 'BAYIPTV'){
                                if(addUserResponse.httpCode =='400'){
                                    Modal.error({
                                        title: 'Account Activation! '+this.state.module,
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
                                }else{
                                    this.editUser({
                                        "userId":"BAYUSERXXX",
                                        "macAddress":values.search_key.toLowerCase(),
                                        "isTrail": values.isTrail
                                    });
                                }
                                
                            }else{
                                Modal.error({
                                    title: 'Account Activation! '+this.state.module,
                                    content: (
                                      <div>
                                        <p>Not found in our system, hence can not be activated!</p>
                                      </div>
                                    ),
                                    onOk() {},
                                });
                                this.setState({
                                    loader: false
                                });


                                // this.addAndActivate({
                                //     "macAddress":values.search_key,
                                //     "isTrail": values.isTrail
                                // });
                            }
                        }
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

    onSwitchMac = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        values.module = this.state.switchSelectedModule;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            oldMacAddress: values.old_mac_address.toLowerCase(),
            newMacAddress: values.new_mac_address.toLowerCase(),
            createdBy: localStorageData.id,
            playlist:this.state.playlist
        };
        values.created_by = localStorageData.id;
        values.group_id = localStorageData.roleId;
        let formData = values;
        this.setState({ loader: true, showAlert: false,alertBody:'', searchUserList:[], addNewUser: false,
        showAddNewUserBtn:false }, () => {

            apiService.editMac(formData).then((addUserResponse) => {
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    Modal.success({
                        title: 'Mac Switching',
                        content: (
                          <div>
                            <p>Mac successfully switched with new device ID!</p>
                          </div>
                        ),
                        onOk() {},
                    });
                    this.setState({
                        loader: false
                    });
                    this.onReset();
                } else {
                    
                    Modal.error({
                        title: 'Mac Switching',
                        content: (
                          <div>
                            <p>{addUserResponse.msg ? addUserResponse.msg : "Mac switching failed!"}</p>
                          </div>
                        ),
                        onOk() {},
                    });
                    this.setState({
                        loader: false
                    });
                }
            }).catch(error => {
                console.log(error, "error");
                Modal.error({
                    title: 'Mac Switching',
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

    editUser = values => {
        let localStorageData = JSON.parse(
          localStorage.getItem('userData_' + localStorage.getItem('token'))
        )
        values.module = this.state.module;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            group_id: "3",
            userId: values.userId,
            appType:values.appType,
            macAddress:values.macAddress.toLowerCase(),
            expiryDate:values.expiryDate,
            isTrail:values.isTrail,
            email:values.email,
            updatedBy:localStorageData.id,
            resellerId:localStorageData.id,
            playlist:[],
            activationRemarks:this.state.activationRemarks
        };
        let formData = values
        this.setState({ loader: true, showAlert: false }, () => {
          apiService
            .editUser(formData)
            .then(addUserResponse => {
              if (
                typeof addUserResponse.status != 'undefined' &&
                addUserResponse.status
              ) {
    
                if(localStorageData.roleId == 2){
                  let dedcCredit = (values.module == 'MASA') ? values.isTrail : (values.isTrail == 1) ? 0 : (values.isTrail == 2) ? 1: 2;
                  let resCreditPoint = parseInt(localStorageData.resCreditPoint) - parseInt(dedcCredit);
                  //update reseller credit point with all specific session data
                  localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 
                      'id':localStorageData.id,
                      'email': localStorageData.email,
                      'name': localStorageData.firstname,
                      'username': localStorageData.username,
                      'roleId':localStorageData.roleId,
                      'resCreditPoint':resCreditPoint,
                      'isVerifiedImage':true,
                      'userImage':"kljfkdfjk",
                      'userIdCard':"kdjfhkg",
                      'imageApproveComment':"kljg",
                      'roleName':localStorageData.roleId+"_"+localStorageData.id}));
                }
                var str = '';
                if(values.module === 'MASA'){
					str = 'Account activated successfully, till '+ dateFormat(addUserResponse.data.MASAUser.expire_date , "mmmm dS, yyyy")
				}else if(values.module === 'BAYIPTV'){
                    str = addUserResponse.msg;
                }else if(values.module === 'ABEPLAYERTV'){
                    str = 'Account activated successfully, till '+ dateFormat(addUserResponse.data.MASAPlayer.expiry_date , "mmmm dS, yyyy");
                }
                else{
					str = 'Account activated successfully, till '+ dateFormat(addUserResponse.data.MASAPlayer.expire_date , "mmmm dS, yyyy");
				}
                
                Modal.success({
                    title: `"${this.state.module}" - Account Activation`,
                    content: (
                      <div>
                        <p>{str}</p>
                      </div>
                    ),
                    onOk() {},
                });
                //setTimeout(() => {window.location.reload()}, 5000);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData_'+localStorage.getItem('token'));
                    window.location = "/";
                  }, 120000);
                this.onReset();
                this.setState({
                  loader: false
                })
              } else {
                var strE = 'Account activation failed, Please try after some time!';
                if(values.module == 'BAYIPTV'){
                    strE = "Response from BAYIPTV - " + addUserResponse.msg;
                }else if(this.state.module !== 'BAYIPTV' &&  addUserResponse.msg !== undefined){
                    strE = "Response from "+ this.state.module + " - " + addUserResponse.msg;
                }
                
                Modal.error({
                    title: "Account activation! "+ this.state.module,
                    content: (
                      <div>
                        <p>{strE}</p>
                      </div>
                    ),
                    onOk() {},
                });
                this.setState({
                  loader: false
                //   showAlert: true,
                //   alertType: 'danger',
                //   alertBody: updStr
                })
              }
            })
            .catch(error => {
                console.log("Catch Block--", error);
                let strE = 'Something went wrong!';
                Modal.error({
                    title: "Account Activation! "+this.state.module,
                    content: (
                      <div>
                        <p>{strE}</p>
                      </div>
                    ),
                    onOk() {},
                });
              this.setState({
                loader: false
                // showAlert: true,
                // alertType: 'danger',
                // alertBody: 'Something went wrong!'
              })
            })
        })
      }

      addAndActivate = (values) => {
        let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
        values.created_by = localStorageData.id;
        values.group_id = '3';
        values.module = this.state.module;
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            appType: values.appType,
            macAddress: values.macAddress.toLowerCase(),
            expiryDate: values.expiryDate,
            isTrail: values.isTrail,
            email: values.email,
            createdBy: localStorageData.id,
            playlist: []
            
        };
        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {

            apiService.addUser(formData).then((addUserResponse) => {
               // console.log("final-res", addUserResponse);
                if (typeof addUserResponse.status != 'undefined' && addUserResponse.status) {
                    this.formRef.current.setFieldsValue({
                        isTrail: values.isTrail,
                        appType: values.appType,
                    });
                    var expiryDate;
                    if(this.state.module === 'MASA'){
                        expiryDate = addUserResponse.data.MASAUser.expire_date;
                    }else if(this.state.module === 'VIRGINIA'){
                        expiryDate = addUserResponse.data.VIRGINIAUser.expire_date;
                    }else if(this.state.module === 'IBOAPP'){
                        expiryDate = addUserResponse.data.IBOAPPUser.expire_date;
                    }else if(this.state.module === 'BOBPLAYER'){
                        expiryDate = addUserResponse.data.BOBPLAYER.expire_date;
                    }else if(this.state.module === 'ABEPLAYERTV'){
                        expiryDate = addUserResponse.data.ABEPLAYERTVUser.expiry_date;
                    }else if(this.state.module === 'MACPLAYER'){
                        expiryDate = addUserResponse.data.MacPlayer.expire_date;
                    }else if(this.state.module === 'HUSHPLAY'){
                        expiryDate = addUserResponse.data.HushPlay.expire_date;
                    }else if(this.state.module === 'KTNPLAYER'){
                        expiryDate = addUserResponse.data.KtnPlayer.expire_date;
                    }

                    let strE = 'User added and activated successfully till '+ dateFormat(expiryDate, "mmmm dS, yyyy");
                    Modal.success({
                      title: `"${this.state.module}" - Account Activation`,
                      content: (
                        <div>
                          <p>{strE}</p>
                        </div>
                     ),
                     onOk() {},
                    });
                    this.setState({
                        loader: false
                    });
                    if (localStorageData.roleId == 2) {
                        let dedcCredit = (values.module == 'MASA') ? values.isTrail : (values.isTrail == 1) ? 0 : (values.isTrail == 2) ? 1 : 2;
                        let resCreditPoint = parseInt(localStorageData.resCreditPoint) - parseInt(dedcCredit);
                       // console.log(resCreditPoint);
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
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData_' + localStorage.getItem('token'));
                        window.location = "/";
                      }, 120000);
                } else {
                    let strE = 'User creation and activation failed!';
                    Modal.error({
                      title: "Account Activation",
                      content: (
                        <div>
                          <p>{strE}</p>
                        </div>
                     ),
                     onOk() {},
                    });
                    this.setState({
                        loader: false
                    });
                }
            }).catch(error => {
                    let strE = 'Something went wrong!';
                    Modal.error({
                      title: "Account Activation",
                      content: (
                        <div>
                          <p>{strE}</p>
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
        moduleVal = value;
    }

    selectIsTrail = (value) => {
        this.setState({
            isTrailVal: value
        });
    }

    activationRemarks = (e) => {
        this.setState({
            activationRemarks: e.target.value
        });
    }

    makeMacValue = (event) => {
        
        this.formRef.current.setFieldsValue({search_key: event.target.value.replace(/(..)/g, '$1:').slice(0,-1)});
        
        this.setState({ mac_address: event.target.value.replace(/(..)/g, '$1:').slice(0,-1)});
        
    }
    render() {
        const { componentSize } = this.state;
        const {modalVisible, modalTitle, modalBodyContent, confirmLoading} = this.state;
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
                                <i className="fa fa-search"></i> User Activation{" "}
                                <small className="text-muted">Form</small>
                                {/* <Link to="/users" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Users List</Link> */}
                            </CardHeader>
                            <CardBody>
                                {this.state.showAlert ? <AlertMsgComponent alertBody={this.state.alertBody} alertType={this.state.alertType} /> : ""}
                                {this.state.showAddNewUserBtn ? <div className='text-center'><Button type="primary"
                                style={{"padding": "0.34rem 2.0rem"}} className="btn btn-success" onClick={this.addNewUser}>Add New User</Button></div>: null}
                                <Form
                                    ref={this.formRef}
                                    name="activate-mac"
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
                                        search_key:this.state.mac_address
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
                                    <Form.Item hasFeedback label="Select Package" name="isTrail" 
                                        rules={[
                                            {required: true, message: "Please Select Package!"}
                                        ]}>
                                        <Select defaultValue="2" name="isTrail" onChange={this.selectIsTrail}>
                                            
                                            <Option value="2">1-Year</Option>
                                            <Option value="3">Lifetime</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item hasFeedback label="Remarks" name="activationRemark" >
                                        <Input onChange={this.activationRemarks}/>
                                    </Form.Item>
                                    <Form.Item hasFeedback label="Mac address" value={originalMac}
                                             name="search_key" rules={[
                                        {
                                            required: true,
                                            message: 'Please input mac id'
                                        },
                                        () => ({
                                            validator(_, value) {
                                                if (!value) {
                                                    return Promise.reject();
                                                }
                                                //if (!validMacRegexp.test(value) && moduleVal !== 'BAYIPTV') {
                                                    
                                               //     return Promise.reject("Please input valid mac address!");
                                               // }
                                                
                                                return Promise.resolve();
                                            }
                                            
                                        }),
                                    ]} className="mac_address">
                                        
                                        <Search
                                            placeholder="Mac Id - XX:XX:XX:XX:XX"
                                            allowClear
                                            htmlType="submit"
                                            enterButton="Activate"
                                            size="large"
                                            value={originalMac}
                                            name="search_key"
                                            onChange={this.makeMacAddressFormat}
                                            onSearch={onSearch}
                                            className="mac_address"
                                        />
                                    </Form.Item>
                                    
                                    {/* <JsonToExcel
                                        data={data}
                                        className={className}
                                        filename={filename}
                                        fields={fields}
                                        style={style}
                                        text={text}
                                        /> */}
                                    <p style={{color:"#cb4040"}} className="text-center">
                                        <img title="Our active app channel partner" src="ibosol-main.jpeg" className="img-responsive img-thumbnail" alt="c-logo"/>
                                        {/* <i>
                                         
                                         Happy Ramadan Kareem Newly Added BOB PLAYER, ABE PLAYER, Mactvplayer and many more coming soon. 
                                         Thank you for being a part of our family!</i>
                                         <p>BOB Player available for all models of Samsung and LG.</p> */}
                                         
                                        
                                    </p>
                                </Form>
                                {this.state.searchUserList.length > 0 ?
                                    <Users userList={this.state.searchUserList} moduleFrom="checkActi" />
                                    : null}
                                {this.state.addNewUser ? <AddUserForm moduleFrom="checkActi" />: null}
                            </CardBody>
                        </Card>
                        {/* <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-search"></i> Mac Switch{" "}
                                <small className="text-muted">Form</small>
                                
                            </CardHeader>
                            <CardBody>
                            <Form
                                    ref={this.formRef}
                                    name="switchMac"
                                    onFinish={this.onSwitchMac}
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
                                        <Select name="module" onChange={this.selectSwitchedModule}>
                                         <Option value="">Select Module Type</Option>
                                            <Option value="MASA">MASA</Option> 
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
                                    <Form.Item hasFeedback label="Old Mac address " name="old_mac_address" rules={[
                                        {
                                            required: true,
                                            message: 'Please input mac id'
                                        }
                                    ]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item hasFeedback label="New Mac address " name="new_mac_address" rules={[
                                        {
                                            required: true,
                                            message: 'Please input mac id'
                                        },
                                        () => ({
                                            validator(_, value) {
                                                if (!value) {
                                                    return Promise.reject();
                                                }
                                                if (!validMacRegexp.test(value)) {
                                                    return Promise.reject("Please input valid mac address!");
                                                }
                                                
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}>
                                        <Input/>
                                    </Form.Item>
                                    
                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "25%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"
                                    >Switch Mac</Button>

                                </Form>
                            </CardBody>
                        </Card> */}
                    </Col>
                    <Modal 
                        visible={modalVisible}
                        onOk={() => ""}
                        confirmLoading={confirmLoading}
                        okText="Ok"
                        zIndex="1000"
                        >
                        {modalBodyContent}
                    </Modal>
                </Row>

            </div>
        );
    };
}