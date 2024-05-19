import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime, formatDate } from "../../_helpers/helper";
import { Popconfirm, Modal, Button } from "antd";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from  '../../../Loader';
import EditUser from "./EditUser";
import ProfileDetail from  "./ProfileDetail";

import { MDBDataTable } from 'mdbreact';
const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
const verifyImageStatus = (isVerifiedImage) => {
  if(typeof isVerifiedImage == 'undefined' || isVerifiedImage === null || isVerifiedImage ==''){
    return "Not uploaded";
  }else if(isVerifiedImage == 'A'){
    return "Approved"
  }else if(isVerifiedImage == 'P'){
    return "Pending"
  }else if(isVerifiedImage == 'R'){
    return "Rejected"
  }
}
let localStorageData = JSON.parse(
  localStorage.getItem('userData_' + localStorage.getItem('token'))
)
class Users extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loader:false,
      usersData: [],
      listCount: 25,
      setCurrentPage: 0,
      currentPage: 0,
      editPage:false,
      editData:null,
      modalVisible:false,
      confirmLoading:false,
      modalBodyContent:'',
      imageApproveComment:'',
      profileModalVisible:false,
      moduleFrom:''
    };
    
    this.closeProfileModal = this.closeProfileModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeProfileModal = () => {
    this.setState({
      profileModalVisible:false
    });
  }

  openProfileModal = (userData) => {
    this.setState({
      profileModalVisible:true
    });
    this._fetchUserDetail(userData._id, 'profilePage');
  }


  editUser = (editData) =>{
    this.setState({
      editData:editData,
      editPage:true
    });
  }

  returnEditData = (editData) =>{
    if(editData){
      this.state.usersData.map((user, index) => {
        if(user.id === editData.id){
          user = editData
        }
      })
    }
  }


  deleteUser(userId, status, isDeleteClicked, index) {
    
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .removeUser(userId, status)
        .then((deletedData) => {

          if (typeof deletedData.status != "undefined" && deletedData.status) {
            if (isDeleteClicked) {
              this.state.usersData.splice(index, 1)
              
            } else {
              this.state.usersData.map((user, arrIndex) => {
                if (user.id === userId) {
                  user.status = status
                }
              })
              
            }
              
            this.setState({
              loader:false,
              usersData : this.state.usersData
            });
          } else {
            this.setState({
              loader:false,
              showAlert: true,
              alertType: "danger",
              alertBody: "Failed to save changes!",
            });
          }
        }).catch((error) => {
          this.setState({
            loader:false,
            showAlert: true,
            alertType: "danger",
            alertBody: "Something went wrong!",
          });
        });
    });
  }

  _fetchUserList(pageNum) {
    let formData = {
      "ipageNum": pageNum,
      "module":'MASA',
      "channelId":'MASAPLAYER',
      "requestId" :'IBOPLAYERAPP2',
      "requestData":{
        "resellerId":localStorageData.id,
        "groupId":localStorageData.roleId
      },
      "isValid": true
    };
    apiService
      .userList(formData)
      .then((userListData) => {
        
        if (
          typeof userListData.status != "undefined" &&
          userListData.status
        ) {
          this.setState({
            usersData: userListData.data.IBOMasaUser,
          });
        } else {
          this.setState({
            showAlert: true,
            alertType: "danger",
            alertBody: "Failed to load users!",
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
  }

  componentDidMount() {
    if(this.props.userList !== undefined && this.props.userList.length  > 0){
      this.setState({
        usersData: this.props.userList,
        moduleFrom: this.props.moduleFrom ? this.props.moduleFrom : ""
      });
    }else{
      this._fetchUserList(0);
    }
    
  }

  listView(value){
    if(value){
      this.setState({
        editPage:false
      });
    }
  }

  imageApproveCommentChange = (e) => {
    let value = e.target.value;
    
    value.replace(/\s/g, "");
    this.setState({
      imageApproveComment:value
    });
  }

  modalBodyContent = (userData) => {
    return(<div className="col-md-12 row">
    <div className="col-md-6">
      <img src={userData.userImage} className="img-responsive img-thumbnail"></img>
    </div>
    <div className="col-md-6">
    <img src={userData.userIdCard}  className="img-responsive img-thumbnail"></img>
    </div>
    <div className="col-md-9"><label htmlFor="imageApproveComment">Review: </label><input id="imageApproveComment"
     className="form-control" placeholder="Review Comment" name="imageApproveComment" 
     onChange={(e) => this.imageApproveCommentChange(e)} /></div>
  </div>)};

  showImageVerifyModal(userData){
    if(typeof userData.isVerifiedImage == 'undefined'){
      return;
    }
    this.setState({
      modalVisible:true
    });
    this._fetchUserDetail(userData._id);
  }

  closeModal(){
    this.setState({
      modalVisible:false
    });
  }

  _fetchUserDetail(userId, profileData) {
    let formData = {
      "module":'MASA',
      "channelId":'MASAPLAYER',
      "requestId" :'IBOPLAYERAPP2',
      "requestData":{
        "resellerId":localStorageData.id,
        "userId":userId,
      },
      "isValid": true
    };
    this.setState({ loader: true }, () => {
      apiService
        .getUserDetailsById(formData)
        .then((userListData) => {
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            let modalTitle = userListData.data.name;
            let modalBody = typeof profileData !== 'undefined' && profileData === 'profilePage' ? <ProfileDetail userData={userListData.data} /> : this.modalBodyContent(userListData.data);
            this.setState({
              userId:userListData.data._id,
              modalTitle:modalTitle,
              modalBodyContent:modalBody
            });
          } else {
            this.setState({
              showAlert: true,
              alertType: "danger",
              alertBody: "Failed to load user data!",
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

  imageVerificationMethod = (userId, status) => {
    let formData = {isVerifiedImage:status, imageApproveComment:this.state.imageApproveComment}
    this.setState({ loader: true }, () => {
      this.setState({
            modalVisible:false
      })
      apiService
        .editUser(userId, formData)
        .then(addUserResponse => {
          this.setState({
            loader: false,
            modalVisible:false
          })
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            //this.set
            toast.success("Succesfully updated verification status.", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
            
            
          } else {
            toast.error("Failed to update user image verification!", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
          }
        })
        .catch(error => {
          console.log(error)
          this.setState({
            loader: false,
            modalVisible:false
          })
          toast.error("Sommething went wrong, please try again.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        })
    })
  }
  
  userTable = (user, index) => {
    const getBadge = (status) => {
      return status == "1"
      ? "success"
      : status == "0"
      ? "secondary"
      : status === "pending"
      ? "warning"
      : status === "deleted"
      ? "danger"
      : "primary";
    };
    const changeStatusTo = user.status == '1' ? 0 : 1;
    const _changeStatusTo = user.status == '1' ? 'inactivate' : 'activate';
    const statusChangeMessage =
      'Are you sure, you want to change status of this user to ' +
      _changeStatusTo +
      '?'
    const statusTitle = 'Click to ' + _changeStatusTo
    return({
          // appType: user.app_type,
          expiry_date: (user.box_expiry_date != null) ? formatDate(user.box_expiry_date) : 'NA',
          //rolename: user.roleId.rolename,
          createdAt: (user.created_at != null) ? formatDateTime(user.created_at) : 'NA',
          usedCredit: user.credit_point,
          activatedBy:user?.reseller_detail?.email,
          mac_address: user.mac_address,
          module: user.module,
          platform:user.activated_from,
          remarks:user.comment,
          isTrail:(user.is_trial === 0  && user.module === "MASA") ? "Inactive" : (user.is_trial === 1  && (user.module === "IBOAPP" || (user.module === "VIRGINIA"))) ? "Inactive": "Active",
        
        //   action: (user.id === loggegdInData.id) ? '':<div>
        //     {this.state.moduleFrom !== '' ? <Button type="primary" style={{"left":"16%","padding": "0.34rem 2.0rem"}}
        //     className="btn btn-success" onClick={() => this.editUser(user)} >Activate</Button>:
        //   <span><Link to="#" onClick={() => this.editUser(user)}>
        //     <i className='fa fa-edit' /> &nbsp;|&nbsp;{' '}
        //   </Link>
        //   <Popconfirm
        //   title="Are you sure to delete this user?"
        //   onConfirm={() => this.deleteUser(user.id,2, true, index)}
        //   okText="Yes"
        //   cancelText="No"
        // >
        //   <Link to='#'>
        //     <i className='fa fa-remove' />
        //   </Link>
        // </Popconfirm></span>}
          
        //   </div>    
        })
  }
  
  render() {
    
    const userList = this.state.usersData.filter((user) => user.id);
    
    const data = {
      columns: [
        // {
        //   label: 'App Name',
        //   field: 'appType',
        // },
        {
          label:'App Name',
          field:'module'
        },
         {
           label: 'Mac Address',
           field: 'mac_address',
         },
         {
          label: 'Activated By',
          field: 'activatedBy',
        },
         
         {
          label: 'Expiry Date',
          field: 'expiry_date',
        },
        {
          label:'Used Credit',
          field:'usedCredit'
        },
        {
          label:'Remarks',
          field:'remarks'
        },
        {
          label:'Platform',
          field:'platform'
        },
        {
          label: 'Activated On',
          field: 'createdAt',
        },
        
        
        // {
        //   label: 'Action',
        //   field: 'action',
        // }       
      ],
      rows:userList.map((user, index) => this.userTable(user,index))
    };
    const {userId, modalVisible, profileModalVisible, modalTitle, modalBodyContent, confirmLoading} = this.state;
    return (
      <div className="animated fadeIn">
        <ToastContainer />
        {profileModalVisible ? <Modal title={modalTitle}
          visible={profileModalVisible}
          onOk={() => this.closeProfileModal()}
          confirmLoading={confirmLoading}
          onCancel={() => this.closeProfileModal()}
          cancelText="Cancel"
          okText="Ok"
          zIndex="1000"
          width="auto"
          style={{"paddingLeft":"7%", "paddingRight":"7%"}}
        >
          {modalBodyContent}
        </Modal> : null}
        {this.state.loader ? <Loader />: null}
        {this.state.editPage ? <EditUser editData={this.state.editData} backToList={(value) => this.listView(value)}  returnEditData={(editData) => this.returnEditData(editData)} moduleFrom={this.state.moduleFrom}/>:
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
              {this.state.loader ? <Loader />: null}
                <i className="fa fa-align-justify"></i> Users{" "}
                <small className="text-muted">List</small>
                {/* {this.props.userList !== undefined && this.props.userList.length  > 0 ? '' 
                :<Link to="add-user" className="btn btn-sm btn-info feature-btn fa fa-plus">&nbsp;Add User</Link>} */}
                
              </CardHeader>
              <CardBody>
              <MDBDataTable
                striped
                noBottomColumns={true}
                responsive={true}
                bordered
                hover
                data={data}
              />
                {/* <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.usersData.map((user, index) => (
                      this.userRows(user,index)
                    ))}
                  </tbody>
                </Table> */}
              </CardBody>
            </Card>
          </Col>
          <Modal title={modalTitle}
          visible={modalVisible}
          onOk={() => this.imageVerificationMethod(userId, 'A')}
          confirmLoading={confirmLoading}
          onCancel={this.closeModal}

          cancelText="Reject Image"
          okText="Approve Image"
          zIndex="1000"
          footer={[
            <Button key="back" onClick={() => this.imageVerificationMethod(userId, 'R')}>
              Reject
            </Button>,
            <Button key="submit" type="primary" loading={confirmLoading} onClick={() => this.imageVerificationMethod(userId, 'A')}>
              Approve
            </Button>,
          ]}
        >
          {modalBodyContent}
        </Modal>
        </Row>
         }
      </div>
    );
  }
}
const userClass = new Users();
export default Users;
