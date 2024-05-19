import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Webcam from "react-webcam";
import styled from 'styled-components';
import { Form, Input, Button, Select, Upload, message, Radio } from 'antd'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap'
import { apiService } from '../../../admin/_services/api.service'
import Loader from '../.././../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent';

const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
const userId = loggegdInData.id;

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
const Styled = {
    Root: styled.div`
      position: relative;
      width: 100vw;
      height: 55vh;
      overflow: hidden;
      max-height: 70%;
    `,
    Webcam: styled(Webcam)`
      left: 0%;
      width: 100% !important;
      top: 0px;
      min-height: auto !important;
      left: 0px;
      right: 0px;
      bottom: 0px;
      min-width: 80% !important;
      max-width: 80% !important;
    `,
}

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            componentSize: 'middle',
            setComponentSize: 'middle',
            loader: false,
            successMsg: '',
            showAlert: false,
            alertType: 'danger',
            alertBody: '',
            isEditForm: false,
            rolesData: [],
            name: '',
            lastName: '',
            username: '',
            email: '',
            instituteId: '',
            instituteName: '',
            grade: '',
            userImage: '',
            userIdCard: '',
            profileCaptureType: 'profile_upload',
            imageType: 'profile',
            idCardCaptureType: 'id_upload',
            screenshot: [],
            personScreenshot: [],
            idCardScreenshot: [],
            captureScreeShot: true,
            profileRetake: false,
            idCardRetake: false

        }

        this.handleInputOnChange = this.handleInputOnChange.bind(this)
    }

    formRef = React.createRef()

    setRef = webcam => {
        this.webcam = webcam;
    };

    renderWebcam = () => (
        <Styled.Webcam audio={false} screenshotwidth={200}
            videoConstraints={{ facingMode: 'user', width: 400, height: 230 }}
            ref={this.setRef} onUserMedia={() => this.webCamStarted(this)} screenshotFormat="image/webp" />
    )

    onProfileUploadType = (e) => {
        this.setState({
            profileCaptureType: e.target.value
        });
    }

    onIdCardUploadType = (e) => {
        this.setState({
            idCardCaptureType: e.target.value
        });
    }

    renderScreenShots = (screenshots) => (
        screenshots.map((record, index) => {
            return (
                <div key={index} style={{ "marginBottom": "4px" }}>
                    <img src={record} width="80%" />
                </div>
            )
        })
    );

    webCamStarted() {
        this.setState({
            enableCaptureButton: false
        });
    }

    handleCaptureClick = (e, type, retake) => {
        e.preventDefault();
        var screenshotValue = null;
        if (this.webcam && retake === false) {
            var screenshotValue = this.webcam.getScreenshot();
        }

        if (type === 'profile') {
            let personScreenshot = [...this.state.personScreenshot];
            personScreenshot = [];
            if (typeof retake !== 'undefined' && retake) {
                this.setState({
                    personScreenshot,
                    userImage: false,
                    profileRetake: false
                })
            } else {
                personScreenshot.push(screenshotValue);
                this.setState({
                    personScreenshot,
                    userImage: screenshotValue,
                    imageType: 'idCard',
                    profileRetake: true,
                    captureScreeShot: true
                });
            }

        } else if (type === 'idCard') {
            let idCardScreenshot = [...this.state.idCardScreenshot];
            idCardScreenshot = [];
            if (typeof retake !== 'undefined' && retake) {
                this.setState({
                    idCardScreenshot,
                    userIdCard: false,
                    idCardRetake: false
                })
            } else {
                idCardScreenshot.push(screenshotValue);
                this.setState({
                    idCardScreenshot,
                    userIdCard: screenshotValue,
                    imageType: null,
                    idCardRetake: true,
                    captureScreeShot: true
                });
            }

        }

    }
    componentDidMount = () => {
        this._fetchUserDetail(userId);
    }

    onReset = () => {
        this.formRef.current.resetFields()
    }

    handleInputOnChange = e => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;


    }


    handlePhotoChange = info => {
        getBase64(info.file.originFileObj, userImage =>
            this.setState({
                userImage,
                loading: false,
            }),
        );
        // if (info.file.status === 'uploading') {
        //   this.setState({ loading: true });
        //   return;
        // }
        // if (info.file.status === 'done') {
        //   // Get this url from response in real world.
        //   getBase64(info.file.originFileObj, imageUrl =>
        //     this.setState({
        //       imageUrl,
        //       loading: false,
        //     }),
        //   );
        // }
    };

    handleIdCardChange = info => {
        getBase64(info.file.originFileObj, userIdCard =>
            this.setState({
                userIdCard,
                loading: false,
            }),
        );
    }

    _fetchUserDetail(userId) {
        this.setState({ loader: true, error: [] }, () => {
            apiService.userDetail(userId).then((response) => {
                this.setState({
                    loader: false,
                });
                if (response.success) {
                    this.setState({
                        userData: response.data,
                        roleData: response.data.roleId,
                        name: response.data.name,
                        lastName: response.data.lastName,
                        username: response.data.username,
                        email: response.data.email,
                        instituteId: response.data.instituteId,
                        instituteName: response.data.instituteName,
                        grade: response.data.grade,
                        userImage: response.data.userImage,
                        userIdCard: response.data.userIdCard
                    });
                    this.formRef.current.setFieldsValue({
                        name: this.state.name,
                        username: this.state.username,
                        email: this.state.email,
                        lastName: this.state.lastName,
                        instituteId: this.state.instituteId,
                        instituteName: this.state.instituteName,
                        grade: this.state.grade,
                        userImage: this.state.userImage,
                        userIdCard: this.state.userIdCard,
                    });
                } else {
                    this.setState({
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Failed to load user detail!',
                    });
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    showAlert: true,
                    alertType: 'danger',
                    alertBody: 'Something went wrong!',
                });
            });
        });
    }



    onFinish = values => {
        let localStorageData = JSON.parse(
            localStorage.getItem('userData_' + localStorage.getItem('token'))
        )
        values.updatedBy = localStorageData.id
        values.userImage = this.state.userImage
        values.userIdCard = this.state.userIdCard
        if(localStorageData.userImage != this.state.userImage){
            values.isVerifiedImage = 'P';
        }
        let formData = values
        this.setState({ loader: true, showAlert: false }, () => {
            this.onReset()
            apiService
                .editUser(localStorageData.id, formData)
                .then(addUserResponse => {
                    if (
                        typeof addUserResponse.success != 'undefined' &&
                        addUserResponse.success
                    ) {
                        var verifiedImageStatus = localStorageData.isVerifiedImage;
                        var imgaeUpdtMsg = '';
                        if(localStorageData.userImage != this.state.userImage){
                            verifiedImageStatus = 'P';
                            imgaeUpdtMsg = 'You have updated profile image, proctor has to approve!';
                        }
                        localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 
                            'id':localStorageData.id,
                            'email': localStorage.email,
                            'username': values.username,
                            'roleId':localStorageData.roleId,
                            'isVerifiedImage':verifiedImageStatus,
                            'userImage':this.state.userImage,
                            'userIdCard':this.state.userIdCard,
                            'imageApproveComment':localStorageData.imageApproveComment,
                            'roleName':localStorageData.roleName}
                        ));
                        //localStorage.setItem("persons", JSON.stringify(persons));
                        this.setState({
                            loader: false,
                            showAlert: true,
                            alertType: 'success',
                            alertBody: 'Profile updated successfully'
                        })
                        setTimeout(function(){
                            window.location.reload(true);
                        }, 1000);
                    } else {
                        this.setState({
                            loader: false,
                            showAlert: true,
                            alertType: 'danger',
                            alertBody: 'Failed to update profile!'
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
        const { componentSize } = this.state

        const onFormLayoutChange = ({ size }) => {
            this.setState({
                setComponentSize: size,
                componentSize: size
            })

        }

        const uploadUserButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload User Image</div>
            </div>
        );
        const uploadIdCardButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload IdCard Image</div>
            </div>
        );
        const { userImage, userIdCard, personScreenshot, idCardScreenshot, profileRetake, idCardRetake } = this.state;

        return (
            <Row>
                <Col xl='12'>
                    <Card>
                        <CardHeader>
                            <i className='fa fa-align-justify' /> User Profile{' '}
                            <small className='text-muted'>{this.state.name}</small>
                            {this.state.loader ? <Loader /> : ''}

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
                                    size: componentSize
                                }}
                                onValuesChange={onFormLayoutChange}
                                size={componentSize}
                            >
                                <div className="col-md-12 row">
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <Form.Item
                                            hasFeedback
                                            label='First Name'
                                            name='name'
                                            rules={[{ required: true, message: 'Please input Name!' }]}
                                        >
                                            <Input
                                                name='name'
                                                defaultValue={this.state.name}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            hasFeedback
                                            label='Last Name'
                                            name='lastName'
                                            rules={[{ required: true, message: 'Please input Last Name!' }]}
                                        >
                                            <Input
                                                name='name'
                                                defaultValue={this.state.lastName}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            hasFeedback
                                            label='Institute Name'
                                            name='instituteName'
                                            rules={[]}
                                        >
                                            <Input
                                                name='instituteName'
                                                defaultValue={this.state.instituteName}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            hasFeedback
                                            label='Institute Id'
                                            name='instituteId'
                                            rules={[]}
                                        >
                                            <Input
                                                name='instituteId'
                                                defaultValue={this.state.instituteId}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item>
                                        {/* <Form.Item
                                            hasFeedback
                                            label='Class/Grade'
                                            name='grade'
                                            rules={[]}
                                        >
                                            <Input
                                                name='grade'
                                                defaultValue={this.state.grade}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item> */}
                                        {/* <Form.Item
                                            hasFeedback
                                            label='Username'
                                            name='username'
                                            rules={[

                                            ]}
                                        >
                                            <Input
                                                name='username'
                                                defaultValue={this.state.username}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item> */}
                                        <Form.Item
                                            hasFeedback
                                            label='Email Id'
                                            name='email'
                                            rules={[
                                                {
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!'
                                                },
                                                { required: true, message: 'Please input Email Id!' }
                                            ]}
                                        >
                                            <Input
                                                name='email'
                                                defaultValue={this.state.email}
                                                onChange={this.handleInputOnChange}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                        <strong>Profile Image:</strong><br />
                                        <Radio.Group onChange={e => this.onProfileUploadType(e)} value={this.state.profileCaptureType}>
                                            <Radio value="profile_upload">Upload</Radio>
                                            <Radio value="profile_webcam">Webcam</Radio>
                                        </Radio.Group>
                                        {this.state.profileCaptureType === 'profile_upload' ?
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action={this.avatarUpload}
                                                beforeUpload={beforeUpload}
                                                onChange={this.handlePhotoChange}
                                            >
                                                {userImage ? <img src={userImage} className="img-responsive" alt="avatar" style={{ width: '100%', maxHeight: '210px' }} /> : uploadUserButton}
                                            </Upload>
                                            : <div style={{"paddingTop":"10%"}}>{personScreenshot.length > 0 ? this.renderScreenShots(personScreenshot) : this.renderWebcam()}
                                                <Link to="#" className='capture_btn ant-btn ant-btn-primary'
                                                    onClick={(e) => this.handleCaptureClick(e, 'profile', profileRetake)} htmltype="button">
                                                    {profileRetake ? 'Retake' : 'Capture'}
                                                </Link>
                                            </div>}
                                        
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                    <strong>Id Card Image: </strong><br />
                                        <Radio.Group onChange={e => this.onIdCardUploadType(e)} value={this.state.idCardCaptureType}>
                                            <Radio value="id_upload">Upload</Radio>
                                            <Radio value="id_webcam">Webcam</Radio>
                                        </Radio.Group>
                                        {this.state.idCardCaptureType === 'id_upload' ?
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action={this.idCardUpload}
                                                beforeUpload={beforeUpload}
                                                onChange={this.handleIdCardChange}
                                            >
                                                {userIdCard ? <img src={userIdCard} className="img-responsive" alt="avatar" style={{ width: '100%', maxHeight: '210px' }} /> : uploadIdCardButton}
                                            </Upload>
                                            : <div style={{"paddingTop":"10%"}}>{idCardScreenshot.length > 0 ? this.renderScreenShots(idCardScreenshot) : this.renderWebcam()}
                                                <Link to="#" className='capture_btn ant-btn ant-btn-primary'
                                                    onClick={(e) => this.handleCaptureClick(e, 'idCard', idCardRetake)} htmltype="button">
                                                    {idCardRetake ? 'Retake' : 'Capture'}
                                                </Link>
                                            </div>}
                                    </div>
                                </div>

                                <Button
                                    htmlType='submit'
                                    type='primary'
                                    className='ant-col-6 ant-col-offset-3'
                                    shape='round'
                                >
                                    Submit
                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
