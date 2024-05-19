import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiService } from "../../_services/api.service";
import { formatDateTime } from "../../_helpers/helper";
import { Dropdown, Modal, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { MDBDataTable } from 'mdbreact';
import './style.css';
const loggegdInData = JSON.parse(localStorage.getItem('userData_' + localStorage.getItem('token')));
const getStatusString = (status) => {
    return status == "1"
        ? "Open"
        : status == "2"
            ? "Resolved"
            : status === "3"
                ? "ReOpen"
                : status === "4"
                    ? "Closed"
                    : "withdraw";
}
class TicketListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            myTickets: [],
            currentPage: 0,
            setCurrentPage: 0,
            listCount: 10,
            showEditPage: false,
            singleData: null,
            confirmLoading: false,
            showModal: false,
            ticketModalContent: null
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

    changeStatus = (ticketId, status) => {

        let formData = {};
        formData.module = 'MASA';
        formData.channelId = 'MASAPLAYER';
        formData.requestId = 'IBOPLAYERAPP2';
        formData.requestData = {
            createdBy: loggegdInData.id,
            ticketId:ticketId,
            status:status
        };
        apiService.changeTicketStatus(formData).then((myTickets) => {

            if (typeof myTickets.status != 'undefined' && myTickets.status) {

                this.setState({
                    showAlert: true,
                    alertType: "success",
                    alertBody: `Updated Status to !${getStatusString(status)}`

                });
            } else {
                this.setState({
                    showAlert: true,
                    alertType: "danger",
                    alertBody: "Failed to update Tickets!"

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

    viewTicket = (ticketData) => {
        this.setState({
            showModal: true
        }, (prevState) => {
            this.setState({
                ticketModalContent: this.ticketModalBody(ticketData)
            });
        });
    }

    closeModal = () => {
        this.setState({
            showModal: false
        });
    }

    ticketModalBody = (ticketData) => {
        return (<div className="col-md-12">

            <p>Status: <span style={{ "color": "yellow" }}>{getStatusString(ticketData.status)}</span></p>
            <p>Created At: <span>{formatDateTime(ticketData?.created_at)}</span></p>
            <p>Attendend At: <span>{ticketData?.attended_at ? formatDateTime(ticketData?.attended_at) : "NA"}</span></p>
            <p>Attendend By: <span>{ticketData?.admin?.name ? ticketData?.admin?.name : "NA"}</span></p>
            <p>Comments By Admin: <span>{ticketData?.admin_comment ? ticketData?.admin_comment : "NA"}</span></p>


        </div>)

    };

    tickets(ticket, index) {
        const getBadge = (status) => {
            return status == "1"
                ? "warning"
                : status == "2"
                    ? "success"
                    : status === "3"
                        ? "warning"
                        : status === "4"
                            ? "success"
                            : "primary";
        };

        return ({
            title: ticket.title,
            status: <Badge color={getBadge(ticket.status)} title="Status">
                {getStatusString(ticket.status)}
            </Badge>,
            description: ticket.description,
            createdAt: formatDateTime(ticket.created_at),
            action: <>
                <Link to="#" title="View Ticket" onClick={() => this.viewTicket(ticket)}>
                    <i className="fa fa-eye"></i> &nbsp;|&nbsp;
                </Link>
                {ticket.status === '2' ?
                    <Link to="#" title="Reopen Ticket" onClick={() => this.changeStatus(ticket.id, 3)}>
                        <i className="fa fa-unlock"></i> &nbsp;|&nbsp;
                    </Link>
                    : null}
                {ticket.status === '1' ?
                    <Link to="#" title="Withdraw Ticket" onClick={() => this.changeStatus(ticket.id, 0)}>
                        <i className="fa fa-undo"></i> &nbsp;|&nbsp;
                    </Link>
                    : null}

            </>

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

    _fetchTickets = () => {
        let formData = {};
        formData.module = 'MASA';
        formData.channelId = 'MASAPLAYER';
        formData.requestId = 'IBOPLAYERAPP2';
        formData.requestData = {
            createdBy: loggegdInData.id
        };
        apiService.myTickets(formData).then((myTickets) => {

            if (typeof myTickets.status != 'undefined' && myTickets.status) {

                this.setState({
                    myTickets: myTickets.data.MyTickets,
                });
            } else {
                this.setState({
                    showAlert: true,
                    alertType: "danger",
                    alertBody: "Failed to load Tickets!"

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
        this._fetchTickets(0);
    }


    UpdatedRowData = (rowData) => {
        this.state.appUpdateData.map((appUpdate, index) => {
            if (appUpdate.id === rowData.id) {
                appUpdate = rowData;
            }
        });
    }

    render() {

        const myTickets = this.state.myTickets.filter((ticket) => ticket.id);
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
                    label: 'Created At (UTC)',
                    field: 'createdAt'
                },
                {
                    label: 'Action',
                    field: 'action'
                }
            ],
            rows: myTickets.map((ticket, index) => this.tickets(ticket, index))
        };

        const { confirmLoading } = this.state;
        return (
            <div className='animated fadeIn'>

                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <i className='fa fa-align-justify' /> My Ticket {' '}
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
                {this.state.showModal ? <Modal title="Ticket Details"
                    open={this.state.showModal}
                    onOk={null}
                    confirmLoading={confirmLoading}
                    onCancel={this.closeModal}

                    cancelText=""
                    okText=""
                    zIndex="1000"
                    footer={null}
                >
                    {this.state.ticketModalContent}
                </Modal> : null}
            </div>
        )
    }
}
export default TicketListComponent;