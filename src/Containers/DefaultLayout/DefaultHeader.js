import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from 'antd';
import {Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import {AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/new-logo.png'
import smLogo from '../../assets/img/sm-logo.png'
import face_logo from '../../assets/img/face-icon.png';
import { apiService } from '../../admin/_services/api.service';
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
class DefaultHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      creditPoint:loggegdInData.resCreditPoint,
      resellerNotifications:0
     
    };

  }

  componentDidMount(){
    if(undefined !== loggegdInData.web_title && loggegdInData.web_title !== null){
      document.title = loggegdInData.web_title;
    }
      
      this.getLiveNotificationCount();
    
  }

  getLiveNotificationCount = () =>{
    const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
    let formData = {};
    formData.module = 'MASA';
    formData.channelId = 'MASAPLAYER';
    formData.requestId = 'IBOPLAYERAPP2';
    formData.requestData = {
        resellerId: loggegdInData.id,
        isValid:true
    }
    apiService.getRealNotifCount(formData).then((resNotification) => {

      if (typeof resNotification.status != 'undefined' && resNotification.status) {
        
        this.setState({
            resellerNotifications: resNotification.data
        });
        

      } else {
        this.setState({
          showAlert: true,
          alertType: "danger",
          alertBody: "Failed to load notification !"

        });
      }
    }).catch((error) => {
      this.setState({
        showAlert: true,
        alertType: "danger",
        alertBody: "Something went wrong!"
      });
    });
  }

  

  onLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('userData_'+localStorage.getItem('token'));
    window.location = "/";
  }

  

  getLatestCreditPoint = () =>{
    let formData = {};
    formData.module = 'MASA';
    formData.channelId = 'MASAPLAYER';
    formData.requestId = 'IBOPLAYERAPP2';
    formData.requestData = {
        resellerId: loggegdInData.id,
        createdBy: loggegdInData.id,
        status: 1
    }
    apiService.getResCredit(formData).then((applicationData) => {

      if (typeof applicationData.status != 'undefined' && applicationData.status) {
        localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 
          'id':loggegdInData.id,
          'email': loggegdInData.email,
          'name': loggegdInData.firstname,
          'username': loggegdInData.username,
          'roleId':loggegdInData.roleId,
          'resCreditPoint':applicationData.data.IBOReseller.credit_point,
          'isVerifiedImage':true,
          'userImage':"kljfkdfjk",
          'userIdCard':"kdjfhkg",
          'imageApproveComment':"kljg",
          'roleName':loggegdInData.roleId+"_"+loggegdInData.id}));
        this.setState({
            creditPoint: applicationData.data.IBOReseller.credit_point,
        });

        

      } else {
        this.setState({
          showAlert: true,
          alertType: "danger",
          alertBody: "Failed to load appUpdates!"

        });
      }
    }).catch((error) => {
      this.setState({
        showAlert: true,
        alertType: "danger",
        alertBody: "Something went wrong!"
      });
    });
  }

  render() {
    const { children, ...attributes } = this.props;
    return (
     
      <React.Fragment>
        
        <AppSidebarToggler className="fa fa-bars d-lg-none" mobile >
          {loggegdInData.roleId == 2 ? 
         <>
         
          <i title="My Remaining Credit Points">&nbsp; {this.state.creditPoint} </i>
          <i className="fa fa-refresh" style={{"color":"blue"}} title="Refresh to fetch latest point" onClick={this.getLatestCreditPoint} ></i>
          </>
        : <i title="My Remaining Credit Points">&nbsp; <i className="fa fa-infinity"></i></i>}
        </AppSidebarToggler>
        <AppNavbarBrand
        
          full={{ src: loggegdInData.web_logo ? loggegdInData.web_logo :  logo, width: 150, height: 50, alt: 'IBO Player IPTV' }}
          minimized={{ src: loggegdInData.web_logo ? loggegdInData.web_logo :  smLogo, width: 30, height: 30, alt: 'IBO Player IPTV' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
        
          {loggegdInData.roleId == 2 ? 
          <>
          <NavItem className="d-md-down-none">
          <NavLink to="/offers" className="nav-link" title="Notifications"><i className="icon-bell"></i><Badge pill color="danger">{this.state.resellerNotifications}</Badge></NavLink>
        </NavItem>
          <NavItem className="d-md-down-none">
            
            <NavLink to="#" className="nav-link" style={{color:"black",fontWeight:"400"}}><i className="fa fa-gift" title="My Remaining Credit Points"> &nbsp; Credit Point - &nbsp; {this.state.creditPoint} &nbsp;<i className="fa fa-refresh" style={{"color":"blue"}} title="Refresh to fetch latest point" onClick={this.getLatestCreditPoint} > Refresh</i></i></NavLink>
          </NavItem>
          </>
          : <NavItem className="d-md-down-none">
              <NavLink to="#" className="nav-link" style={{color:"black",fontWeight:"400"}}><i className="fa fa-gift" title="My Remaining Credit Points"> &nbsp; Credit Point - &nbsp; <i className="fa fa-infinity"></i></i></NavLink>
           </NavItem>}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={face_logo} className="img-avatar" alt="LoggedInLogo" />
            </DropdownToggle>
            <DropdownMenu right>
              
            <DropdownItem href="/#/update-password"><i className="fa fa-edit"></i> Update Password</DropdownItem>
              <DropdownItem onClick={this.onLogout}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
      
    );
  }
}
DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;