import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar } from 'react-chartjs-2';
import { ButtonDropdown, ButtonGroup, Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Progress, Row, Table } from 'reactstrap';

import { apiService } from '../../admin/_services/api.service';
import { Link } from 'react-router-dom';
import Widget04 from '../Inbox/Widget04';
import Chart from "react-google-charts";
const brandPrimary = getStyle('--primary');
const brandInfo = getStyle('--info');

// Card Chart 1
// const cardChartData1 = {
//   labels: ['Mortgage loan', 'Personal Loan', 'Auto Loan', 'Home Loan'],
//   datasets: [
//     {
//       label: 'Pending Cases',
//       backgroundColor: brandPrimary,
//       borderColor: 'rgba(255,255,255,.55)',
//       data: [100, 500, 230,670],
//     },
//   ],
// };

// const pie = {
//   labels: [
//     'Within SLA',
//     'At Risk',
//     'SLA Breached',
//   ],
//   datasets: [
//     {
//       data: [35, 5, 10],
//       backgroundColor: [
//         '#36A2EB',
//         '#FFCE56',
//         '#FF6384',
//       ],
//       hoverBackgroundColor: [
//         '#36A2EB',
//         '#FFCE56',
//         '#FF6384',
//       ],
//     }],
// };

// const polar = {
//   datasets: [
//     {
//       data: [
//         23,
//         4,
//         12,
//         6,
//       ],
//       backgroundColor: [
//         '#FF6384',
//         '#4BC0C0',
//         '#FFCE56',
//         '#36A2EB',
//       ],
//       label: 'My dataset' // for legend
//     }],
//   labels: [
//     'T',
//     'T+1',
//     'T+3',
//     '>T+3',
//   ],
// };

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}


const doughnut = {
  labels: [
    'Auto',
    'Personal',
    'Home',
    'Mortgage',
  ],
  datasets: [
    {
      data: [4,23, 2,6],
      backgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#36A2EB',
        '#FFCE56',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#36A2EB',
        '#FFCE56',
      ],
    }],
};


//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}



class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      taskList:[],
      usersCount:'',
      rulesCount:'',
      courseCounts:'',
      examCounts:'',
      examScheduledCount:'',
      examDroppedCount:'',
      examStartedCount:'',
      examCompletedCount:'',

    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

//Get task list 

componentDidMount() {
  this._fetchCounts()
}

_fetchCounts() {
  apiService
    .dashboardCount()
    .then((userListData) => {
      if (
        typeof userListData.success != "undefined" &&
        userListData.success
      ) {
        
        this.setState({
          usersCount:userListData.data.users,
          rulesCount:userListData.data.rules,
          courseCounts:userListData.data.courses,
          examCounts:userListData.data.exams,
          examScheduledCount:userListData.data.examScheduled,
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

    return (
      <div className="animate fadeIn">
        
        <Row>
        <Col xs="12" sm="6" lg="3">
        <Link to="/courses-list">
          <Widget04 icon="fa fa-address-book" color="info" header={this.state.courseCounts} value="100">Courses</Widget04>
          </Link>
        </Col>
        <Col xs="12" sm="6" lg="3">
        <Link to="/exam-list">
          <Widget04 icon="fa fa-address-book" color="success" header={this.state.examCounts} value="100">Exams</Widget04>
          </Link>
        </Col>
          
        <Col xs="12" sm="6" lg="3">
          <Link to="/users">
            <Widget04 icon="fa fa-address-card" color="process" header={this.state.usersCount} value="100">Users</Widget04>
          </Link>
        </Col>
        <Col xs="12" sm="6" lg="3">
          <Link to="/rule-list">
            <Widget04 icon="icon-speedometer" color="success" header={this.state.rulesCount} value="100">Rules</Widget04>
          </Link>
        </Col>
        
        <Col xs="12" sm="6" lg="6">
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Exams Activity Counts...</div>}
            data={[
              ['Task', 'Hours per Day'],
              ['Pending Exams', this.state.examStartedCount],
              ['Dropped Exams', this.state.examDroppedCount],
              ['Completed Exams', this.state.examCompletedCount]
            ]}
            options={{
              title: `Scheduled Exams Activity ( ${this.state.examScheduledCount} )`,
              is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </Col>
        
        </Row>  
        
      </div>
    );
  }
}

export default Dashboard;
