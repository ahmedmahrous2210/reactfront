import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { MDBDataTable } from 'mdbreact';
import EditResellerAppSetting from "./EditResellerAppSetting";
import { Popconfirm } from "antd";
const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
class ResellerApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      applicationData: [],
      currentPage: 0,
      setCurrentPage: 0,
      listCount: 10,
      showEditPage: false,
      singleData: null,
      editData: null,
    }
  }

  listView(value) {
    if (value) {
      window.location.reload(true);
      this.setState({
        showEditPage: false
      });
    }
  }


  appUpdateTable(application, index) {
    return ({
      appName: application.app_name,
      appLogo: <img src={application.app_logo} alt="Red dot" />,
      appDescription: application.app_description,
      appTagline: application.app_tag_line,
      appPhone: application.app_phone,
      appEmail: application.app_email,
      createdAt: formatDateTime(application.created_at),
      action:<div>
        <Link to="#" title="Edit App" onClick={() => this.editResellerAppSetting(application)}>
          <i className='fa fa-edit' /> &nbsp;|&nbsp;{' '}
        </Link>
        | 
        <Popconfirm
          title="Are you sure to disable this user?"
          onConfirm={() => this.deleteAppSetting(application.id, 2, true, index)}
          okText="Yes"
          cancelText="No"
        >
          <Link to='#' title="Remove Reseller">
            <i className='fa fa-remove' />
          </Link>
        </Popconfirm>
      </div>
    })
  }

  deleteAppSetting(appId, status, isDeleteClicked, index) {
    let formData = {
      "isValid": true,
      "channelId": "MASAPLAYER",
      "module": "MASA",
      "requestId": "IBOPLAYERAPP2",
      "requestData": {
        "createdBy": loggegdInData.id,
        "status": status,
        "resAppId": appId
      },

    };
    this.setState({
      loader: true,
      showAlert: false
    }, () => {
      apiService.removeAppSetting(formData)
        .then((deletedData) => {
          if (typeof deletedData.status != 'undefined' && typeof deletedData.status) {
            if (isDeleteClicked) {
              this.state.applicationData.splice(index, 1)
            } else {
              this.state.applicationData.map((application, arrIndex) => {
                if (application.id === appId) {
                    application.status = status
                }
              })
            }
            this.setState({
              loader: false,
              showAlert: true,
              alertType: "danger",
              alertBody: "App Setting Deleted Successfully!",
              applicationData: this.state.applicationData
            })
          } else {
            this.setState({
              loader: false,
              showAlert: true,
              alertType: "danger",
              alertBody: "Failed to save changes"
            })
          }
        }).catch(() => {
          this.setState({
            loader: false,
            alertType: "danger",
            showAlert: true,
            alertBody: "Something went wrong!"
          })
        })
    })
  }

  _fetchappUpdateList = (pageNum) => {

    let formData = {};
    formData.module = 'MASA';
    formData.channelId = 'MASAPLAYER';
    formData.requestId = 'IBOPLAYERAPP2';
    formData.requestData = {
        isApplication: true
    }
    apiService.resApplicationList(formData).then((applicationData) => {

      if (typeof applicationData.status != 'undefined' && applicationData.status) {

        this.setState({
            applicationData: applicationData.data.ApplicationList,
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

  componentDidMount() {
    this._fetchappUpdateList(0);
  }

  
  UpdatedRowData = (rowData) => {
    this.state.applicationData.map((appUpdate, index) => {
      if(appUpdate.id === rowData.id){
        appUpdate = rowData;
      }
    });
  }

  editResellerAppSetting = (editData) => {
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

  render() {

    const applicationList = this.state.applicationData.filter((application) => application.id);
    const data = {
      columns: [
        {
          label: 'App Name',
          field: 'appName',
        },
        {
          label: 'App Logo',
          field: 'appLogo',
        },
        {
            label: 'App Phone',
            field: 'appPhone',
        },
        {
            label: 'App Email',
            field: 'appEmail',
        },
        {
            label: 'App Desc',
            field: 'appDescription',
        },
        {
          label: 'Created At',
          field: 'createdAt',
        },
        {
          label: 'Action',
          field: 'action',
        }
        
      ],
      rows: applicationList.map((application, index) => this.appUpdateTable(application, index))
    };


    return (
      <div className='animated fadeIn'>
        {this.state.editPage ? <EditResellerAppSetting editData={this.state.editData} backToList={(value) => this.listView(value)} returnEditData={(editData) => this.returnEditData(editData)} /> :
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> Application {' '}
                  <small className='text-muted'>List</small>
                  <Link to="/create-res-app" className="fa fa-plus btn-sm btn btn-info feature-btn" > &nbsp; Add App Setting </Link>
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
          </Row>
        }
      </div>
    )
  }
}
export default ResellerApplicationList;