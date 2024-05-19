import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { Popconfirm, Modal, Button, Form, Input } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../Loader';

import { MDBDataTable } from 'mdbreact';
import AlertMsgComponent from "../../../AlertMsgComponent";
import TextArea from "antd/lib/input/TextArea";
const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));

export default class AddTicketComponent extends Component{

    constructor(props){
        super();
        this.state = {
            componentSize: 'middle',
            setComponentSize: 'middle',
        }
    }

    formRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };

    onFinish = (values) => {        
        values.created_by = loggegdInData.id;
        values.group_id = '2';
        values.module = 'MASA';
        values.channelId = 'MASAPLAYER';
        values.requestId = 'IBOPLAYERAPP2';
        values.requestData = {
            title:values.subject,
            description:values.description,
            createdBy:loggegdInData.id
        };

        this.setState({ loader: true, showAlert: false }, () => {

            apiService.addTicket(values).then((addTicket) => {
                console.log("addTicket", addTicket);
                if (typeof addTicket.status != 'undefined' && addTicket.status) {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'success',
                        alertBody: 'Ticket generated successfully',
                        userIdCard: false,
                        imageUrl: false
                    });
                    this.onReset();
                } else {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Ticket creation failed!',
                    });
                }
            }).catch(error => {
                console.log(error);
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
                                <i className="fa fa-align-justify"></i> Add Ticket{" "}
                                <small className="text-muted">Form</small>
                                <Link to="/my-tickets" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; My Tickets</Link>
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
                                >
                                
                                    <div className="col-md-12 row">
                                        <div className="col-md-8">
                                            <Form.Item hasFeedback label="Subject" name="subject"
                                                rules={[
                                                    { required: true, message: "Please input Subject" }
                                                ]}>
                                                <Input />
                                            </Form.Item>
                                            
                                            <Form.Item hasFeedback label="Description" name="description" 
                                                rules={[
                                                    { required: true, message: "Please input Subject!"},
                                                    { whitespace: true, message: "Should not contain whitespace." }
                                                ]}>
                                                <TextArea />
                                            </Form.Item>
                                            
                                        </div>
                                    </div>
                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"
                                    >Submit</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };
}