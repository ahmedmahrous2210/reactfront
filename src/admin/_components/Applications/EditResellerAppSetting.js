import React, { Component } from 'react'
import { Form, Input, Button, Select, Upload, message, DatePicker, Checkbox } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import Loader from '../.././../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'

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
var expiryDateInput;
let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
export default class EditResellerAppSetting extends Component {
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
      userIdCard: '',
      alertBody: '',
      isEditForm: false,
      rolesData: [],
      expiryDate:'',
      appImage:'',
      appList:[
        {
            id: "",
            app_name:""
        }
      ],
      resellerApps:[]
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
    this._fetchUserDetail(this.props.editData.id);
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

  _fetchUserDetail(userId) {
    let formData = {
      "module": 'MASA',
      "channelId": 'MASAPLAYER',
      "requestId": 'IBOPLAYERAPP2',
      "requestData": {
        "editResId": this.props.editData.id,
        "createdBy": localStorageData.id
      },
      "isValid": true
    };
    this.setState({ loader: true }, () => {
      apiService
        .getResAppSetting(formData)
        .then((userListData) => {
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            //expiryDateInput = userListData.data.IBOReseller.expiry_date;
            this.formRef.current.setFieldsValue({
              appName: userListData.data.ResellerApplication.app_name,
              appId: userListData.data.ResellerApplication.app_id,
              appTagLine: userListData.data.ResellerApplication.app_tag_line,
              appLogo: userListData.data.ResellerApplication.app_logo,
              appEmail: userListData.data.ResellerApplication.app_email,
              appPhone: userListData.data.ResellerApplication.app_phone,
              appDescription: userListData.data.ResellerApplication.app_description,
              appPlaceLocation: userListData.data.ResellerApplication.app_place_location
            });
            this.setState({
                appImage:userListData.data.ResellerApplication.app_logo
            });
            
          } else {
            this.setState({
              showAlert: true,
              alertType: "danger",
              alertBody: "Failed to load user data!",
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
    //return true;
    console.log('this.state.appImage==', this.state.appImage);
    this.setState({
      loading: false,
      appImage: this.state.appImage
    });
  }

  handlePhotoChange = info => {
    getBase64(info.file.originFileObj, appImage =>
      this.setState({
        appImage,
        loading: false,
      }),
    );
    
  };

  onFinish = values => {
    let localStorageData = JSON.parse(
      localStorage.getItem('userData_' + localStorage.getItem('token'))
    );
    let formData = {};
    values.appLogo = this.state.appImage;
    values.createdBy = localStorageData.id;
    values.editResAppId = this.props.editData.id;
    formData.requestData = values;
    formData.module = 'MASA';
    formData.channelId = 'MASAPLAYER';
    formData.requestId = 'IBOPLAYERAPP2';
    //values.id = this.props.editData.id;
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .editResellerAppSetting(formData)
        .then(addUserResponse => {
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'success',
              alertBody: 'App Setting updated successfully'
            })
          } else {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'danger',
              alertBody: 'Failed to update app setting!'
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.setState({
            loader: false,
            showAlert: true,
            alertType: 'danger',
            alertBody: 'Something went wrong!'
          })
        })
    })
  }

  createUIForApplist(){
    return this.state.appList.map((el, i) => (
        
            <Select key={i} value={el.id}>{el.app_name}</Select>
             
       
    ))
  }

  onAppChangeCheck = () => {

  }

  render() {
    const { componentSize , appImage} = this.state;
    const uploadUserButton = (
        <div>
          {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload User Image</div>
        </div>
    );
    const onFormLayoutChange = ({ size }) => {
      this.setState({
        setComponentSize: size,
        componentSize: size
      })

    }

    return (
      <Row>
        <Col xl='12'>
          <Card>
            <CardHeader>
              <i className='fa fa-align-justify' /> Edit{' '}
              <small className='text-muted'>Reseller</small>
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
                  size: componentSize,
                  expiryDate:expiryDateInput
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
              >
                <div className="row col-md-12">
                  <div className="col-md-8">
                  <Form.Item hasFeedback label="Select Appliacation" name="appId"
                  rules={[
                      { required: true, message: "Please Select Application!" },

                  ]}>
                  <Select name="appId" onChange={this.selectApplication}>
                    {this.createUIForApplist()}
                  </Select>
              </Form.Item>
              <Form.Item label='App Name'>
                  <Form.Item
                    hasFeedback
                    name='appName'
                    rules={[
                      { required: true, message: 'Please Input App Name!' }
                    ]}
                  >
                    <Input placeholder="App Name" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='App Tag Line'>
                  <Form.Item
                    hasFeedback
                    name='appTagLine'
                   
                  >
                    <Input placeholder="App Tag Line" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='App Logo'>
                  <Form.Item
                    hasFeedback
                    name='appLogo'
                    rules={[
                      { required: true, message: 'Please Input App Logo!' }
                    ]}
                  >
                     <Upload
                      name="appLogo"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={this.avatarUpload}
                      beforeUpload={beforeUpload}
                      onChange={this.handlePhotoChange}
                    >
                      {appImage ? <img src={appImage} alt="avatar" style={{ width: '40%' }} /> : uploadUserButton}
                    </Upload>
                  </Form.Item>
              </Form.Item>
              <Form.Item label='App Email'>
                  <Form.Item
                    hasFeedback
                    name='appEmail'
                    rules={[
                      { required: true, message: 'Please input app email!' },
                      {type: 'email',message: 'The input is not valid E-mail!'}
                    ]}
                  >
                    <Input placeholder="App Email" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='App Phone'>
                  <Form.Item
                    hasFeedback
                    name='appPhone'
                    rules={[
                      { required: true, message: 'Please input app email!' }
                    ]}
                  >
                    <Input placeholder="App Phone" />
                  </Form.Item>
              </Form.Item>
              
              <Form.Item label='App Description'>
                  <Form.Item
                    hasFeedback
                    name='appDescription'
                   
                  >
                    <Input placeholder="App Place Location!" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='App Place Location'>
                  <Form.Item
                    hasFeedback
                    name='appPlaceLocation'
                   
                  >
                    <Input placeholder="App Place Location!" />
                  </Form.Item>
              </Form.Item>
                  </div>
                  <div className="col-md-4">

                  </div>
                </div>

                <Button type="primary"
                  htmlType="submit"
                  style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                  className="btn btn-success ant-col-offset-3"
                >Update</Button>

              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
