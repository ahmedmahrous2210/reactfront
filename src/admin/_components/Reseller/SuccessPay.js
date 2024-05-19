import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import {Button, Form, Radio } from 'antd';
import Loader from '../.././../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'


let localStorageData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
export default class SuccessPay extends Component {
    constructor(props) {
        
        super(props)
        //this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        const queryParams = new URLSearchParams(this.props.location.search);
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
            amount:200,
            comingSuccess:null,
            queryParams:queryParams,
            paymentStatus:null,
            orderStatus:null,
            orderId:null,
            serviceError:null
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

    componentDidMount(){
        this.startPaymentDetails();
    }


    startPaymentDetails = (values) =>{
        let queryParams = this.state.queryParams;
        const orderId = queryParams.get('order_id');
        let formData = {
            "module": 'MASA',
            "channelId": 'IBOPLAYERAPP',
            "requestId": 'IBOPLAYERAPP2',
            "requestData": {
                "userId":localStorageData.id,
                "orderId":orderId,
            },
            "isValid": true
        };
        this.setState({ loader: true }, () => {
            apiService
                .getPaymentDetails(formData)
                .then((userListData) => {
                    console.log(userListData, "userListData");
                    this.setState({
                        loader: false,
                        comingSuccess: true
                    });
                    if ( typeof userListData.status != "undefined" && userListData.status) {
                        this.setState({
                            paymentStatus:userListData.data.status,
                            amountPaid:userListData.data.amount_paid,
                            orderId:orderId
                        });
                    } else {
                        this.setState({
                            serviceError:userListData.msg
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
                            <i className='fa fa-align-justify' /> Payment Success {' '}
                            <small className='text-muted'>Credit Points</small>
                            {this.state.loader ? <Loader /> : ''}
                        </CardHeader>
                        <CardBody>
                            {this.state.showAlert ? (
                                <AlertMsgComponent
                                    alertBody={this.state.alertBody}
                                    alertType={this.state.alertType}
                                />
                            ) : ('')}
                            {this.state.comingSuccess === null ? 
                            <>Loading your payment details, please wait for sometime. :-)</>
                            :
                            this.state.serviceError !== null ? this.state.serviceError : 
                            this.state.paymentStatus === "error" ? <p>Your payment has been declined, please reintiate the new payment with credit points selection from <i><b>Recharge Credit</b></i></p>:
                            <section>
                                <p>Order Id: {this.state.orderId}</p>
                                <p>Payment Status: {this.state.paymentStatus}</p>
                                <p>Amount Paid: {this.state.amountPaid}</p>
                                {this.state.paymentStatus !== 'paid' ? <p>Your payment yet to be confirmed,
                                    however we have recieved your payment information, it will be updated after some duration. Please wait for sometime!</p>
                                : <p>Your Payment was successfully completed, hence your credit point is ready and will be alloted in sometime.
                                    You can refresh your credit points to check updated points. If still you find credit points not updated you can do logout and login again.</p>
                                }
                            </section>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
