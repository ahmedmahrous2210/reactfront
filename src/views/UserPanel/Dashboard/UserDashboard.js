import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap';
//import Tasklists from '../../Components/Tasklist/Tasklists';
import usersData from '../../Inbox/UsersData';
import Widget04 from '../../Inbox/Widget04';
import { apiService } from '../../../admin/_services/api.service';
const localStorageData = JSON.parse(
  localStorage.getItem('userData_' + localStorage.getItem('token'))
)
window.React = React;

function UserRow(props) {
  const user = props.user
  const userLink = `/Workflow/${user.workflowName}`

  const getBadge = (overDueStatus) => {
    return overDueStatus === 'active' ? 'success' :
    overDueStatus === 'inactive' ? 'secondary' :
    overDueStatus === 'pending' ? 'warning' :
    overDueStatus === 'rejected' ? 'danger' :
            'primary'
  }

  const getFaFaIcon = (overDueStatus) => {
    return overDueStatus === 'Pending' ? "fa fa-warning fa-sm" :
    overDueStatus === 'Rejected' ? "fa fa-exclamation fa-sm" :
            ""
  }

  const getStyle = (overDueStatus) => {
    return overDueStatus === 'Pending' ? {color:'orange'} :
    overDueStatus === 'Rejected' ? {color:'red', margin: '4px'} :
    {}
  }

  const getFaFaIconAssignedType = (userOrTeamStatus) => {
    return userOrTeamStatus === 'user' ? "fa fa-user fa-sm" :
    userOrTeamStatus === 'team' ? "fa fa-group fa-sm" :
            ""
  }

  const getAssignedUserStyle = (userOrTeamStatus) => {
    return userOrTeamStatus === 'user' ? {color:'orange'} :
    userOrTeamStatus === 'team' ? {color:'green', margin: '4px'} :
    {}
  }

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}><label color="#ccc">{user.id}</label></Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}><center><i className={getFaFaIconAssignedType(user.userOrTeamStatus)} style={getAssignedUserStyle(user.userOrTeamStatus)}></i></center></Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}><center><i className={getFaFaIcon(user.overDueStatus)} style={getStyle(user.overDueStatus)}></i></center></Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.loanApplicationNo}</Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.loanType}</Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.customerName}</Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.stageName}</Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.creationDate}</Link></th>
      <th scope="row"><Link to={userLink} style={{ textDecoration: 'none', color: '#323232', fontWeight: 'normal' }}>{user.dueDate}</Link></th>
    </tr>
  )
}

const ModalExample = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [alert, setAlert] = useState({
    'show': false,
    'style':'',
    'message':''
  });
  const showAlert = () => {
    //This is the functional setState
    setAlert(prevState => ({
      ...prevState,
      show: !prevState.show
    }))
    window.setTimeout(()=>{
      setAlert(prevState => ({
        ...prevState,
        show: !prevState.show
      }))
    },2000);
  }

  return (

    <div>
      {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Launch Application</ModalHeader>
        <ModalBody>
          <Alert color="primary" isOpen={alert.show}>
            Customer has been created successfully.
          </Alert>
          <Card>
            <CardBody>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <Label htmlFor="loanType">Select loan type</Label>
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <Input type="select" name="loanType" id="loanType">
                      <option value="Vehicle Loan">Vehicle Loan</option>
                      <option value="Home Loan">Home Loan</option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Loan Against Property">Loan Against Property</option>
                      <option value="Personal Loan">Personal Loan</option>
                    </Input>
                    </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <Label htmlFor="custType">Select Customer Type</Label>
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <Input type="select" name="custType" id="custType">
                      <option>Individual</option>
                      <option>Non Individual</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="button" size="sm" color="primary"><i className="fa fa-user-o"></i> Search Customer</Button>&nbsp;
              <Button type="button" size="sm" color="success"
                onClick={()=>{showAlert()}}><i className="fa fa-user"></i> Login New Customer</Button>
            </CardFooter>
          </Card>
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
}

class UserDashboard extends React.Component {

  
  constructor(props){
    super(props);
    this.state ={
      courseCounts:'',
      examCounts:'',
      examScheduledCount:'',
      examDroppedCount:'',
      examStartedCount:'',
      examCompletedCount:'',
      examPendingCount:''
    }
  }

  componentDidMount() {
    this._fetchCounts()
  }
  
  _fetchCounts() {
    let formData = {userId:localStorageData.id};
    apiService
      .userDashboardCount(localStorageData.id)
      .then((userListData) => {
        console.log("userListData==", userListData);
        if (
          typeof userListData.success != "undefined" &&
          userListData.success
        ) {
          
          this.setState({
            courseCounts:userListData.data.courses,
            examCounts:userListData.data.examScheduled,
            examPendingCount:userListData.data.examPending,
            examDroppedCount:userListData.data.examDropped,
            examStartedCount:userListData.data.examStarted,
            examCompletedCount:userListData.data.examCompleted,
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
  
  render() {

  
    const userList = usersData;

    return (
      <div className="animated fadeIn">
        <ModalExample
          isOpen="false"
          toggle="false"
          buttonLabel="Launch Application"
          className="testModal"
        />
        <Row>
        <Col xs="12" sm="6" lg="3">
          <Link to="courses">
            <Widget04 icon="fa fa-address-book" color="info" header={this.state.courseCounts} value="100">Courses</Widget04>
            </Link>
        </Col>
        <Col xs="12" sm="6" lg="3">
          <Link to="exams">
            <Widget04 icon="fa fa-address-book" color="info" header={this.state.examCounts} value="100">My Exams</Widget04>
            </Link>
        </Col>
        <Col xs="12" sm="6" lg="3"><Link to="exams"><Widget04 icon="fa fa-address-book-o" color="success" header={this.state.examPendingCount} value="100">Exams Pending</Widget04></Link></Col>
        <Col xs="12" sm="6" lg="3"><Link to="exams"><Widget04 icon="fa fa-address-card-o" color="process" header={this.state.examDroppedCount} value="100">Dropped Exams</Widget04></Link></Col>
        <Col xs="12" sm="6" lg="3"><Link to="exams"><Widget04 icon="icon-speedometer" color="success" header={this.state.examCompletedCount} value="100">Exam Completed</Widget04></Link></Col>
        </Row>        
      </div>
    )
  }
}

export default UserDashboard;
