import React, { Component } from "react";
import { Card, CardBody, CardFooter, Col, Container, Row } from "reactstrap";
import { Link } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Radio  } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { apiService } from "../../../admin/_services/api.service";
import Loader from "../../../Loader";
import AlertMsgComponent from "../../../AlertMsgComponent";

import bg_img_two from '../../../assets/img/brand/bg_img_two.png';
import styled from 'styled-components';
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


class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roleId: "5e9600fa0577f240fc7a293a",
      componentSize: "middle",
      setComponentSize: "middle",
      loader: false,
      successMsg: "",
      showAlert: false,
      alertType: "danger",
      alertBody: "",
      isEditForm: false,
      instituteId: '',
      instituteName: '',
      grade: '',
      userImage: false,
      userIdCard: false,
      editId: this.props.match.params.id || null,
      profileCaptureType: 'profile_upload',
      imageType:'profile',
      idCardCaptureType: 'id_upload',
      screenshot: [],
      personScreenshot:[],
      idCardScreenshot:[],
      captureScreeShot: true,
      profileRetake:false,
      idCardRetake:false
    };
  }

  formRef = React.createRef();
  onReset = () => {
    this.formRef.current.resetFields();
  };

  setRef = webcam => {
    this.webcam = webcam;
  };


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

  renderScreenShots = (screenshots) => (
    screenshots.map((record, index) => {
      return (
        <div key={index} style={{"marginBottom":"4px" }}>
          <img src={record} width="80%"  />
        </div>
      )
    })
  );

  

  handleCaptureClick = (e, type, retake) => {
    e.preventDefault();
    var screenshotValue = null;
    if(this.webcam && retake === false){
      var screenshotValue = this.webcam.getScreenshot();
    }    

    if(type === 'profile'){
      let personScreenshot = [...this.state.personScreenshot];
      personScreenshot = [];
      if(typeof retake !== 'undefined' && retake){
        this.setState({
          personScreenshot,
          userImage:false,
          profileRetake:false
        })
      }else{
        personScreenshot.push(screenshotValue);
        this.setState({
          personScreenshot,
          userImage:screenshotValue,
          imageType:'idCard',
          profileRetake:true,
          captureScreeShot: true
        });
      }
        
    }else if(type === 'idCard'){
      let idCardScreenshot = [...this.state.idCardScreenshot];
      idCardScreenshot = [];
      if(typeof retake !== 'undefined' && retake){
        this.setState({
          idCardScreenshot,
          userIdCard:false,
          idCardRetake:false
        })
      }else{
        idCardScreenshot.push(screenshotValue);
        this.setState({
          idCardScreenshot,
          userIdCard:screenshotValue,
          imageType:null,
          idCardRetake:true,
          captureScreeShot: true
        });
      }
      
    }
    
  }

  handleIdCardChange = info => {
    getBase64(info.file.originFileObj, userIdCard =>
      this.setState({
        userIdCard,
        loading: false,
      }),
    );
  }


  onFinish = (values) => {
    values.roleId = this.state.roleId;
    values.createdBy = "5e81fe938473744b056c2d2b";
    values.userImage = this.state.userImage
    values.userIdCard = this.state.userIdCard
    if (values.name.trim() === '') {
      this.setState({
        loader: false,
        showAlert: true,
        alertType: "danger",
        alertBody: "Name is required!",
      });
      return;
    }
    // if (values.username.trim() === '') {
    //   this.setState({
    //     loader: false,
    //     showAlert: true,
    //     alertType: "danger",
    //     alertBody: "Username is required!",
    //   });
    //   return;
    // }

    if (this.state.userImage === false) {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertBody: 'Please Upload User Image.',
      });
      return;
    }
    if (this.state.userIdCard === false) {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertBody: 'Please Upload Idcard Image.',
      });
      return;
    }
    let formData = values;
    this.setState({ loader: true, showAlert: false }, () => {

      apiService
        .registerUser(formData)
        .then((addUserResponse) => {
          if (
            typeof addUserResponse.success != "undefined" &&
            addUserResponse.success
          ) {
            this.onReset();
        
            this.setState({
              userImage:false,
              userIdCard:false,
              loader: false,
              showAlert: true,
              alertType:"success",
              alertBody:"Thank you for registration! Your account should be approved within 24 hours.",
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
      <div style={{ background: `url(${bg_img_two})` }}>

          
      </div>
    );
  }
}

export default Register;
