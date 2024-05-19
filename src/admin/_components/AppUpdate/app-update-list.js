import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { Popconfirm } from "antd";
import { MDBDataTable } from 'mdbreact';

class AppUpdateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      appUpdateData: [],
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


  appUpdateTable(appUpdate, index) {
    return ({
      appVersion: appUpdate.app_version,
      appUpdateUrl: appUpdate.update_url,
      description: appUpdate.description,
      createdAt: formatDateTime(appUpdate.created_at)
    })
  }

  deleteappUpdate(appUpdateId, status, isDeleteClicked, index) {
    this.setState({
      loader: true,
      showAlert: false
    }, () => {
      apiService.removeappUpdate(appUpdateId, status)
        .then((deletedData) => {
          if (typeof deletedData.success != 'undefined' && typeof deletedData.success) {
            if (isDeleteClicked) {
              this.state.appUpdateData.splice(index, 1)
            } else {
              this.state.appUpdateData.map((appUpdate, arrIndex) => {
                if (appUpdate.id === appUpdateId) {
                  appUpdate.status = status
                }
              })
            }
            this.setState({
              loader: false,
              appUpdateData: this.state.appUpdateData
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
    apiService.appUpdateList(pageNum).then((appUpdateListdata) => {

      if (typeof appUpdateListdata.status != 'undefined' && appUpdateListdata.status) {

        this.setState({
          appUpdateData: appUpdateListdata.data.IBOAppUpdate,
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
    this.state.appUpdateData.map((appUpdate, index) => {
      if(appUpdate.id === rowData.id){
        appUpdate = rowData;
      }
    });
  }

  render() {

    const appUpdateList = this.state.appUpdateData.filter((appUpdates) => appUpdates.id);
    const data = {
      columns: [
        {
          label: 'appUpdate Version',
          field: 'appVersion',
        },
        {
          label: 'Update URL',
          field: 'appUpdateUrl',
        },
        {
            label: 'Description',
            field: 'description',
        },
        {
          label: 'Created At',
          field: 'createdAt',
        }
        
      ],
      rows: appUpdateList.map((appUpdate, index) => this.appUpdateTable(appUpdate, index))
    };


    return (
      <div className='animated fadeIn'>
        
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> AppUpdate {' '}
                  <small className='text-muted'>List</small>
                  <Link to="/add-appUpdates" className="fa fa-plus btn-sm btn btn-info feature-btn" > &nbsp; Add appUpdate </Link>
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
export default AppUpdateList;