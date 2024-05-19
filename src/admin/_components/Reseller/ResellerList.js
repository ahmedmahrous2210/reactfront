import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { Popconfirm, Modal, Button, Input } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../Loader';
import EditReseller from "./EditReseller";

import { MDBDataTable } from 'mdbreact';
import SubResellerAssignment from "./SubResellerAssignment";
const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));

var creditPoint = '';
var updateCreditValErr = '';

class ResellerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      usersData: [],
      userId: false,
      listCount: 25,
      setCurrentPage: 0,
      currentPage: 0,
      editPage: false,
      editData: null,
      modalVisible: false,
      confirmLoading: false,
      modalBodyContent: '',
      updateCreditPointVal: 0,
      debitCreditPointVal: 0,
      profileModalVisible: false,
      updateCreditValErrMsg: false,
      assignToReseller: false,
      showInvalidCredit:false,
      creditModType:'',
      userObj:{},
      showCreditSharePasswordModal:false,
      creditSharePasswordModalBodyContent: null,
      creditSharePassword:null,
      registerCreditSharePass:null,
      firstTimeRegister: false

    };
    this.closeProfileModal = this.closeProfileModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateCreditPointValChange = this.updateCreditPointValChange.bind(this);
    this.modalBodyContent = this.modalBodyContent.bind(this);
  }


  closeProfileModal = () => {
    this.setState({
      profileModalVisible: false
    });
  }

  openProfileModal = (userData) => {
    this.setState({
      profileModalVisible: true
    });
    this._fetchUserDetail(userData._id, 'profilePage');
  }


  editUser = (editData) => {
    this.setState({
      editData: editData,
      editPage: true
    });
  }

  returnEditData = (editData) => {
    if (editData) {
      this.state.usersData.map((user, index) => {
        if (user.Reseller.id === editData.id) {
          user = editData
        }
      })
    }
  }


  deleteUser(userId, status, isDeleteClicked, index) {
    let formData = {
      "isValid": true,
      "channelId": "MASAPLAYER",
      "module": "MASA",
      "requestId": "IBOPLAYERAPP2",
      "requestData": {
        "createdBy": loggegdInData.id,
        "status": status,
        "resellerId": userId
      },

    };
    this.setState({ loader: true, showAlert: false }, () => {
      apiService
        .removeReseller(formData)
        .then((deletedData) => {

          if (typeof deletedData.status != "undefined" && deletedData.status) {
            this.setState({
              loader: false,
              //showAlert: true,
              //alertType: "success",
              //alertBody: "Reseller deleted succesfully!",
              //usersData: this.state.usersData
            });
            toast.success("Reseller Status changed successfully!", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
            
            // if (isDeleteClicked) {
            //   this.state.usersData.splice(index, 1);
            // } else {
            //   this.state.usersData.map((user, arrIndex) => {
            //     if (user.id === userId) {
            //       user.status = status
            //     }
            //   })
            // }
            setTimeout(() => { window.location.reload() }, 3000);
          } else {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: "danger",
              alertBody: "Failed to delete reseller!",
            });
          }
        }).catch((error) => {
          this.setState({
            loader: false,
            showAlert: true,
            alertType: "danger",
            alertBody: "Something went wrong!",
          });
        });
    });
  }

  _fetchUserList(pageNum) {
    apiService
      .resellerList({ "isValid": true, "channelId": "MASAPLAYER", "module": "MASA", "requestId": "IBOPLAYERAPP2", "userId": loggegdInData.id, "groupId": loggegdInData.roleId })
      .then((userListData) => {

        if (
          typeof userListData.status != "undefined" &&
          userListData.status
        ) {
          this.setState({
            usersData: userListData.data.IBOReseller,
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
    this._fetchUserList(0);
  }

  listView(value) {
    if (value) {
      this.setState({
        editPage: false
      });
    }
  }

  updateCreditPointValChange = (e) => {
    let value = e.target.value;
    value.replace(/\s/g, null);
    value = parseInt(value);
    this.setState({
      updateCreditPointVal: value
    });
  }

  debitCreditPointValChange = (e) => {
    let value = e.target.value;
    value.replace(/\s/g, null);
    value = parseInt(value);
    this.setState({
      debitCreditPointVal: value
    });
  }

  modalBodyContent = (userData) => {
    return (<div className="col-md-12 row">

      {updateCreditValErr !== false ? this.state.updateCreditValErrMsg : ""}
      <div className="col-md-9">
        <label htmlFor="updateCreditPointVal">Credit Point: </label>
        <input id="updateCreditPointVal"
          className="form-control" type="number" placeholder="Credit Point" name="updateCreditPointVal" 
          onChange={this.updateCreditPointValChange.bind(this)} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} onPaste={(e) =>e.preventDefault()} autoComplete="off"/>
      </div>
    </div>)
  };

  debitModalBodyContent = (userData) => {
    return (<div className="col-md-12 row">

      {updateCreditValErr !== false ? this.state.debitCreditValErrMsg : ""}
      <div className="col-md-9">
        <label htmlFor="updateCreditPointVal">Credit Point: </label>
        <input id="updateCreditPointVal"
          className="form-control" type="number" placeholder="Credit Point" name="updateCreditPointVal" 
          onChange={this.debitCreditPointValChange.bind(this)} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} onPaste={(e) =>e.preventDefault()} autoComplete="off"/>
      </div>
    </div>)
  };

  creditSharePassModalContent = (userData) => {
    return (<div className="col-md-12 row">

      
      <div className="col-md-9">
        <label htmlFor="updateCreditPointVal">Password: </label>
        <input id="updateCreditPointVal"
          className="form-control" type="text" placeholder="Password" name="creditSharePassword" 
          onChange={this.debitCreditPointValChange.bind(this)} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} onPaste={(e) =>e.preventDefault()} autoComplete="off"/>
      </div>
    </div>)
  };

  showImageVerifyModal(userData) {
    //console.log("inside showModal", userData);
    let str = loggegdInData.roleId == 2 ? "You have " + loggegdInData.resCreditPoint + " credit points balance. \n Please allot credit point lesser than your current credit!" : "Add Credit Points ";

    this.setState({
      modalVisible: true,
      userId: userData.id,
      modalTitle: str,
      creditModType:'CREDIT',
      modalBodyContent: this.modalBodyContent(userData),
      updateCreditPointVal: parseInt(userData.credit_point)
    });
    //this._fetchUserDetail(userData._id);
  }

  deductCreditModal(userData) {
    let str =  "Reseller have " + userData.credit_point + " credit points balance. \n Please deduct credit point lesser or equal to current credit!";

    this.setState({
      modalVisible: true,
      userId: userData.id,
      userObj:userData,
      modalTitle: str,
      creditModType:'DEBIT',
      modalBodyContent: this.debitModalBodyContent(userData),
      debitCreditPointVal: parseInt(userData.credit_point)
    });
    //this._fetchUserDetail(userData._id);
  }

  closeModal() {
    this.setState({
      modalVisible: false,
      showCreditSharePasswordModal: false
    });
  }


  assignOtherReseller = (editData) => {
    this.setState({
      editData: editData,
      assignToReseller: true
    });
  }

  _fetchUserDetail(userId, profileData) {
    this.setState({ loader: true }, () => {
      apiService
        .getUserDetailsById(userId)
        .then((userListData) => {
          this.setState({
            loader: false
          });
          if (
            typeof userListData.status != "undefined" &&
            userListData.status
          ) {
            let modalTitle = userListData.data.name;
            let modalBody = typeof profileData !== 'undefined' && profileData === 'profilePage' ? '' : this.modalBodyContent(userListData.data);
            this.setState({
              userId: userListData.data.id,
              modalTitle: modalTitle,
              modalBodyContent: modalBody
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

  componentDidUpdate() {
    if (updateCreditValErr != '') {
      this.setState({
        updateCreditValErr: updateCreditValErr
      });
    }
  }

  showCreditSharePasswordModal(userData) {
    
    this.setState({
      
      userId: userData.id,
      userObj:userData
      
    }, (prevState, props) => {
      this.setState({
        showCreditSharePasswordModal:true,
        creditSharePasswordModalBodyContent: this.creditSharePasswordModal(userData)
      })
    })
  }
  
  creditSharePasswordModal = (userData) => {
    if(loggegdInData.creditSharePassword === null){
      return (<div className="col-md-12 row">
      <div className="col-md-9">
        <label htmlFor="registerCreditSharePass">Enter Your Password To get register: </label>
        <Input.Password id="registerCreditSharePass" placeholder="Credit Share Password" name="registerCreditSharePass"
          onChange={this.registerCreditSharePassword.bind(this)} onPaste={(e) => e.preventDefault()} autoComplete="off" />
      </div>
    </div>)
    }else{

    
    return (<div className="col-md-12 row">
      <div className="col-md-9">
        <label htmlFor="creditSharePassword">Password: </label>
        <input id="creditSharePassword"
          className="form-control" type="password" placeholder="Credit Share Password" name="creditSharePassword"
          onChange={this.creditSharePassword.bind(this)} onPaste={(e) => e.preventDefault()} autoComplete="off" />
      </div>
    </div>)
    }
  };

  registerCreditSharePassword = (ele) => {
    let value = ele.target.value;
    this.setState({
      registerCreditSharePass: value,
      firstTimeRegister:true
    });
  }
  
  
  creditSharePassword = (e) => {
    let value = e.target.value;
    this.setState({
      creditSharePassword: value
    });
  }

  creditSharePasswordValidate(userObj) {
    this.setState({ loader: true, showCreditSharePasswordModal: false }, () => {
      let  requestData = {
          module:'ABEPLAYERTV',
          channelId:'IBOPLAYERAPP',
          requestId:'IBOPLAYERAPP1234',
          requestData:{
            resellerId:loggegdInData.id,
            passcode:this.state.creditSharePassword
          }
      };
      apiService
        .creditSharePasswordValidate(requestData)
        .then((resCreditSharePassword) => {
          this.setState({
            loader: false
          });
         // console.log("====================================", resCreditSharePassword, "/=/=/=/=/0, requestData", requestData, "userObj", userObj);
          if (
            typeof resCreditSharePassword.status != "undefined" &&
            resCreditSharePassword.status
          ) {
            this.showImageVerifyModal(userObj);
          } else {
            setTimeout(() => {
              this.showCreditSharePasswordModal(userObj);
            }, 3000);
            
            toast.error("Password Incorrect, Please try again!", {
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
        .catch((error) => {
          toast.error("Something went wrong, Please try after sometime!!!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        });
    });
  }


  creditSharePasswordRegister(userObj) {
    this.setState({ loader: true, showCreditSharePasswordModal: false }, () => {
      let  requestData = {
          module:'ABEPLAYERTV',
          channelId:'IBOPLAYERAPP',
          requestId:'IBOPLAYERAPP1234',
          requestData:{
            resellerId:loggegdInData.id,
            passcode:this.state.registerCreditSharePass
          }
      };
      apiService
        .creditSharePasswordRegister(requestData)
        .then((resCreditSharePassword) => {
          this.setState({
            loader: false
          });
         // console.log("====================================", resCreditSharePassword, "/=/=/=/=/0, requestData", requestData, "userObj", userObj);
          if (
            typeof resCreditSharePassword.status != "undefined" &&
            resCreditSharePassword.status
          ) {
            this.showImageVerifyModal(userObj);
            localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 

              'id':loggegdInData.id,
              'email': loggegdInData.email,
              'name': loggegdInData.firstname,
              'username': loggegdInData.username,
              'roleId':loggegdInData.roleId,
              'resCreditPoint':loggegdInData.resCreditPoint,
              'creditSharePassword':this.state.registerCreditSharePass,
              'web_logo':loggegdInData.web_logo,
              'web_title':loggegdInData.web_title,
              'isVerifiedImage':true,
              'userImage':"kljfkdfjk",
              'userIdCard':"kdjfhkg",
              'imageApproveComment':"kljg",
              'roleName':loggegdInData.roleId+"_"+loggegdInData.id}));

          } else {
            setTimeout(() => {
              this.showCreditSharePasswordModal(userObj);
            }, 3000);
            
            toast.error("Password Incorrect, Please try again!", {
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
        .catch((error) => {
          toast.error("Something went wrong, Please try after sometime!!!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        });
    });
  }



  updateCreditPoint = (userId, status) => {
    //console.log("his.state.updateCreditPointVal", typeof(this.state.updateCreditPointVal));
    if(typeof(this.state.updateCreditPointVal) !== 'number' || this.state.updateCreditPointVal < 0){
      this.setState({
        modalVisible: false
      })
      toast.error(this.state.updateCreditPointVal+ ", Not a valid credit point!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return false;
    }
    if (loggegdInData.roleId == '2' && parseInt(this.state.updateCreditPointVal) >= parseInt(loggegdInData.resCreditPoint)) {
      this.setState({
        modalVisible: false
      })
      toast.error("You do not have enough credit point, Please allocate lesser than your credit point!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return false;
    }
    
    let formData = {
      "isValid": true,
      "channelId": "MASAPLAYER",
      "module": "MASA", 
      "requestId": "IBOPLAYERAPP2",
      creditPoint: this.state.updateCreditPointVal, 
      resellerId: userId, 
      createdBy: loggegdInData.id, 
      groupId: loggegdInData.roleId
    }

    this.setState({ loader: true }, () => {
      this.setState({
        modalVisible: false,
        showPasswordModal: true
      })
     // console.log("============jj", formData);
      apiService
        .updateCreditPoint(formData)
        .then(addUserResponse => {
          this.setState({
            loader: false,
            modalVisible: false
          })
          //console.log("addUserResponse---", addUserResponse);
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            //this.set
            toast.success("Succesfully updated credit point.", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });

            if (loggegdInData.roleId == '2') {
              var resCreditPoint = loggegdInData.resCreditPoint;
              resCreditPoint = (loggegdInData.resCreditPoint - formData.creditPoint);
              //update reseller credit point with all specific session data
              localStorage.setItem('userData_' + localStorage.getItem('token'), JSON.stringify({
                'id': loggegdInData.id,
                'email': loggegdInData.email,
                'name': loggegdInData.firstname,
                'username': loggegdInData.username,
                'roleId': loggegdInData.roleId,
                'resCreditPoint': resCreditPoint,
                'isVerifiedImage': true,
                'userImage': "kljfkdfjk",
                'userIdCard': "kdjfhkg",
                'imageApproveComment': "kljg",
                'roleName': loggegdInData.roleId + "_" + loggegdInData.id
              }));
            }

            setTimeout(() => {
              window.location.reload(true);
            }, 3000);
          } else {
            toast.error("Failed to update credit point!", {
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
          this.setState({
            loader: false,
            modalVisible: false
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


  debitCreditPoint = (user, status) => {
    //console.log("his.state.updateCreditPointVal", typeof(this.state.updateCreditPointVal));
    if(typeof(this.state.debitCreditPointVal) !== 'number' || this.state.debitCreditPointVal < 0){
      this.setState({
        modalVisible: false
      })
      toast.error(this.state.debitCreditPointVal+ ", Not a valid credit point!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return false;
    }
    if (parseInt(this.state.debitCreditPointVal) > parseInt(user.credit_point)) {
      this.setState({
        modalVisible: false
      });
      toast.error("Debit Credit point should not be greator that the reseller credit point!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return false;
    }
    
    let formData = {
      "isValid": true, "channelId": "MASAPLAYER", "module": "MASA", "requestId": "IBOPLAYERAPP2",
      creditPoint: this.state.debitCreditPointVal, resellerId: user.id, createdBy: loggegdInData.id, groupId: loggegdInData.roleId
    }

    this.setState({ loader: true }, () => {
      this.setState({
        modalVisible: false
      })
      apiService
        .debitCreditPoint(formData)
        .then(addUserResponse => {
          this.setState({
            loader: false,
            modalVisible: false
          })
          if (
            typeof addUserResponse.status != 'undefined' &&
            addUserResponse.status
          ) {
            //this.set
            toast.success("Succesfully updated credit point.", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });

            if (loggegdInData.roleId == '2') {
              var resCreditPoint = loggegdInData.resCreditPoint;
              resCreditPoint = (parseInt(loggegdInData.resCreditPoint) + parseInt(formData.creditPoint));
              //update reseller credit point with all specific session data
              localStorage.setItem('userData_' + localStorage.getItem('token'), JSON.stringify({
                'id': loggegdInData.id,
                'email': loggegdInData.email,
                'name': loggegdInData.firstname,
                'username': loggegdInData.username,
                'roleId': loggegdInData.roleId,
                'resCreditPoint': resCreditPoint,
                'isVerifiedImage': true,
                'userImage': "kljfkdfjk",
                'userIdCard': "kdjfhkg",
                'imageApproveComment': "kljg",
                'roleName': loggegdInData.roleId + "_" + loggegdInData.id
              }));
            }

            setTimeout(() => {
              window.location.reload(true);
            }, 3000);
          } else {
            toast.error("Failed to update credit point!", {
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
          this.setState({
            loader: false,
            modalVisible: false
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
    return ({
      name: (user.parent_reseller_id !== 0) ? <b style={{ color: "blue" }}>{user.name}</b> : user.name,
      expiry_date: user.expiry_date,
      credit_point: user.credit_point,
      email: user.email,
      isSubReseller: (user.parent_reseller_id !== 0) ? <b style={{ color: "blue" }}>Yes</b> : "No",
      // rolename: user.roleId.rolename,
      totalBoxActivated:user.activated_box_count,
      createdAt: formatDateTime(user.created_at),
      lastLogin: formatDateTime(user.last_login_time),
      status: (user.id === loggegdInData.id) ? '' : (loggegdInData.roleId === 1) ? <Popconfirm
        title={statusChangeMessage}
        onConfirm={() =>
          this.deleteUser(user.id, changeStatusTo, false, index)
        }
        okText='Yes'
        cancelText='No'
      >
        <Badge color={getBadge(user.status)} title={statusTitle}>
          {user.status == 1 ? "Active" : "Inactive"}
        </Badge>
      </Popconfirm> : <Badge color={getBadge(user.status)} title={statusTitle}>
        {user.status == 1 ? "Active" : "Inactive"}
      </Badge>,
      action: (user.id === loggegdInData.id) ? '' : (loggegdInData.roleId === 1) ? <div>
        <Link to="#" title="Edit Reseller" onClick={() => this.editUser(user)}>
          <i className='fa fa-edit' /> &nbsp;|&nbsp;{' '}
        </Link>

        <Link to="#" title="Add Credit Point" onClick={() => this.showCreditSharePasswordModal(user)}>
          <i className='fa fa-gift' style={{color:"#0b930bd4"}} /> &nbsp;|&nbsp;{' '}
        </Link>
        <Link to="#" title="Deduct Credit Point" onClick={() => this.deductCreditModal(user)}>
          <i className='fa fa-gift' style={{color:"red"}} /> &nbsp;|&nbsp;{' '}
        </Link>
        {user.parent_reseller_id === 0 ?
          <Link to="#" title="Assign to another Resller" onClick={() => this.assignOtherReseller(user)}>
            <i className='fa fa-user-plus' /> &nbsp;|&nbsp;{' '}
          </Link>
          : ""}
        <Popconfirm
          title="Are you sure to disable this user?"
          onConfirm={() => this.deleteUser(user.id, 2, true, index)}
          okText="Yes"
          cancelText="No"
        >
          <Link to='#' title="Remove Reseller">
            <i className='fa fa-remove' />
          </Link>
        </Popconfirm>
      </div> : <div>
        <Link to="#" title="Edit Reseller" onClick={() => this.editUser(user)}>
          <i className='fa fa-edit' /> &nbsp;|&nbsp;{' '}
        </Link>
        <Link to="#" title="Add Credit Point" onClick={() => this.showCreditSharePasswordModal(user)}>
        <i className='fa fa-gift' style={{color:"#0b930bd4"}}/>&nbsp;|&nbsp;{' '}
      </Link>
       <Link to="#" title="Deduct Credit Point" onClick={() => this.deductCreditModal(user)}>
       <i className='fa fa-gift' style={{color:"red"}} /> &nbsp;|&nbsp;{' '}
     </Link></div>
    })
  }

  render() {
    const userList = this.state.usersData.filter((user) => user.id);

    const data = {
      columns: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Expiry Date',
          field: 'expiry_date',
        },
        {
          label: 'Credit Point',
          field: 'credit_point'
        },
        {
          label: 'Total Box Activated',
          field: 'totalBoxActivated'
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Is Sub reseller',
          field: 'isSubReseller',
        },
        {
          label:'Last Login',
          field:'lastLogin'
        },
        {
          label: 'Created At',
          field: 'createdAt',
        },

        {
          label: 'Status',
          field: 'status'
        },
        {
          label: 'Action',
          field: 'action',
        }
      ],
      rows: userList.map((user, index) => this.userTable(user, index))
    };
    const { userId, userObj, modalVisible, profileModalVisible, modalTitle, modalBodyContent, confirmLoading } = this.state;
    return (
      <div className="animated fadeIn">
        <ToastContainer />
        {profileModalVisible ? <Modal title={modalTitle}
          visible={profileModalVisible}
          onOk={() => this.closeProfileModal()}
          confirmLoading={confirmLoading}
          onCancel={() => this.closeProfileModalCancel()}
          cancelText="Cancel"
          okText="Ok"
          zIndex="1000"
          width="auto"
          style={{ "paddingLeft": "7%", "paddingRight": "7%" }}
        >
          {modalBodyContent}
        </Modal> : null}
        {this.state.loader ? <Loader /> : null}
        {this.state.editPage ? <EditReseller editData={this.state.editData} backToList={(value) => this.listView(value)} returnEditData={(editData) => this.returnEditData(editData)} /> :
          this.state.assignToReseller ? <SubResellerAssignment editData={this.state.editData} backToList={(value) => this.listView(value)} /> :
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader>
                    {this.state.loader ? <Loader /> : null}
                    <i className="fa fa-align-justify"></i> Reseller{" "}
                    <small className="text-muted">List</small>
                    {loggegdInData.roleId == 1 ?
                      <Link to="add-reseller" className="btn btn-sm btn-info feature-btn fa fa-plus">&nbsp;Add Reseller</Link>
                      : ""}
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
                  </CardBody>
                </Card>
              </Col>
              <Modal title={modalTitle}
                visible={modalVisible}
                onOk={() => this.state.creditModType === 'CREDIT' ? this.updateCreditPoint(userId, 'A') : this.debitCreditPoint(userObj, 'A')}
                confirmLoading={confirmLoading}
                onCancel={this.closeModal}

                cancelText="Cancel"
                okText="Update"
                zIndex="1000"
                footer={[
                  <Button key="back" onClick={this.closeModal}>
                    Cancel
                  </Button>,
                  <Button key="submit" type="primary" loading={confirmLoading} onClick={() => this.state.creditModType === 'CREDIT' ? this.updateCreditPoint(userId, 'A') : this.debitCreditPoint(userObj, 'A') }>
                    Update
                  </Button>,
                ]}
              >
                {modalBodyContent}
              </Modal>

              {this.state.showCreditSharePasswordModal ? <Modal title="Credit Share Password"
              visible={this.state.showCreditSharePasswordModal}
              onOk={() => this.state.firstTimeRegister === true ? this.creditSharePasswordRegister(userObj): this.creditSharePasswordValidate(userObj)}
              confirmLoading={confirmLoading}
              onCancel={this.closeModal}

              cancelText="Cancel"
              okText="Update"
              zIndex="1000"
              footer={[
                <Button key="back" onClick={this.closeModal}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" loading={confirmLoading} onClick={() => this.state.firstTimeRegister === true ? this.creditSharePasswordRegister(userObj): this.creditSharePasswordValidate(userObj)}>
                  Validate Password
                </Button>,
              ]}
            >
              {this.state.creditSharePasswordModalBodyContent}
            </Modal> : null}
            </Row>
        }
      </div>
    );
  }
}
export default ResellerList;
