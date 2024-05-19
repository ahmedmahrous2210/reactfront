import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import 'react-toastify/dist/ReactToastify.css';
import Loader from  '../../../Loader';

import { MDBDataTable } from 'mdbreact';
const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));

class ClientTransactionsLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader:false,
      usersData: [],
      userId: false,
      listCount: 25,
      setCurrentPage: 0,
      currentPage: 0,
      editPage:false,
      editData:null,
      modalVisible:false,
      confirmLoading:false,
      modalBodyContent:'',
      updateCreditPointVal:0,
      profileModalVisible:false,
      updateCreditValErrMsg:false,
      assignToReseller: false
      
    };
  }

  _fetchUserActivationLogs(pageNum) {
    apiService
      .clientUserActiLogs({"isValid":true, "channelId":"MASAPLAYER", "module":"MASA", "requestId":"IBOPLAYERAPP2", "userId":loggegdInData.id, "groupId": loggegdInData.roleId})
      .then((userListData) => {
        
        if (
          typeof userListData.status != "undefined" &&
          userListData.status
        ) {
          this.setState({
            usersData: userListData.data.UserActiTranLogs,
          });
        } else {
          this.setState({
            showAlert: true,
            alertType: "danger",
            alertBody: "Failed to load data!",
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

  componentDidMount() {
    this._fetchUserActivationLogs(0);
  }



  userTable = (user, index) => {
    return({
            creditPoint: user.credit_point,
            moduleName: user.module,
            channelName: user.channel_id,
            boxExpiry: user.box_expiry_date,
            macAddress: user.mac_address,
            createdAt: formatDateTime(user.created_at)
           
        })
  }
  
  render() {
    const userList = this.state.usersData.filter((user) => user.id);
    
    const data = {
      columns: [
        {
          label: 'Credit Point',
          field: 'creditPoint',
        },
        {
          label: 'Module',
          field: 'moduleName',
        },
        {
            label: 'Box Expiry',
            field: 'boxExpiry'
        },
        {
            label: 'Channel Name',
            field: 'channelName'
        },
        {
          label: 'Mac Address',
          field: 'macAddress'
        },
        {
          label: 'Created At',
          field: 'createdAt',
        }     
      ],
      rows:userList.map((user, index) => this.userTable(user,index))
    };
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                User Activation Transaction Logs:
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
    );
  }
}
export default ClientTransactionsLog;
