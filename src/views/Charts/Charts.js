import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardColumns, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { apiService } from '../../admin/_services/api.service';
import TicketListComponent from '../../admin/_components/Tickets/TicketListComponent';

const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
const bar = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'Year 2019',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40, 30, 25, 40, 33, 23],
    },
  ],
};

const doughnut = {
  labels: [
    'On Track',
    'Breached',
    'At Risk',
  ],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
    }],
};

const radar = {
  labels: ['Home Loan', 'Personal Loan', 'Auto Loan', 'Mortgage Loan', 'Gold Loan', 'Pocket Loan', 'Plot Loan'],
  datasets: [
    {
      label: 'Loans disbursed by Revenue',
      backgroundColor: 'rgba(179,181,198,0.2)',
      borderColor: 'rgba(179,181,198,1)',
      pointBackgroundColor: 'rgba(179,181,198,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: [65, 59, 90, 81, 56, 55, 40],
    },
    {
      label: 'Loans disbursed by Volume',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: [28, 48, 40, 19, 96, 27, 100],
    },
  ],
};

const pie = {
  labels: [
    'On Track',
    'Breached',
    'At Risk',
  ],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
    }],
};

const polar = {
  datasets: [
    {
      data: [
        11,
        16,
        7,
        3,
        14,
      ],
      backgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#E7E9ED',
        '#36A2EB',
      ],
      label: 'Active Applications' // for legend
    }],
  labels: [
    'Home loans',
    'Business Loans',
    'Loan against property',
    'Personal Loan',
    'Auto Loan',
  ],
};

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

class Charts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pieChartData: null,
      lineChartData: null,
      radarChartData: null,
      lineChart: ''
    }
  }

  componentDidMount() {
    this.chartData();
  }

  onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  getGraphMonth = () => {

  }

  setTotalAppsCountMonthWise = (data) => {
    const transformedData = {
      labels: [],
      datasets: []
    };
    transformedData.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = [...new Set(data.map(item => item.year))];
    years.forEach(year => {
      const data1 = data
        .filter(item => item.year === year)
        .map(item => item.total);

      transformedData.datasets.push({
        label: year.toString(),
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(128 191 27 / 82%)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 10,
        pointHitRadius: 10,
        data: data1,
      });
    });

    this.setState({
      lineChartData: transformedData
    });

  }

  appWiseCounts = (data) => {
    const pieDataChart = {
      labels: [],
      datasets: []
    };
    const modules = [...new Set(data.map(it => it.module))];
    pieDataChart.labels = modules;
    //const platforms = [...new Set(data.map(item => item.platform))];

    const radarData = data.map(item => item.total);
    pieDataChart.datasets.push({
      data: radarData,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#d52c24',
        '#24d532',
        '#24d5b4',
        '#248bd5',
        '#2f24d5',
        '#9124d5',
        '#d524a7',
        '#cfc440',
        '#23480fe0',
        '#a18a47e0',
        '#93bf4cf7',
        '#160b02f5',
        '#160b04f5'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#d52c24',
        '#24d532',
        '#24d5b4',
        '#248bd5',
        '#2f24d5',
        '#9124d5',
        '#d524a7',
        '#cfc440',
        '#23480fe0',
        '#a18a47e0',
        '#93bf4cf7',
        '#160b02f5',
        '#160b04f5'
      ],
    });

    //});

    this.setState({
      pieChartData: pieDataChart
    });
  }

  appPlatformWise = (data) => {
    const radarTransformedData = {
      labels: [],
      datasets: []
    };
    const modules = [...new Set(data.map(it => it.module))];
    radarTransformedData.labels = modules;
    const platforms = [...new Set(data.map(item => item.platform))];
    platforms.forEach(platform => {
      const radarData = data
        .filter(item => item.platform === platform)
        .map(item => item.total);
      radarTransformedData.datasets.push({
        label: platform.toString(),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: radarData,
      });
    });

    console.log(radarTransformedData, "radarTransformedData");

    this.setState({
      radarChartData: radarTransformedData
    });
  }


  chartData = () => {

    let formData = {};
    formData.channelId = 'MASAPLAYER';
    formData.module = "MASA";
    formData.requestId = 'IBOPLAYERAPP2';
    formData.requestData = {
      userId: loggegdInData.id,
      groupId: 2
    }
    apiService.getChartData(formData).then((loginResponse) => {
      console.log("chart data--", loginResponse);
      this.setState({
        loader: false,
        pieChartData: loginResponse.data.pieChartData
      });
      this.setTotalAppsCountMonthWise(loginResponse.data.lineChartData);
      this.appPlatformWise(loginResponse.data.appWisePlatform);
      this.appWiseCounts(loginResponse.data.appWiseData);

    }).catch(error => { console.log("Catch=", error) });
  };



  render() {
    return (
      <div className="animated fadeIn cust_charts_group">
        <CardColumns className="cols-2">
          {/* <Card>
            <CardHeader>
              Monthly Box Activation
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                {this.state.lineChartData === null ?
                  "Loading Chart data"
                  : <Line data={this.state.lineChartData} options={options} />}
              </div>
            </CardBody>
          </Card> */}
          {/* <Card>
            <CardHeader>
            SLA Performance – Completed Cases
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Doughnut data={doughnut} />
              </div>
            </CardBody>
          </Card> */}
          {/* <Card>
            <CardHeader>
            Rejected Loans
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
              {this.state.radarChartData === null ? "loading.." :
                 <Bar data={this.state.radarChartData} options={options} />
                }
              </div>
            </CardBody>
          </Card> */}

          {/* <Card>
            <CardHeader>
            Quaterly Performance
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                {this.state.radarChartData === null ? "loading.." :
                  <Radar data={this.state.radarChartData} />
                }
              </div>
            </CardBody>
          </Card> */}
          <Card>
            <CardHeader>
              App Wise - Total Activation
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                {this.state.pieChartData == null ? "Loading..." :
                  <Pie data={this.state.pieChartData} />
                }
              </div>
            </CardBody>
          </Card>
          <div style={{maxHeight:"320px"}}>
          <TicketListComponent />
          </div>
          
          {/* <Card>
            <CardHeader>
            Active Applications
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Polar data={polar} options={options}/>
              </div>
            </CardBody>
          </Card> */}
        </CardColumns>
      </div>
    );
  }
}

export default Charts;
