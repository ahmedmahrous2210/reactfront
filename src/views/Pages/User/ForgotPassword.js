import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Link } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Radio } from "antd";
import { apiService } from "../../../admin/_services/api.service";
import Loader from "../../../Loader";
import AlertMsgComponent from "../../../AlertMsgComponent";

import bg_img_two from '../../../assets/img/brand/bg_img_two.png';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            componentSize: "middle",
            setComponentSize: "middle",
            loader: false,
            showAlert: false,
            alertType: "danger",
            alertBody: "",
        }
    }
    formRef = React.createRef();
    onReset = () => {
        this.formRef.current.resetFields();
    };

    onFinish = (values) => {
        let formData = values;
        this.setState({ loader: true, showAlert: false }, () => {
    
          apiService
            .recoverPassword(formData)
            .then((addUserResponse) => {
              if (
                typeof addUserResponse.success != "undefined" &&
                addUserResponse.success
              ) {
                this.onReset();
    
                this.setState({
                  loader: false,
                  showAlert: true,
                  alertType: "success",
                  alertBody: "Password reset Link send to your email.",
                });
              } else {
                this.setState({
                  loader: false,
                  showAlert: true,
                  alertType: "danger",
                  alertBody: "User already exist or invalid inputs."
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.setState({
                loader: false,
                showAlert: true,
                alertType: "danger",
                alertBody: "Something went wrong!",
              });
            });
        });
      };

    render() {
        const { componentSize } = this.state;

    const onFormLayoutChange = ({ size }) => {
      this.setState({
        setComponentSize: size,
        componentSize: size,
      });
      //this.state.setComponentSize = size;
    };
        return (
            <div className="animated fadeIn" style={{ background: `url(${bg_img_two})`,"top":"20%" }}>
 <Row>
            <Col xl="12">
              <Card>
              <CardHeader>
                  {this.state.loader ? <Loader />: ''}
                  <i className="fa fa-align-justify"></i> Forgot Password {" "}
                <small className="text-muted">Form</small>
                <Link to="/" className="btn btn-sm btn-success feature-btn fa fa-list">&nbsp; Sign In</Link>
                  </CardHeader>
                    {/* <Card > */}
                    <CardBody >
                        
                        {this.state.showAlert ? <AlertMsgComponent alertBody={this.state.alertBody} alertType={this.state.alertType} /> : ""}
                        <Form
                            ref={this.formRef}
                            name="forgotPassword"
                            onFinish={this.onFinish}
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 12,
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
                                    <Form.Item
                                        hasFeedback
                                        label="Email Id"
                                        name="email"
                                        rules={[
                                            {
                                              type: "email",
                                              message: "The input is not valid E-mail!",
                                            },
                                            { required: true, message: "Please input Email Id!" },
                                          ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <Button type="primary"
                        htmlType="submit"
                        
                        className="btn btn-success ant-col-offset-4"
                    >Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
                </Col>

                </Row>
            </div>

        );
    }
}