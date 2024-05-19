import React, { Component } from 'react'
import { Form, Input, Button, message, DatePicker, Checkbox } from 'antd';

import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import moment from 'moment';
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
export default class EditReseller extends Component {
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
  }

  _fetchUserDetail(userId) {
    let formData = {
      "module": 'MASA',
      "channelId": 'MASAPLAYER',
      "requestId": 'IBOPLAYERAPP2',
      "requestData": {
        "resellerId": this.props.editData.id,
        "createdBy": localStorageData.id
      },
      "isValid": true
    };
    this.setState({ loader: true }, () => {
      apiService
        .getResellerById(formData)
        .then((userListData) => {
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            expiryDateInput = userListData.data.IBOReseller.expiry_date;
            this.formRef.current.setFieldsValue({
              name: userListData.data.IBOReseller.name,
              email: userListData.data.IBOReseller.email,
              status: userListData.data.IBOReseller.status,
              creditPoint: userListData.data.IBOReseller.credit_point,
              expiryDate: moment(userListData.data.IBOReseller.expiry_date),
              app_list: userListData.data.IBOReseller.application_allowed
            });
            this.setState({
              appList:userListData.data.IBOReseller.applications,
              resellerApps: userListData.data.IBOReseller.application_allowed
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
    window.location.reload();
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
    );
    values.group_id = '2';
    values.module = 'MASA';
    values.channelId = 'MASAPLAYER';
    values.requestId = 'IBOPLAYERAPP2';
    values.requestData = {
        name:values.name,
        creatorGroupId:localStorageData.roleId,
        expiryDate:moment(values.expiryDate).format("YYYY-MM-DD"),
        creditPoint:values.creditPoint,
        email:values.email,
        createdBy:localStorageData.id,
        resellerId:this.props.editData.id,
        newPassword:values.newPassword,
        appList: values.app_list
    };
    //values.id = this.props.editData.id;
    let formData = values
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .editReseller(formData)
        .then(addUserResponse => {
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'success',
              alertBody: 'User updated successfully'
            })
          } else {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'danger',
              alertBody: 'Failed to update user!'
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
        <Col key={i} span={8}>
            <Checkbox value={el.id}>{el.app_name}</Checkbox>
             
        </Col>
    ))
  }

  onAppChangeCheck = () => {

  }

  render() {
    const { componentSize } = this.state;
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
                    <Form.Item hasFeedback label="Name" name="name" value={this.state.isEditForm ? this.state.name : ''}
                      rules={[
                        { required: true, message: "Please input name!" },
                        { whitespace: false, message: "Should not contain whitespace." }
                      ]}>
                      <Input />
                    </Form.Item>
                    {/*<Form.Item hasFeedback label="Add Credit" name="creditPoint" value={this.state.isEditForm ? this.state.credit_point : ''}
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
                            if (value.length > 99) {
                              return Promise.reject("Credit Point can't be more than 99 digits");
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}>
                      <Input />
					</Form.Item>*/}
            {this.state.appList.length > 0 && this.state.appList[0].app_name != '' ?  
                    <Form.Item hasFeedback label="Applications" name="app_list" value={this.state.isEditForm ? this.state.email : ''}
                     >
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onAppChangeCheck} >
                          <Row>
                              {this.createUIForApplist()} 
                          </Row>
                      </Checkbox.Group>
                    </Form.Item>  
                    : null }
                    <Form.Item hasFeedback label="Email" name="email" value={this.state.isEditForm ? this.state.email : ''}
                      rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: "Please input Email!" },
                        { whitespace: true, message: "Should not contain whitespace." }
                      ]}>
                      <Input />
                    </Form.Item>
                    <Form.Item hasFeedback label="New Password" name="newPassword" 
                      rules={[
                        
                        { whitespace: true, message: "Should not contain whitespace." }
                      ]}>
                      <Input.Password />
                    </Form.Item>
                    <Form.Item hasFeedback label="Expiry Date" size="58" name="expiryDate" rules={[{ required: true, message: "Please input Expiry Date!" }]} >
                      <DatePicker format="YYYY-MM-DD" size="58" />
                      {/* <Input /> */}
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
