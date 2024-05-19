import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiService } from "../../_services/api.service";
import offerBanner from '../../../assets/img/more-info.png';
class Offers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,     
      resellerNotifications:[]
    }
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
    apiService.getRealNotifAll(formData).then((resNotification) => {
      if (typeof resNotification.status !== undefined && resNotification.status) {
        
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

  componentDidMount() {
    this.getLiveNotification();
  }

  
  UpdatedRowData = (rowData) => {
    this.state.resellerNotifications.map((resNotif, index) => {
      if(resNotif.id === rowData.id){
        resNotif = rowData;
      }
    });
  }

  render() {
    
    return (
      <div className='animated fadeIn'>
        
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' /> Reseller Offers {' '}
                  <small className='text-muted'>List</small>
                
                </CardHeader>
                <CardBody >
                   <ul style={{background: "#3eb34d7a", "listStyleType":"none"}}>
                    {this.state.resellerNotifications.length > 0 ? this.state.resellerNotifications.map( (value, key) => {
                        return(<li  key={key} style={{borderBottom:"2px solid grey", padding:"10px"}}>
                        
                            <i style={{align: "center"}}>{key+1} : {value.title}</i>
                            <p>Offer Detail: 
                            <span dangerouslySetInnerHTML={ { __html: value.description}} >
           
           </span>
                            </p>
                        </li>)
                    }): null}
                    </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
      </div>
    )
  }
}
export default Offers;