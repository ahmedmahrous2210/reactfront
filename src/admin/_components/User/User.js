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

class User extends Component {
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
  _fetchUserDetail(userId){
    apiService.userDetail(userId).then((response) => {
   
      if (response.success) {
        this.setState({
          userData: response.data,
          roleData: response.data.roleId
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
  }

  componentDidMount(){
    let userId = this.props.match.params.id || null;
    this._fetchUserDetail(userId);
  }
  userRow(user,role){
  return (
  <tbody>
     <tr >
          <td>Name</td>
          <td>{user.name}</td>   
  </tr>
  <tr >
          <td>Username</td>
          <td>{user.username}</td>   
  </tr>
  <tr >
          <td>Email</td>
          <td>{user.email}</td>   
  </tr>
  <tr >
          <td>Role</td>
          <td>{role.rolename}</td>   
  </tr>
  <tr >
          <td>Registered at</td>
          <td>{user.createdAt}</td>   
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
        <Link to="/users"> <i className="fa fa-arrow-left"> Back</i></Link>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    {this.userRow(this.state.userData, this.state.roleData)}
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
