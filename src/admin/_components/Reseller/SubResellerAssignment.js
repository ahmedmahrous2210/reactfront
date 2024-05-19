import React, { Component } from 'react'
import { Form, Input, Button, Select, Upload, message, DatePicker } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
var expiryDateInput;

let localStorageData = JSON.parse(
    localStorage.getItem('userData_' + localStorage.getItem('token'))
);
export default class SubResellerAssignment extends Component {
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
      resellerList:[]

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
    this._fetchResellerList(this.props.editData.id);
  }

  _fetchResellerList(userId) {
    let formData = {
      "module": 'MASA',
      "channelId": 'MASAPLAYER',
      "requestId": 'IBOPLAYERAPP2',
      "groupId": localStorageData.roleId,
      "createdBy":localStorageData.id,
      "subResellerId":this.props.editData.id,
      "isValid": true
    };
    this.setState({ loader: true }, () => {
      apiService
        .resellerListAssigment(formData)
        .then((userListData) => {
          
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            this.setState({
                resellerList: userListData.data.IBOReseller
            });
            expiryDateInput = "";
            this.formRef.current.setFieldsValue({
                subReseller: (this.props.editData.name + ' - ' + this.props.editData.email)
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

  renderResellerList (resellerList) {
        return resellerList.map(opt =>  {
        let concatTitle = opt.name +"-"+opt.email
            return (  
            <Option  value={opt.id} key={opt.concatTitle}>
                {concatTitle}
            </Option>
            )
        })
    }
    backToList(e) {
        this.props.backToList(true);
    }

  onFinish = values => {
    
    values.group_id = '2';
    values.module = 'MASA';
    values.channelId = 'MASAPLAYER';
    values.requestId = 'IBOPLAYERAPP2';
    values.requestData = {
        subResellerId:this.props.editData.id,
        resellerId:values.resellerId
    };
    //values.id = this.props.editData.id;
    let formData = values
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .addSubReseller(formData)
        .then(addUserResponse => {
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'success',
              alertBody: addUserResponse.msg ? addUserResponse.msg: "Sub Reseller assigment success!"
            });
            setTimeout(() => {window.location.reload()}, 2000);
            
          } else {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: 'danger',
              alertBody: 'Failed to assign sub reseller!'
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
                  size: componentSize,
                  expiryDate:expiryDateInput
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
              >
                <div className="row col-md-12">
                  <div className="col-md-8">
                    <Form.Item hasFeedback label="Sub Reseller Name - Email" name="subReseller" readOnly={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item hasFeedback label="Select Parent Reseller Email " name="resellerId">
                        <Select
                        showSearch
                        placeholder="Select Parent Reseller Email"
                        optionFilterProp="key"
                        notFoundContent="Reseller not found"
                        // filterOption={(input, option) =>
                        //     option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        >
                        {this.renderResellerList(this.state.resellerList)}
                        </Select>
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
