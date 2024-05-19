import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { Popconfirm } from "antd";
import { MDBDataTable } from 'mdbreact';

class ResellerNotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      resNotifListData: [],
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




  resellerNotification(resNotif, index) {
    const changeStatusTo = resNotif.status == '1' ? 0 : 1;
    const _changeStatusTo = resNotif.status == '1' ? 'inactivate' : 'activate';
    const statusChangeMessage =
      'Are you sure, you want to change status of this notification to ' +
      _changeStatusTo +
      '?'
    const statusTitle = 'Click to ' + _changeStatusTo
    const getBadge = (status) => {
      return status == "1"
        ? "success"
        : status == "0"
          ? "secondary"
          : status === "pending"
            ? "warning"
            : status === "deleted"
              ? "danger"
              : "primary";
    };
    return ({
      title: resNotif.title,
      description: resNotif.description,
      status: <Popconfirm
      title={statusChangeMessage}
      onConfirm={() =>
        this.deleteUser(resNotif.id, changeStatusTo, false, index)
      }
      okText='Yes'
      cancelText='No'
    >
      <Badge color={getBadge(resNotif.status)} title={statusTitle}>
        {resNotif.status == 1 ? "Active" : "Inactive"}
      </Badge>
    </Popconfirm>,
      action: <>
      {/* <Link to="#" title="Edit Reseller" onClick={() => this.editNotification(user)}>
        <i className='fa fa-edit' /> &nbsp;|&nbsp;{' '}
      </Link> */}
        <Popconfirm
          title="Are you sure to disable this notification?"
          onConfirm={() => this.deleteNotification(resNotif.id, 2, true, index)}
          okText="Yes"
          cancelText="No"
        >
          <Link to='#' title="Remove Notification">
            <i className='fa fa-remove' />
          </Link>
        </Popconfirm></>
    })
  }

  deleteNotification(appUpdateId, status, isDeleteClicked, index) {
    this.setState({
      loader: true,
      showAlert: false
    }, () => {
      apiService.deleteNotification(appUpdateId, status)
        .then((deletedData) => {
          if (typeof deletedData.success != 'undefined' && typeof deletedData.success) {
            if (isDeleteClicked) {
              this.state.resNotifListData.splice(index, 1)
            } else {
              this.state.resNotifListData.map((appUpdate, arrIndex) => {
                if (appUpdate.id === appUpdateId) {
                  appUpdate.status = status
                }
              })
            }
            this.setState({
              loader: false,
              resNotifListData: this.state.resNotifListData
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

  _fetchResNotifiList = (pageNum) => {
    let formData = {
      isValid: true,
      pageNo: pageNum
    };
    apiService.resNotifList(formData).then((resNotifList) => {

      if (typeof resNotifList.status != 'undefined' && resNotifList.status) {

        this.setState({
          resNotifListData: resNotifList.data.ResellerNotification,
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
    this._fetchResNotifiList(0);
  }


  UpdatedRowData = (rowData) => {
    this.state.resNotifListData.map((resNotif, index) => {
      if (resNotif.id === rowData.id) {
        resNotif = rowData;
      }
    });
  }

  render() {

    const resNotifData = this.state.resNotifListData.filter((resNotifData) => resNotifData.id);

    const data = {
      columns: [
        {
          label: 'Title',
          field: 'title',
        },
        {
          label: 'Description',
          field: 'description',
        },
        {
          label: 'Status',
          field: 'status',
        },
        {
          label:'Action',
          field:'action'
        }


      ],
      rows: resNotifData.map((resNotif, index) => this.resellerNotification(resNotif, index))
    };


    return (
      <div className='animated fadeIn'>

        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className='fa fa-align-justify' /> Reseller Noification {' '}
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
export default ResellerNotificationList;