import React, { Component } from 'react'
import { Form, Input, Button, Select, message } from 'antd';
import Reaptcha from 'reaptcha';
import moment from 'moment';
import { Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import Loader from '../.././../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'
const { Option } = Select;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
let localStorageData = JSON.parse(
  localStorage.getItem('userData_' + localStorage.getItem('token'))
)
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
var validMacRegexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
export default class EditClient extends Component {
  constructor(props) {

    super(props)
    let propData = this.props.editData;
    this.state = {
      componentSize: 'middle',
      setComponentSize: 'middle',
      loader: false,
      successMsg: '',
      showAlert: false,
      alertType: 'danger',
      imageUrl: '',
      userIdCard:'',
      alertBody: '',
      isEditForm: false,
      rolesData: [],
      disableBtn:false,
      moduleFrom: "",
      verified: false,
    }
    if (this.props.rolesData) {
      this.setState({
        rolesData: this.props.rolesData
      })
    }
    this.handleInputOnChange = this.handleInputOnChange.bind(this)
  }

  formRef = React.createRef()

  componentDidMount = () => {
    if(this.props.moduleFrom !== ''){
      this.setState({
        moduleFrom:this.props.moduleFrom
      });
    }
    this._fetchUserDetail(this.props.editData.id);
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

  _fetchUserDetail(userId) {
    let formData = {
      "module":this.props.editData.module,
      "channelId":'MASAPLAYER',
      "requestId" :'IBOPLAYERAPP2',
      "requestData":{
        "resellerId":localStorageData.id,
        "userId":userId,
      },
      "isValid": true
    };
    const getTrailField = (status) => {
      return status == "1"
      ? "Weekly"
      : status === "2"
      ? "Yearly"
      : status === "3"
      ? "Lifetimne"
      : "Weekly";
    };
    this.setState({ loader: true }, () => {
      apiService
        .getUserById(formData)
        .then((userListData) => {
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            var expDate = new Date(userListData.data.IBOMasaUser.expire_date);
            var creationDate = new Date(userListData.data.IBOMasaUser.created_at);
            var diffTime = Math.abs(expDate - creationDate);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var isTrailVal = '1';
            if(this.props.editData.module !== 'MASA'){
              isTrailVal =  userListData.data.IBOMasaUser.is_trial
            }else{
              if(diffDays > 365) {
                isTrailVal = '3'
              }else if(diffDays > 7){
                isTrailVal = '2';
              }
            }
            
            
            this.formRef.current.setFieldsValue({
              appType:userListData.data.IBOMasaUser.app_type,
              email:userListData.data.IBOMasaUser.email,
              macAddress:userListData.data.IBOMasaUser.mac_address.toLowerCase(),
              //selected_plan:userListData.data.IBOMasaUser.selected_plan,
              //activation_code:userListData.data.IBOUser.activation_code,
              isTrail:isTrailVal,
              expiryDate:moment(userListData.data.IBOMasaUser.expire_date),
              module:userListData.data.IBOMasaUser.module,
              streamlist_url:userListData.data.IBOMasaUser.playlist_url.length > 0 ? userListData.data.IBOMasaUser.playlist_url[0].url : "",
              streamlist_url_name:userListData.data.IBOMasaUser.playlist_url.length > 0 ? userListData.data.IBOMasaUser.playlist_url[0].name : "",
              streamlist_url2:userListData.data.IBOMasaUser.playlist_url.length > 1 ? userListData.data.IBOMasaUser.playlist_url[1].url : "",
              streamlist_url_name2:userListData.data.IBOMasaUser.playlist_url.length > 1 ? userListData.data.IBOMasaUser.playlist_url[1].name : "",
              streamlist_url3:userListData.data.IBOMasaUser.playlist_url.length > 2 ? userListData.data.IBOMasaUser.playlist_url[2].url : "",
              streamlist_url_name3:userListData.data.IBOMasaUser.playlist_url.length > 2 ? userListData.data.IBOMasaUser.playlist_url[2].name : "",
              streamlist_url4:userListData.data.IBOMasaUser.playlist_url.length > 3 ? userListData.data.IBOMasaUser.playlist_url[3].url : "",
              streamlist_url_name4:userListData.data.IBOMasaUser.playlist_url.length > 3 ? userListData.data.IBOMasaUser.playlist_url[3].name : "",
              streamlist_url5:userListData.data.IBOMasaUser.playlist_url.length > 4 ? userListData.data.IBOMasaUser.playlist_url[4].url : "",
              streamlist_url_name5:userListData.data.IBOMasaUser.playlist_url.length > 4 ? userListData.data.IBOMasaUser.playlist_url[4].name : "",
              //instituteId:userListData.data.instituteId,
              //grade:userListData.data.grade,
              //userImage:userListData.data.userImage,
              //userIdCard:userListData.data.userIdCard,
            });
            // this.setState({
            //   imageUrl: userListData.data.userImage,
            //   userIdCard: userListData.data.userIdCard
            // });
          } else {
            let errMsg = "Failed to load user data!"; 
            if(userListData.statusCode !== undefined && userListData.statusCode === 'C10012'){
              errMsg = "Your do not have permission to edit this user!";
            }
            this.setState({
              showAlert: true,
              disableBtn: true,
              alertType: "danger",
              alertBody: errMsg,
            });
          }
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            alertType: "danger",
            alertBody: "Something went wrong!",
          });
        });
    });
  }

  onReset = () => {
    this.formRef.current.resetFields()
  }

  handleInputOnChange = e => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    this.props.editData[fieldName] = fieldValue;
    this.props.returnEditData(this.props.editData);

  }

  onRoleClick() {
    if (this.state.rolesData.length === 0) {
      apiService.roleList(0).then(response => {
        if (typeof response.success != 'undefined' && response.success) {
          this.setState({
            rolesData: response.data
          })
        }
      })
    }
  }
  backToList(e) {
    this.props.backToList(true)
  }
  handlePhotoChange = info => {
    getBase64(info.file.originFileObj, imageUrl =>
      this.setState({
        imageUrl,
        loading: false,
      }),
    );
  };

  handleIdCardChange = info => {
    getBase64(info.file.originFileObj, userIdCard =>
      this.setState({
        userIdCard,
        loading: false,
      }),
    );
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

  onFinish = values => {
    let localStorageData = JSON.parse(
      localStorage.getItem('userData_' + localStorage.getItem('token'))
    )
    values.module = this.props.editData.module;
    values.channelId = 'MASAPLAYER';
    values.requestId = 'IBOPLAYERAPP2';
    values.requestData = {
        group_id: "3",
        userId: this.props.editData.id,
        appType:values.appType,
        macAddress:values.macAddress.toLowerCase(),
        expiryDate:values.expiryDate,
        isTrail:values.isTrail,
        email:values.email,
        updatedBy:localStorageData.id,
        resellerId:localStorageData.id,
        playlist:[
            {
                playListName:values.streamlist_url_name,
                playListUrl:values.streamlist_url
            },
            {
                playListName:values.streamlist_url_name2,
                playListUrl:values.streamlist_url2
            },
            {
                playListName:values.streamlist_url_name3,
                playListUrl:values.streamlist_url3
            },
            {
                playListName:values.streamlist_url_name4,
                playListUrl:values.streamlist_url4
            },
            {
                playListName:values.streamlist_url_name5,
                playListUrl:values.streamlist_url5
            },
        ]
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

            if(localStorageData.roleId === 2 && values.isTrail !== this.props.editData.isTrail){
              let dedcCredit = (values.module == 'MASA') ? values.isTrail : (values.isTrail == 1) ? 0 : (values.isTrail == 2) ? 1: 3;
              let resCreditPoint = (localStorageData.resCreditPoint - newResCredVal(dedcCredit));
              //let resCreditPoint = (localStorageData.resCreditPoint - newResCredVal(values.isTrail));
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
            setTimeout(() => {window.location.reload()}, 2000);
            var updStr = 'User updated successfully!';
            if(this.state.moduleFrom !== ''){
              updStr = 'User Activated successfully!';
            }
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'success',
              alertBody: updStr
            })
          } else {
            var updStr = 'Failed to update user!';
            if(this.state.moduleFrom !== ''){
              updStr = 'User Activated failed!';
            }
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'danger',
              alertBody: updStr
            })
          }
        })
        .catch(error => {
          this.setState({
            loader: false,
            showAlert: true,
            alertType: 'danger',
            alertBody: 'Something went wrong!'
          })
        })
    })
  }

  render() {
    const { componentSize } = this.state

    const onFormLayoutChange = ({ size }) => {
      this.setState({
        setComponentSize: size,
        componentSize: size
      })

    }
   console.log("from edit page ==this.state.moduleFrom", this.state.moduleFrom);

    return (
      <Row>
        <Col xl='12'>
          <Card>
            <CardHeader>
              <i className='fa fa-align-justify' /> {this.state.moduleFrom !== "" ? "Activation Form": "Edit "}
              <small className='text-muted'>User</small>
              {this.state.loader ? <Loader /> : ''}
              <i
                onClick={e => this.backToList(e, this.props)}
                className='fa fa-arrow-left btn-sm btn btn-info feature-btn'
              >
                {' '}
                &nbsp; Back{' '}
              </i>
            </CardHeader>
            <CardBody>
              {this.state.showAlert ? (
                <AlertMsgComponent
                  alertBody={this.state.alertBody}
                  alertType={this.state.alertType}
                />
              ) : (
                  ''
                )}

              <Form
                ref={this.formRef}
                name='register'
                onFinish={this.onFinish}
                labelCol={{
                  span: 6
                }}
                wrapperCol={{
                  span: 14
                }}
                layout='horizontal'
                initialValues={{
                  size: componentSize
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                autoComplete="off"
              >
                <div className="row col-md-12">
                  <div className="col-md-8">
                    {/* <Form.Item hasFeedback label="Module" name="module" readOnly={true}
                       >
                          <Input />
                        
                    </Form.Item> */}
                    {/* <Form.Item hasFeedback label="Select App Type" name="appType">
                      <Select defaultValue="android" name="appType">
                          <Option value="android">Android</Option>
                          <Option value="lg">LG</Option>
                          <Option value="samsung">Samsung</Option>
                      </Select>
                    </Form.Item> */}
                    <Form.Item hasFeedback label="Mac Address" name="macAddress" readOnly={true}
                        rules={[
                            { required: true, message: "Please input mac address!" },
                            { whitespace: true, message: "Should not contain whitespace." },
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
                        <Input readOnly={true}/>
                    </Form.Item>
                    <Form.Item hasFeedback label="Select Plan" name="isTrail">
                      <Select>
                          <Option value="1">Weekly</Option>
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
                    {/* <div className="row">
                        <div className='col-md-3'></div>
                        <div className='col-md-9'>
                            <Reaptcha
                                ref={e => (this.captcha = e)}
                                sitekey="6Lf-V-kdAAAAAI97IVi3fA8QVTA_jhr2KPth4G_5"
                                onVerify={this.onVerify}
                            />
                        </div>
                    </div> */}
                    {this.state.moduleFrom !== "" ? null :
                    <div>
                    <Form.Item hasFeedback label="Expiry Date" name="expiryDate" readOnly={true}
                        >
                        <Input readOnly={true} />
                    </Form.Item>
                    
                    </div>
                   }
                  </div>
                  <div className="col-md-4">
                    
                  </div>
                </div>

                <Button type="primary"
                        htmlType="submit"
                        style={{"left":"16%","padding": "0.34rem 2.0rem"}}
                        className="btn btn-success ant-col-offset-3"
                        // disabled={!this.state.verified}
                    >{this.state.moduleFrom !=="" ? "Activate" : "Update"}</Button>
                    
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
