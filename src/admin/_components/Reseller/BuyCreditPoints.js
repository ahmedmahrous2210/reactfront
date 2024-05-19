import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import {Button, Form, Radio } from 'antd';
import Loader from '../.././../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'


let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
export default class BuyCreditPoints extends Component {
    constructor(props) {

        super(props)
        //this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
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
            expiryDate: '',
            userObj:{},
            creditPoint:100,
            paymentUrl:'',
            orderId:null,
            amount:200
        }
        if (this.props.rolesData) {
            this.setState({
                rolesData: this.props.rolesData
            })
        }
        this.handleInputOnChange = this.handleInputOnChange.bind(this)
    }

    formRef = React.createRef()

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    startPayment = (values) =>{
        let formData = {
            "module": 'MASA',
            "channelId": 'IBOPLAYERAPP',
            "requestId": 'IBOPLAYERAPP2',
            "requestData": {
                "userId":localStorageData.id,
                "creditPoint":this.state.creditPoint,
                "orderId":Date.now()
            },
            "isValid": true
        };
        this.setState({ loader: true }, () => {
            apiService
                .getPassimPaymentLink(formData)
                .then((userListData) => {
                    console.log(userListData, "userListData");
                    this.setState({
                        loader: false
                    });
                    if ( typeof userListData.status != "undefined" && userListData.status) {
                        this.setState({
                            paymentUrl:userListData.data.paymentUrl,
                            orderId:userListData.data.orderId,
                            amount:userListData.data.amount
                        });
                    } else {
                        this.setState({
                            showAlert: true,
                            alertType: "danger",
                            alertBody: "Failed to load data!",
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

    getBySelection = (e) => {
        this.setState({
            creditPoint:e.target.value
        });
        
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
                            <i className='fa fa-align-justify' /> Buy Credit {' '}
                            <small className='text-muted'>Points</small>
                            {this.state.loader ? <Loader /> : ''}
                        </CardHeader>
                        <CardBody>
                            {this.state.showAlert ? (
                                <AlertMsgComponent
                                    alertBody={this.state.alertBody}
                                    alertType={this.state.alertType}
                                />
                            ) : ('')}
                            {this.state.paymentUrl !== '' ? 
                            <a href={this.state.paymentUrl}>Click here to start payment</a>
                            :
                            <Form
                                    ref={this.formRef}
                                    name='register'
                                    onFinish={this.startPayment}
                                    labelCol={{
                                        span: 8
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
                                    <div className="selection-type-radio" style={{"padding":"10px"}}>
                                        <i>Select Credit Points</i><br /><br />
                                 
                            <Radio.Group name="productType" defaultValue="100" onChange={(e) => this.getBySelection(e)}>
                                {/* <Radio value="5">5 Credit ($10)</Radio>
                                <Radio value="100">100 Credit ($200)</Radio>
                                <Radio value="200">200 Credit ($400)</Radio>
                                <Radio value="500">500 Credit ($700)</Radio> */}
                                <Radio value="1000">1000 Credit ($1250)</Radio>
                            </Radio.Group>
                            <Button type="primary"
                                htmlType="submit"
                                style={{ "left": "1%", "padding": "0.34rem 2.0rem" }}
                                className="btn btn-success ant-col-offset-3"
                            >Proceed </Button>
                            </div>
                            
                            </Form>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
