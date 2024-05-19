import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { Popconfirm } from "antd";
import { MDBDataTable } from 'mdbreact';

class StreamActivationCodeList extends Component {
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


  messageUpdate(appUpdate, index) {
    return ({
        activationCode: appUpdate.activation_code,
        streamListUrl: appUpdate.streamlist_url,
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
    apiService.streamlistActivationCodes(pageNum).then((appUpdateListdata) => {

      if (typeof appUpdateListdata.status != 'undefined' && appUpdateListdata.status) {

        this.setState({
          appUpdateData: appUpdateListdata.data.IBOStreamlistActivationCode,
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
    console.log('appUpdateList--', appUpdateList);
    const data = {
      columns: [
        {
          label: 'Activation Code',
          field: 'activationCode',
        },
        {
          label: 'StreamList URL',
          field: 'streamListUrl',
        }
      ],
      rows: appUpdateList.map((appUpdate, index) => this.messageUpdate(appUpdate, index))
    };


    return (
      <div className='animated fadeIn'>
        
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> Activation Code {' '}
                  <small className='text-muted'>List</small>
                  {/* <Link to="/add-appUpdates" className="fa fa-plus btn-sm btn btn-info feature-btn" > &nbsp; Add appUpdate </Link> */}
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
export default StreamActivationCodeList;