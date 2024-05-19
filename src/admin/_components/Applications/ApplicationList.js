import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { MDBDataTable } from 'mdbreact';

class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      applicationData: [],
      currentPage: 0,
      setCurrentPage: 0,
      listCount: 10,
      showEditPage: false,
      singleData: null
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
      createdAt: formatDateTime(application.created_at)
    })
  }

  deleteappUpdate(appId, status, isDeleteClicked, index) {
    this.setState({
      loader: true,
      showAlert: false
    }, () => {
      apiService.removeappUpdate(appId, status)
        .then((deletedData) => {
          if (typeof deletedData.success != 'undefined' && typeof deletedData.success) {
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
    apiService.applicationList(formData).then((applicationData) => {

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
        }
        
      ],
      rows: applicationList.map((application, index) => this.appUpdateTable(application, index))
    };


    return (
      <div className='animated fadeIn'>
        
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> Application {' '}
                  <small className='text-muted'>List</small>
                  <Link to="/create-app" className="fa fa-plus btn-sm btn btn-info feature-btn" > &nbsp; Add Applicatin </Link>
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
      </div>
    )
  }
}
export default ApplicationList;