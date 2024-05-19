import React, { Component } from 'react'
import { Form, Input, TimePicker, Button, DatePicker } from 'antd'
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardHeader,  CardBody } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import Loader from '../../../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'

export default class AddNewMessage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loader: false,
      alertType: 'danger',
      showAlert: false,
      alertBody: ''
    }
  }

  
  onFinish = values => {
    let loggedInUserData = JSON.parse(
      localStorage.getItem('userData_' + localStorage.getItem('token'))
    )
    values.createdBy = loggedInUserData.id

    let formData = values
    
    formData['createdBy'] = loggedInUserData.id
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .addMessage(values)
        .then(response => {
          if (typeof response.status != 'undefined' && response.status) {
            this.setState({
              loader: false,
              alertType: 'success',
              showAlert: true,
              alertBody: 'Message added successfully .'
            })
          } else {
            this.setState({
              loader: false,
              alertType: 'danger',
              showAlert: true,
              alertBody: 'Failed to add message'
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

  render () {
    
    return (
      <div>
        <Row>
            <Col xl="12">
              <Card>
                  <CardHeader>
                  {this.state.loader ? <Loader />: ''}
                  <i className="fa fa-align-justify"></i> Add Message{" "}
                <small className="text-muted">Form</small>
                <Link to="/message-list" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Message List</Link>
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
              <Form.Item label='Title'>
                  <Form.Item
                    hasFeedback
                    name='title'
                    rules={[
                      { required: true, message: 'Please Input Title!' }
                    ]}
                  >
                    <Input placeholder="Title" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='Description'>
                  <Form.Item
                    hasFeedback
                    name='description'
                    rules={[
                      { required: true, message: 'Please Input Description!' }
                    ]}
                  >
                    <Input placeholder="Description" />
                  </Form.Item>
              </Form.Item>
              <Form.Item label='Start Time'>
                  <Form.Item
                    hasFeedback
                    name='start_time'
                    rules={[
                      { required: true, message: 'Please Input Start Time!' }
                    ]}
                  >
                    <DatePicker placeholder="App Start Time!" />
                  </Form.Item>
              </Form.Item>
              
              <Form.Item label='End Time'>
                  <Form.Item
                    hasFeedback
                    name='end_time'
                    rules={[
                      { required: true, message: 'Please Input End Time!' }
                    ]}
                  >
                    <DatePicker placeholder="App End Time!" />
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
