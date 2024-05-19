import React, { Component } from 'react'
import { Form, Input, Button, Modal, Badge, Popconfirm } from 'antd'
//import { Link } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { apiService } from '../../_services/api.service'
import Loader from '../../../Loader'
import AlertMsgComponent from '../../../AlertMsgComponent'
import { MDBDataTable } from 'mdbreact'
import { formatDateTime } from '../../_helpers/helper'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
let loggedInUserData = JSON.parse(
    localStorage.getItem('userData_' + localStorage.getItem('token'))
)
export default class IBOProTVApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            alertType: 'danger',
            showAlert: false,
            alertBody: '',
            codeListData: [],
            modalVisible: false,
            userId: false,
            userObj: {},
            modalTitle: '',
            modalBodyContent: "",
            numberOfCodes: 1,
            creditPoint: 1,
            playlistModalVisible: false,
            playlistArr: [
                {
                    name: '',
                    url: ''
                }
            ],
            codeID: null
        }
        this.closeModal = this.closeModal.bind(this);
        this.generateCodes = this.generateCodes.bind(this);
        this.handlePlayListChange = this.handlePlayListChange.bind(this);
        //this.modalBodyContent = this.modalBodyContent.bind(this);
    }

    componentDidMount() {
        this._fetchCodeList();
    }

    addClickToAddMoreStreamlist() {
        this.setState(prevState => ({
            playlistArr: [...prevState.playlistArr, { name: "", url: "" }]
        }))
    }


    closeModal() {
        this.setState({
            modalVisible: false,
            playlistModalVisible:false
        });
    }


    removeClick(i) {
        var playlistArr = [...this.state.playlistArr];
        playlistArr.splice(i, 1);
        this.setState({ playlistArr });
    }

    onFinish = () => {
        let formPost = {
            module: 'MASA',
            channelId: 'MASAPLAYER',
            requestId: 'IBOPLAYERAPP2',
            requestData: {
                codes: this.state.numberOfCodes,
                creditCount: this.state.creditPoint,
                resellerId: loggedInUserData.id
            }
        };

        this.setState({ loader: true, showAlert: false }, () => {
            apiService
                .addCodeForIboPro(formPost)
                .then(response => {
                    if (typeof response.status != 'undefined' && response.status) {



                        let dedcCredit = parseInt(this.state.numberOfCodes) * parseInt(this.state.creditPoint);
                        let resCreditPoint = parseInt(loggedInUserData.resCreditPoint) - parseInt(dedcCredit);
                        //update reseller credit point with all specific session data
                        localStorage.setItem('userData_' + localStorage.getItem('token'), JSON.stringify({
                            'id': loggedInUserData.id,
                            'email': loggedInUserData.email,
                            'name': loggedInUserData.firstname,
                            'username': loggedInUserData.username,
                            'roleId': loggedInUserData.roleId,
                            'resCreditPoint': resCreditPoint,
                            'isVerifiedImage': true,
                            'userImage': "kljfkdfjk",
                            'userIdCard': "kdjfhkg",
                            'imageApproveComment': "kljg",
                            'roleName': loggedInUserData.roleId + "_" + loggedInUserData.id
                        }));

                        this.setState({
                            loader: false,
                            alertType: 'success',
                            showAlert: true,
                            alertBody: response.msg,
                            modalVisible: false
                        })
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        this.setState({
                            loader: false,
                            alertType: 'danger',
                            showAlert: true,
                            alertBody: 'Failed to add credit',
                            modalVisible: false
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Something Went wrong',
                        modalVisible: false
                    })
                })
        })
    }

    _fetchCodeList() {
        let formData = {
            module: 'MASA',
            channelId: 'MASAPLAYER',
            requestId: 'IBOPLAYERAPP2',
            requestData: {
                resellerId: loggedInUserData.id
            }
        };

        this.setState({ loader: true }, () => {
            apiService
                .fetchCodeList(formData)
                .then((codeListRespData) => {

                    console.log("codeListRespData", codeListRespData);
                    this.setState({
                        loader: false
                    });
                    if (
                        typeof codeListRespData.status != "undefined" &&
                        codeListRespData.status
                    ) {
                        this.setState({
                            codeListData: codeListRespData.data.CodeListData
                        });
                    } else {
                        this.setState({
                            showAlert: true,
                            alertType: "danger",
                            alertBody: "Failed to load iboprotv code list data!",
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

    totalCodesToBeGenerated = (e) => {
        let value = e.target.value;
        value.replace(/\s/g, null);
        value = parseInt(value);
        this.setState({
            numberOfCodes: value
        });
    }

    updateCreditPointVal = (e) => {
        this.setState({
            creditPoint: e.target.value
        });
        console.log("credit point val", e.target.value);
    }

    generateCodes = () => {
        return (<div className="col-md-12 row">

            <div className="col-md-12">
                <div class="form-group">
                    <label>Select Credit Count*</label>
                    <select onChange={(e) => this.updateCreditPointVal(e)} class="form-control" id="credit_count">
                        <option value="1">1 Credit For 1 Year</option>
                        <option value="2">2 Credits For LifeTime</option>
                    </select>
                </div>
                <label htmlFor="updateCreditPointVal">Number of Codes (Default 1): </label>
                <input id="numberOFCodes"
                    className="form-control" type="number" placeholder="Credit Point" name="numberOFCodes"
                    onChange={this.totalCodesToBeGenerated.bind(this)} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} onPaste={(e) => e.preventDefault()} autoComplete="off" />
            </div>
        </div>)
    };

    deductCreditModal(codeData) {
        let str = "Generate Codes";

        this.setState({
            modalVisible: true,

            userObj: codeData,
            modalTitle: str,
            creditModType: 'DEBIT',
            modalBodyContent: this.generateCodes()
        });
    }

    codeListTable = (code, index) => {

        const getBadge = (status) => {
            return status == 0
                ? "success"
                : status == 1
                    ? "secondary"
                    : status === "pending"
                        ? "warning"
                        : status === "deleted"
                            ? "danger"
                            : "primary";
        };
        const changeStatusTo = code.status == '1' ? 0 : 1;
        const _changeStatusTo = code.status == '1' ? 'inactivate' : 'activate';
        const statusChangeMessage =
            'Are you sure, you want to change status of this code to ' +
            _changeStatusTo +
            '?'
        const statusTitle = 'Click to ' + _changeStatusTo;
        return ({
            code: code.code,
            expiryDate: code.expire_date,
            usedCredit: code.credit_count,
            createdAt: formatDateTime(code.created_time),
            status: <Badge color={getBadge(code.disabled)} title={statusTitle}>
                {code.disabled == 0 ? "Active" : "Inactive"}
            </Badge>,
            action: <div>
                <Link to="#" title="Edit Playlist" onClick={() => this.showPlaylistModal(code)}>
                    <i className='fa fa-edit' style={{ color: 'green' }} /> &nbsp;|&nbsp;{' '}
                </Link>
                
                {code.disabled == 0 ? 
                
                <Link to="#" title="Disable Code" onClick={() => this.changeStatus(code, 1)}>
                    <i className='fa fa-ban' style={{ color: 'red' }} />
                </Link>
                :<Link to="#" title="Restore Code" onClick={() => this.changeStatus(code, 0)}>
                    <i className='fa fa-window-restore' style={{ color: 'green' }} />
                </Link> }
            </div>
        })
    }

    addEditPlaylist = () => {
        let formPost = {
            module: 'MASA',
            channelId: 'MASAPLAYER',
            requestId: 'IBOPLAYERAPP2',
            requestData: {
                codeId: this.state.codeID,
                resellerId: loggedInUserData.id,
                playlistArr: this.state.playlistArr
            }
        };

        this.setState({ loader: true, showAlert: false }, () => {
            apiService
                .addEditPlaylist(formPost)
                .then(response => {
                    if (typeof response.status != 'undefined' && response.status) {

                        this.setState({
                            loader: false,
                            alertType: 'success',
                            showAlert: true,
                            alertBody: response.msg,
                            playlistModalVisible: false
                        })
                        setTimeout(() => {window.location.reload()}, 2000);
                    } else {
                        this.setState({
                            loader: false,
                            alertType: 'danger',
                            showAlert: true,
                            alertBody: 'Failed to add playlist',
                            playlistModalVisible: false
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Something Went wrong',
                        playlistModalVisible: false
                    })
                })
        })
    }

    showPlaylistModal(codeData) {

        this.setState({
            playlistModalVisible: true,
            codeID: codeData._id,
            playlistArr:codeData.playlists
        });
    }

    changeStatus = (code, status) =>{
        let formPost = {
            module: 'MASA',
            channelId: 'MASAPLAYER',
            requestId: 'IBOPLAYERAPP2',
            requestData: {
                codeId: code._id,
                resellerId: loggedInUserData.id,
                status:status
            }
        };

        this.setState({ loader: true, showAlert: false }, () => {
            apiService
                .changeCodeStatus(formPost)
                .then(response => {
                    if (typeof response.status != 'undefined' && response.status) {

                        this.setState({
                            loader: false,
                            alertType: 'success',
                            showAlert: true,
                            alertBody: response.msg
                        })
                        setTimeout(() => {window.location.reload()}, 2000);
                    } else {
                        this.setState({
                            loader: false,
                            alertType: 'danger',
                            showAlert: true,
                            alertBody: 'Failed to add playlist',
                            playlistModalVisible: false
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        loader: false,
                        showAlert: true,
                        alertType: 'danger',
                        alertBody: 'Something Went wrong',
                        playlistModalVisible: false
                    })
                })
        })

    }

    handlePlayListChange(e, i) {
        const { name, value } = e.target;
        var playlistArr = [...this.state.playlistArr];
        playlistArr[i] = { ...playlistArr[i], [name]: value };
        this.setState({ playlistArr });
    }

    createUIForStreamList() {
        return this.state.playlistArr.map((el, i) => (
            <Form.Item label="Stream Url" style={{ marginBottom: 0, backgroundColor: "grey", color: "white", padding: '6px', marginBottom: '5px', borderRadius: '3px' }} key={i}  >
                <Form.Item

                    rule={[
                        { required: true, message: "Please Add Name!" },
                    ]}
                    style={{ display: 'block' }}>
                    <Input
                        placeholder="Stream Name"
                        name="name"
                        value={el.name || ''}
                        onChange={(e) => this.handlePlayListChange(e, i)} />
                </Form.Item>
                <Form.Item

                    rule={[
                        { required: true, message: "Please Add Url!" },
                    ]}
                    style={{ display: 'block', margin: '0 1px' }}>
                    <Input
                        placeholder="Stream Url"
                        name="url"
                        value={el.url || ''}
                        onChange={(e) => this.handlePlayListChange(e, i)} />
                </Form.Item>
                <input type='button' className='btn btn-sm btn-danger' style={{ "marginTop": "8px" }} value='remove' onClick={(e) => this.removeClick(e, i)} />
            </Form.Item>
        ))
    }


    render() {
        const codeList = this.state.codeListData.filter((user) => user._id);
        const data = {
            columns: [
                {
                    label: 'Code',
                    field: 'code',
                },
                {
                    label: 'Used Credit',
                    field: 'usedCredit',
                },
                {
                    label: 'Expiry Date',
                    field: 'expiryDate'
                },
                {
                    label: 'Mac Address',
                    field: 'macAddress'
                }, {
                    label: 'Status',
                    field: 'status'
                },
                {
                    label: 'Created At ( GMT )',
                    field: 'createdAt',
                },
                {
                    label: 'Action',
                    field: 'action',
                },
            ],
            rows: codeList.map((user, index) => this.codeListTable(user, index))
        };
        const { userId, modalVisible, playlistModalVisible, modalTitle, modalBodyContent, confirmLoading } = this.state;

        return (
            <div>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardHeader>
                                {this.state.loader ? <Loader /> : ''}
                                <i className="fa fa-align-justify"></i> IboPro Code{" "}
                                <small className="text-muted">Form</small>
                                <button onClick={() => this.deductCreditModal()} className="btn btn-sm btn-info feature-btn fa fa-plus">&nbsp;Create New Code</button>
                            </CardHeader>
                            <CardBody>
                                {this.state.loader ? <Loader /> : ''}
                                {this.state.showAlert ? (
                                    <AlertMsgComponent
                                        alertType={this.state.alertType}
                                        alertBody={this.state.alertBody}
                                    />
                                ) : (
                                    ''
                                )}
                               
                                <MDBDataTable
                                    striped
                                    noBottomColumns={true}
                                    responsive={true}
                                    bordered
                                    hover
                                    data={data}
                                />
                                <Modal title={modalTitle}
                                    visible={modalVisible}
                                    onOk={() => this.onFinish(userId)}
                                    confirmLoading={confirmLoading}
                                    onCancel={this.closeModal}

                                    cancelText="Cancel"
                                    okText="Update"
                                    zIndex="1000"
                                    footer={[
                                        <Button key="back" onClick={this.closeModal}>
                                            Cancel
                                        </Button>,
                                        <Button key="submit" type="primary" loading={confirmLoading} onClick={() => this.onFinish(userId)}>
                                            Create
                                        </Button>,
                                    ]}
                                >
                                    {modalBodyContent}
                                </Modal>
                                <Modal title="Playlist Add/Edit Form"
                                    visible={playlistModalVisible}
                                    onOk={() => this.addEditPlaylist()}
                                    confirmLoading={confirmLoading}
                                    onCancel={this.closeModal}

                                    cancelText="Cancel"
                                    okText="Store"
                                    zIndex="1000"
                                    footer={[
                                        <Button key="back" onClick={this.closeModal}>
                                            Cancel
                                        </Button>,
                                        <Button key="submit" type="primary" loading={confirmLoading} onClick={() => this.addEditPlaylist()}>
                                            Create
                                        </Button>,
                                    ]}
                                >
                                    <i className="fa fa-plus-circle fa-2x" title="Add More Playlist" style={{ color: "green" }} onClick={this.addClickToAddMoreStreamlist.bind(this)}  ></i>
                                    <div style={{ maxHeight: '300px', overflowX: 'hidden', overflowY: 'auto' }}>
                                        {this.createUIForStreamList()}
                                    </div>
                                </Modal>

                            </CardBody>
                        </Card>
                    </Col>

                </Row>
            </div>
        )
    }
}
