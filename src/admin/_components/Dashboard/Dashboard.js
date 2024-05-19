import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import React, { Component } from 'react';
import { Form, Input, Button, Select, message, DatePicker, Radio, Modal } from 'antd';
import { Bar, Doughnut, Line, Pie, Polar } from 'react-chartjs-2';
import { ButtonDropdown, ButtonGroup, Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Progress, Row, Table } from 'reactstrap';

import { apiService } from '../../_services/api.service'
import { Link } from 'react-router-dom';
import Widget04 from './Widget04';
import Chart from '../../../views/Charts/Charts';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
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
            data: [4, 23, 2, 6],
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


let localStorageData = JSON.parse(
    localStorage.getItem('userData_' + localStorage.getItem('token'))
  )
class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            taskList: [],
            todaysBoxCount: 0,
            totalResellerCount: 0,
            totalBoxActiCount: 0,
            totalCreditShare: 0,
            componentSize: 'middle',
            setComponentSize: 'middle',
            isLoading: false,
            reportModuleType:'all',
            resellerNotifications: null,
            modalVisibility: true
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    getLiveNotification = () =>{
        const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
        let formData = {};
        formData.module = 'MASA';
        formData.channelId = 'MASAPLAYER';
        formData.requestId = 'IBOPLAYERAPP2';
        formData.requestData = {
            resellerId: loggegdInData.id,
            isValid:true
        }
        apiService.getRealNotif(formData).then((resNotification) => {
    
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

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    //Get task list 

    componentDidMount() {
        this._fetchCounts();
        this.getLiveNotification();
        this.getSocialWidget();
    }

    closeModal = () => {
        this.setState({
            modalVisibility: false
        });
        
    }

    onUserDownloadReport = (values) => {
        let formData = {};

        formData.module = 'IBOAPP';
        formData.channelId = 'IBOPLAYERAPP';
        formData.requestId = Date.now();
        formData.requestData = {
            startDate:values.startDate,
            endDate:values.endDate,
            moduleType:this.state.reportModuleType,
            adminId:localStorageData.id,
            groupId:localStorageData.roleId
        }
        this.setState({ loader: true, isLoading: true, showAlert: false }, () => {
            apiService.downloadUserReports(formData).then((userReports) => {
                this.setState({
                    isLoading: false 
                });
                if (typeof userReports.status != 'undefined' && userReports.status && userReports.data.length > 0) {
                    
                    let jsonData = userReports.data;
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    const ws = XLSX.utils.json_to_sheet(jsonData);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, 'user_activation_'+values.startDate+'_'+values.endDate + fileExtension);

                    Modal.error({
                        title: 'User activation Report ',
                        content: (
                          <div>
                            <p>Activation Sheet downloaded successfully!</p>
                          </div>
                        ),
                        onOk() {},
                    });
                   
                    setTimeout(() => { window.location.reload() }, 2000);
                } else {
                   
                    Modal.error({
                        title: 'User activation Report ',
                        content: (
                          <div>
                            <p>No Data Found!</p>
                          </div>
                        ),
                        onOk() {},
                    });
                }
            }).catch(error => {
                console.log("error", error);
                Modal.error({
                    title: 'User activation Report ',
                    content: (
                      <div>
                        <p>Something went wrong!</p>
                      </div>
                    ),
                    onOk() {},
                });
            });
        });
    }

    onResCredShareDownloadReport = (values) => {
        let formData = {};

        formData.module = 'IBOAPP';
        formData.channelId = 'IBOPLAYERAPP';
        formData.requestId = Date.now();
        formData.requestData = {
            startDate:values.startDate,
            endDate:values.endDate,
            adminId:localStorageData.id,
            groupId:localStorageData.roleId
        }
        this.setState({ loader: true, isResLoading: true, showAlert: false }, () => {
            apiService.downloadResCredReports(formData).then((userReports) => {
                this.setState({
                    isResLoading: false 
                });
                if (typeof userReports.status != 'undefined' && userReports.status && userReports.data.length > 0) {
                    
                    let jsonData = userReports.data;
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    const ws = XLSX.utils.json_to_sheet(jsonData);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, 'res_cred_share_'+values.startDate+'_'+values.endDate + fileExtension);

                    Modal.success({
                        title: 'Credit Share Report! ',
                        content: (
                          <div>
                            <p>Data sheet downloaded successfully!</p>
                          </div>
                        ),
                        onOk() {},
                    });
                   
                    setTimeout(() => { window.location.reload() }, 2000);
                } else {
                    
                    Modal.warning({
                        title: 'Credit Share Report! ',
                        content: (
                          <div>
                            <p>No Data Found!</p>
                          </div>
                        ),
                        onOk() {},
                    });
                }
            }).catch(error => {
                console.log("error", error);
                Modal.warning({
                    title: 'Credit Share Report! ',
                    content: (
                      <div>
                        <p>Something went wrong!</p>
                      </div>
                    ),
                    onOk() {},
                });
            });
        });
    }

    _fetchCounts() {
        let formData = {
            "module":'IBOAPP',
            "channelId":'IBOPLAYERAPP',
            "requestId" :Math.random(10),
            "requestData":{
              "groupId":localStorageData.roleId,
              "userId":localStorageData.id,
            },
            "isValid": true
        };
        apiService
            .dashboardCount(formData)
            .then((userListData) => {
                if (
                    typeof userListData.status != "undefined" &&
                    userListData.status
                ) {

                    this.setState({
                        todaysBoxCount: userListData.data.totalTodaysBox,
                        totalResellerCount: userListData.data.totalReseller,
                        totalBoxActiCount: userListData.data.totalAllBox,
                        totalCreditShare: userListData.data.totalCreditShare,

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

    
    getSocialWidget() {
        let formData = {
            "module": 'MASA',
            "channelId": 'MASAPLAYER',
            "requestId": 'IBOPLAYERAPP2',
            "isValid": true
        };
        this.setState({ loader: true }, () => {
            apiService
                .getSocialDetails(formData)
                .then((userListData) => {
                    this.setState({
                        loader: false
                    });
                    if (
                        typeof userListData.status != "undefined" &&
                        userListData.status
                    ) {

                        localStorage.removeItem('whatsAppNumber');
                        localStorage.setItem('whatsAppNumber', userListData.data.SocialWidget.whatsapp_number);
                        localStorage.removeItem('teligramNumber');
                        localStorage.setItem('teligramNumber', userListData.data.SocialWidget.teligram_number);
                        

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

    getBySelection = (e) => {
        this.setState({
            reportModuleType:e.target.value
        });
        
    }

    

      modalBodyContent = () => {
            // this.state.resellerNotifications.map((value, key) => {
            
            //     <div key={key}>
            //         <p>{value.description}</p>
            //     </div>
                
            // }
          //);
       
      };


    render() {
        const { componentSize } = this.state

        const onFormLayoutChange = ({ size }) => {
            this.setState({
                setComponentSize: size,
                componentSize: size
            })

        }

        var desc = '';
        if(this.state.resellerNotifications !== null ){
            desc = this.state.resellerNotifications.description;
        }
        
        return (
            <div className="animate fadeIn">
               <Chart />
                <Row>
                    <Col xs="12" sm="6" lg="3">
                        <Link to="/transactions">
                            <Widget04 icon="fa fa-tv" color="info" header={this.state.todaysBoxCount} value="100">Today's Activated Box</Widget04>
                        </Link>
                    </Col>
                    <Col xs="12" sm="6" lg="3">
                        <Link to="/reseller-list">
                            <Widget04 icon="fa fa-address-book" color="success" header={this.state.totalResellerCount} value="100">Resellers</Widget04>
                        </Link>
                    </Col>

                    <Col xs="12" sm="6" lg="3">
                        <Link to="/transactions">
                            <Widget04 icon="fa fa-tv" color="process" header={this.state.totalBoxActiCount} value="100">Total Box Activated</Widget04>
                        </Link>
                    </Col>
                    <Col xs="12" sm="6" lg="3">
                        {/* <Link to="/rule-list"> */}
                            <Widget04 icon="icon-speedometer" color="success" header={this.state.totalCreditShare} value="100">Total Credit Share</Widget04>
                        {/* </Link> */}
                    </Col>

                    <Col xs="12" sm="6" lg="6">
                    {/* {this.state.resellerNotifications !== null ? : ""} */}
                    {this.state.resellerNotifications !== null ? <Modal title={this.state.resellerNotifications.title}
          visible={this.state.modalVisibility}
          onOk={() => this.closeModal()}
          onCancel={() => this.closeModal()}
          confirmLoading={false}
          cancelText="Cancel"
          zIndex="1000"
          width="100%"
          style={{ "paddingLeft": "7%", "paddingRight": "7%" }}
        >
          <span dangerouslySetInnerHTML={ { __html: desc}} >
           
           </span>
        </Modal> : null}
                    </Col>

                </Row>
                <Row>
                    <Col xs="12" sm="6" lg="6">
                        <Card>
                            <CardHeader>

                                <i
                                >
                                    &nbsp; Download User Activation Reports
                                </i>
                            </CardHeader>
                            <CardBody>

                                <Form
                                    ref={this.formRef}
                                    name='register'
                                    onFinish={this.onUserDownloadReport}
                                    labelCol={{
                                        span: 8
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
                                    autoComplete="off"
                                >
                                    <div className="selection-type-radio" style={{"padding":"10px"}}>
                                        <i>Select Product Type</i><br /><br />
                                        <Radio.Group name="productType" defaultValue="all" onChange={(e) => this.getBySelection(e)}>
                                            <Radio value="all">All</Radio>
                                            <Radio value="iboapp">IBOAPP</Radio>
                                            <Radio value="virginia">VIRGINIA</Radio>
                                            <Radio value="masa">MASA</Radio>
                                            <Radio value="abeplayertv">AbePlayer</Radio>
                                            <Radio value="bobplayer">BOBPlayer</Radio>
                                            <Radio value="macplayer">MacPlayer</Radio>
                                            <Radio value="ktnPlayer">KtnPlayer</Radio>
                                            <Radio value="hushPlay">HushPlayer</Radio>
                                            <Radio value="allPlayer">AllPlayer</Radio>
                                            <Radio value="familyPlayer">FamilyPlayer</Radio>
                                            <Radio value="king4kPlayer">King4kPlayer</Radio>
                                            <Radio value="ibossPlayer">IbossPlayer</Radio>
                                            <Radio value="iboxxPlayer">IboxxPlayer</Radio>
                                            <Radio value="BobProTv">BOBProTv</Radio>
                                            <Radio value="iboStb">IBOSTBPlayer</Radio>
                                            <Radio value="ibosol">IBOSOL</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="row col-md-12">
                                        
                                        <div className="col-md-6">

                                            <Form.Item hasFeedback label="Start Date " size="58" name="startDate" rules={[{ required: true, message: "Please input Start Date!" }]} >
                                                <DatePicker format="YYYY-MM-DD" size="58" />
                                            </Form.Item>


                                        </div>
                                        <div className="col-md-6">

                                            <Form.Item hasFeedback label="End Date " size="58" name="endDate" rules={[{ required: true, message: "Please input End Date!" }]} >
                                                <DatePicker format="YYYY-MM-DD" size="58" />
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"
                                    >{this.state.isLoading ? 
                                    <span className="visually-hidden">Loading...</span>
                                  : "Download"}</Button>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xs="12" sm="6" lg="6">
                        <Card>
                            <CardHeader>

                                <i
                                >
                                    &nbsp; Download Reseller Credit Share Report
                                </i>
                            </CardHeader>
                            <CardBody>

                                <Form
                                    ref={this.formRef}
                                    name='resCredShare'
                                    onFinish={this.onResCredShareDownloadReport}
                                    labelCol={{
                                        span: 8
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
                                    autoComplete="off"
                                >
                                    
                                    <div className="row col-md-12">
                                        
                                        <div className="col-md-6">

                                            <Form.Item hasFeedback label="Start Date " size="58" name="startDate" rules={[{ required: true, message: "Please input Start Date!" }]} >
                                                <DatePicker format="YYYY-MM-DD" size="58" />
                                            </Form.Item>


                                        </div>
                                        <div className="col-md-6">

                                            <Form.Item hasFeedback label="End Date " size="58" name="endDate" rules={[{ required: true, message: "Please input End Date!" }]} >
                                                <DatePicker format="YYYY-MM-DD" size="58" />
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <Button type="primary"
                                        htmlType="submit"
                                        style={{ "left": "16%", "padding": "0.34rem 2.0rem" }}
                                        className="btn btn-success ant-col-offset-3"
                                    >{this.state.isResLoading ? 
                                    <span className="visually-hidden">Loading...</span>
                                  : "Download"}</Button>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default Dashboard;
