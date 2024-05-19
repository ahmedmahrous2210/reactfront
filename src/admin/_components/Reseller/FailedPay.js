import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import Loader from '../.././../Loader'
export default class FailedPay extends Component {
    constructor(props) {        
        super(props)
        const queryParams = new URLSearchParams(this.props.location.search);
        this.state = {
            componentSize: 'middle',
            setComponentSize: 'middle',
            loader: false,
            successMsg: '',
            showAlert: false,
            alertType: 'danger',
            queryParams:queryParams,
            orderId:queryParams.get('order_id')
        }
    }

    render() {

        return (
            <Row>
                <Col xl='12'>
                    <Card>
                        <CardHeader>
                            <i className='fa fa-align-justify' /> Payment Failed {' '}
                            <small className='text-muted'>Credit Points</small>
                        </CardHeader>
                        <CardBody>
                            <p>Your payment was failed for <i><b>Order Id:{this.state.orderId}</b></i> , however you an try again to buying credit points.</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
