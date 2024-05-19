import React, { Component } from 'react'
import { Form, Input, Button, Select, Upload, message, DatePicker } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap'
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
export default class ClientDetail extends Component {
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
            expiryDate: '',
            userObj:{}
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
        this._fetchUserDetail();
    }

    _fetchUserDetail() {
        let formData = {
            "module": 'MASA',
            "channelId": 'IBOPLAYERAPP',
            "requestId": 'IBOPLAYERAPP2',
            "requestData": {
                "requestedBy":localStorageData.id,
                "requestedGroupId":localStorageData.roleId,
            },
            "isValid": true
        };
        this.setState({ loader: true }, () => {
            apiService
                .getClientDetail(formData)
                .then((userListData) => {
                    this.setState({
                        loader: false
                    });
                    if ( typeof userListData.status != "undefined" && userListData.status) {
                        this.setState({
                            userObj:userListData.data.MasaClient
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
                            <i className='fa fa-align-justify' /> Masa Profile {' '}
                            <small className='text-muted'>Detail</small>
                            {this.state.loader ? <Loader /> : ''}
                        </CardHeader>
                        <CardBody>
                            {this.state.showAlert ? (
                                <AlertMsgComponent
                                    alertBody={this.state.alertBody}
                                    alertType={this.state.alertType}
                                />
                            ) : ('')}
                            {this.state.userObj !== ''? <div className="text-center">
                                <p><b>Channel Name:</b> <i>{this.state.userObj.channel_name}</i></p>
                                <p><b>Client Id:</b> <i>{this.state.userObj.client_id}</i></p>
                                <p><b>Secret Key:</b> <i>{this.state.userObj.secret_key}</i></p>
                                <p><b>Remaining Credit Point:</b> <i>{this.state.userObj.credit_point}</i></p>
                            </div>: null}
                            
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
