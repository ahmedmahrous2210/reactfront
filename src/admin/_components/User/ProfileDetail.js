import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge,Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import {apiService} from '../../_services/api.service';

const getBadge = (status) => {
  return status === 'active' ? 'success' :
    status === 'inactive' ? 'secondary' :
      status === 'pending' ? 'warning' :
        status === 'banned' ? 'danger' :
          'primary'
}

class ProfileDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      showAlert: false,
      alertType: '',
      alertBody: '',
      userData:[],
      roleData:[]
    }
  }

//   _fetchUserDetail(userId){
//     apiService.userDetail(userId).then((response) => {
   
//       if (response.success) {
//         this.setState({
//           userData: response.data,
//           roleData: response.data.roleId
//         });
//       } else {
//         this.setState({
//           showAlert: true,
//           alertType: 'danger',
//           alertBody: 'Failed to load user detail!',
//         });
//       }
//     }).catch(error => {
//       console.log(error);
//       this.setState({
//         showAlert: true,
//         alertType: 'danger',
//         alertBody: 'Something went wrong!',
//       });
//     });
//   }

//   componentDidMount(){
//     let userId = this.props.userId || null;
//     this._fetchUserDetail(userId);
//   }
userExamRow(user, role){
    return (
        <tbody>
            <tr>
                <th>Exam Name</th>
                <th>Status</th>
            </tr>
            {user.exams.length > 0 ? user.exams.map((examData, exKey) => {
                return(
                    <tr>
                        
                        <td>{examData.name}</td>   
                        <td>{examData.status}</td>   
                    </tr>
                )
            }) : null}
        </tbody>
        )
}
  userRow(user, role){
  return (
  <tbody>
     <tr >
          <td>Name</td>
  <td>{user.name} {user.lastName}</td>   
  </tr>
  <tr>
          <td>Email</td>
          <td>{user.email}</td>   
  </tr>
  <tr >
          <td>Institute Id </td>
          <td>{user.instituteId}</td>   
  </tr>
  <tr >
          <td>Institute Name </td>
          <td>{user.instituteName}</td>   
  </tr>
  <tr >
          <td>Status</td>
          <td> <Badge color={getBadge(user.status)}>{user.status}</Badge></td>   
  </tr>
  </tbody>
  )
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.userData.name} </strong>
              </CardHeader>
              <CardBody>
                  <div className="row">
                      <div className="col-md-3">
                        <img src={this.props.userData.userImage} className="img-responsive img-thumbnail" alt="avatar" style={{ width: '100%' }} />
                        <img src={this.props.userData.userIdCard} className="img-responsive img-thumbnail" alt="avatar" style={{ width: '100%' }} />
                      </div>
                      <div className="col-md-9">
                        <Table responsive striped hover>
                            {this.userRow(this.props.userData)}
                        </Table>
                      </div>
                    <Table responsive striped hover>
                        {this.userExamRow(this.props.userData)}
                    </Table>
                  </div>
                  <div className="row">

                  </div>
                  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ProfileDetail;
