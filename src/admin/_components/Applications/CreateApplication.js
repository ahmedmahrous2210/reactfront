import React, { Component } from 'react'
import {Upload, Form,message, Input, Button } from 'antd'
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardHeader,  CardBody } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import Loader from '../../../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


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
export default class CreateApplication extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loader: false,
      alertType: 'danger',
      showAlert: false,
      alertBody: '',
      appImage:''
    }
  }

  
  onFinish = values => {
    let loggedInUserData = JSON.parse(
      localStorage.getItem('userData_' + localStorage.getItem('token'))
    )


    let formData = {};
    values.appLogo = this.state.appImage;
    values.createdBy = loggedInUserData.id
    formData.requestData = values;
    formData.module = 'MASA';
    formData.channelId = 'MASAPLAYER';
    formData.requestId = 'IBOPLAYERAPP2';
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .createApplication(formData)
        .then(response => {
          if (typeof response.status != 'undefined' && response.status) {
            this.setState({
              loader: false,
              alertType: 'success',
              showAlert: true,
              alertBody: 'AppUpdate added successfully .'
            })
          } else {
            this.setState({
              loader: false,
              alertType: 'danger',
              showAlert: true,
              alertBody: 'Failed to add app-update'
            })
          }
        })
        .catch(error => {
          this.setState({
            loader: false,
            showAlert: true,
            alertType: 'danger',
            alertBody: 'Something Went wrong'
          })
        })
    })
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

  render () {
    const { appImage } = this.state;
    const uploadUserButton = (
        <div>
          {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload User Image</div>
        </div>
      );
    return (
      <div>
        <Row>
            <Col xl="12">
              <Card>
                  <CardHeader>
                  {this.state.loader ? <Loader />: ''}
                  <i className="fa fa-align-justify"></i> Add Application{" "}
                <small className="text-muted">Form</small>
                <Link to="/applications" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Application List</Link>
                  </CardHeader>
          <CardBody>
            {this.state.loader ? <Loader /> : ''}
            {this.state.showAlert ? (
              <AlertMsgComponent
                alertType={this.state.alertType}
                alertBody={this.state.alertBody}
              />
            ) : (
              ''
            )}
            <Form
              onFinish={this.onFinish}
              labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 14
              }}
              layout='horizontal'
            >
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
              
              

              <Button type="primary"
                htmlType="submit"
                style={{"left":"16%","padding": "0.34rem 2.0rem"}}
                className="btn btn-success ant-col-offset-3"
              >
                Submit</Button>
            </Form>
          </CardBody>
        </Card>
        </Col>
        
        </Row>
      </div>
    )
  }
}
