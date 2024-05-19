import React, { Component } from 'react'
import { Form, Input, Button, Modal} from 'antd';
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import { apiService } from '../../_services/api.service'
export default class UpdatePassword extends Component {
    constructor(props) {

        super(props)
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
            disableBtn: false,
            moduleFrom: "",
            verified: false,
        }
        
        
    }

    formRef = React.createRef()

    componentDidMount = () => {


    }

    onLoad = () => {
        this.setState({
            captchaReady: true
        });
    };

    onReset = () => {
        this.formRef.current.resetFields()
    }

      
    onFinish = values => {
        let localStorageData = JSON.parse(
            localStorage.getItem('userData_' + localStorage.getItem('token'))
        )
        let formData = {};
        formData.channelId = 'MASAPLAYER';
        formData.requestId = 'IBOPLAYERAPP2';
        formData.requestData = {
            groupId: localStorageData.roleId,
            userId: localStorageData.id,
            password: values.password,
        };
        
        this.setState({ loader: true, showAlert: false }, () => {

            apiService
                .updatePassword(formData)
                .then(addUserResponse => {
                    if (
                        typeof addUserResponse.status != 'undefined' &&
                        addUserResponse.status
                    ) {
                        
                        Modal.success({
                            title: 'Password updation',
                            content: (
                              <div>
                                <p>Password updated succesfully, Please logout and login again!</p>
                              </div>
                            ),
                            onOk() {},
                        });
                        setTimeout(() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userData_'+localStorage.getItem('token'));
                            window.location = "/";
                        }, 3000);
                        
                    } else {
                        Modal.warning({
                            title: 'Password updation',
                            content: (
                              <div>
                                <p>Password updated Failed!</p>
                              </div>
                            ),
                            onOk() {},
                        });
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

        return (
            <Row>
                <Col xl='12'>
                    <Card>
                        <CardHeader>
                            <i className='fa fa-align-justify'>Update Password</i>
                        </CardHeader>
                        <CardBody>
                            <Form
                                ref={this.formRef}
                                name='update-paassword'
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
                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your password!',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input.Password />
                                        </Form.Item>

                                        <Form.Item
                                            name="confirm"
                                            label="Confirm Password"
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please confirm your password!',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>

                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>

                                <Button type="primary"
                                    htmlType="submit"
                                    style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                    className="btn btn-success ant-col-offset-3"
                                // disabled={!this.state.verified}
                                >{this.state.moduleFrom !== "" ? "Activate" : "Update"}</Button>

                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
