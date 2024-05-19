import { authHeader } from '../_helpers/authHeader'
import { handleResponse } from '../_helpers/handleResponse'
import { func } from 'prop-types';
//import axios
import {encryption} from './encryption';
var CryptoJS = require("crypto-js");
const env = process.env.NODE_ENV || 'development'
const config = require(`./../../config/${env}.js`)
const baseUrl = config.PROCTOR_API_URL


export const apiService = {
  login,
  addUser,
  userList,
  removeUser,
  getUserById,
  editUser,
  AddAppUpdate,
  appUpdateList,
  addMessage,
  messageList,
  addReseller,
  resellerList,
  getResellerById,
  editReseller,
  removeReseller,
  AddStreamListActivation,
  streamlistActivationCodes,
  searchUser,
  updateCreditPoint,
  resellerListAssigment,
  addSubReseller,
  userActiLogs,
  creditShareTranLogs,
  addStreamListCommon,
  resetPlayist,
  editMac,
  getClientDetail,
  debitCreditPoint,
  dashboardCount,
  createApplication,
  applicationList,
  appList,
  createResApplication,
  resApplicationList,
  editResellerAppSetting,
  getResAppSetting,
  removeAppSetting,
  getResCredit,
  updatePassword,
  downloadUserReports,
  downloadResCredReports,
  addResNotif,
  resNotifList,
  getRealNotif,
  getRealNotifAll,
  getRealNotifCount,
  deleteNotification,
  disableMac,
  clientList,
  addClient,
  updateCreditPointClient,
  debitCreditPointClient,
  clientUserActiLogs,
  getSocialDetails,
  fetchCodeList,
  addCodeForIboPro,
  addEditPlaylist,
  changeCodeStatus,
  multiAppActivation,
  creditSharePasswordValidate,
  addTicket,
  myTickets,
  creditSharePasswordRegister,
  changeTicketStatus,
  getChartData,
  updateCreditSharePassword,
  searchMac,
  getPassimPaymentLink,
  getPaymentDetails,
  myOrders
}

function login (formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}adminLogin`, requestOption).then(handleResponse)
}

function addUser (formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-user`, requestOption).then(handleResponse)
}

function userList (formData) {

  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}user-list`, requestOption).then(handleResponse)
}

function removeUser (userId, status) {
  let jsonData = encryption(JSON.stringify({'id':userId, 'status':status, 'isValid':true }));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}update-status`, requestOption).then(handleResponse)
}

function getUserById(formData) {
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(formData)
  }
  return fetch(`${baseUrl}user`, requestOption).then(handleResponse)
}

function editUser(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}edit-user`, requestOption).then(handleResponse)
}
function AddAppUpdate(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-appupdate`, requestOption).then(handleResponse)
}

function appUpdateList(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}appupdate-list`, requestOption).then(handleResponse)
}

function addMessage(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-message`, requestOption).then(handleResponse)
}

function messageList(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}message-list`, requestOption).then(handleResponse)
}

function streamlistActivationCodes(formData) {

  let jsonData = encryption(JSON.stringify({'id':formData, 'isValid': true}));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}acti-code-list`, requestOption).then(handleResponse)
}
function addReseller(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-reseller`, requestOption).then(handleResponse)
}

function resellerList(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}reseller-list`, requestOption).then(handleResponse)
} 

function getResellerById(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-reseller`, requestOption).then(handleResponse)
} 

function editReseller(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}edit-reseller`, requestOption).then(handleResponse)
} 

function removeReseller(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}remove-res`, requestOption).then(handleResponse)
}

function AddStreamListActivation(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-streamlist`, requestOption).then(handleResponse)
}
function searchUser(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}search-user`, requestOption).then(handleResponse)
}

function updateCreditPoint(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-credit`, requestOption).then(handleResponse)
}
function resellerListAssigment(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}res-assign-list`, requestOption).then(handleResponse)
}

function addSubReseller(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}assign-subreseller`, requestOption).then(handleResponse)
}

function userActiLogs(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}user-acti-log`, requestOption).then(handleResponse)
}

function creditShareTranLogs(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}credit-tran-logs`, requestOption).then(handleResponse)
}


function addStreamListCommon(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-playlist-common`, requestOption).then(handleResponse)
}

function resetPlayist(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}reset-playlist`, requestOption).then(handleResponse)
}


function editMac(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}edit-mac`, requestOption).then(handleResponse)
}

function getClientDetail(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}client-detail`, requestOption).then(handleResponse)
}

function debitCreditPoint(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}debit-credit`, requestOption).then(handleResponse)
}

function dashboardCount(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}dashboard-count`, requestOption).then(handleResponse)
}


function createApplication(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}create-application`, requestOption).then(handleResponse)
}

function applicationList(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}applications`, requestOption).then(handleResponse)
}

function appList(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}app-list`, requestOption).then(handleResponse)
}

function createResApplication(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}create-res-app`, requestOption).then(handleResponse)
  
}

function resApplicationList(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}res-applications`, requestOption).then(handleResponse)
  
}

function editResellerAppSetting(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}edit-res-app`, requestOption).then(handleResponse)
  
}
function getResAppSetting(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-res-app`, requestOption).then(handleResponse)
  
}

function removeAppSetting(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}remove-res-app`, requestOption).then(handleResponse)
  
}

function getResCredit(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-res-credit`, requestOption).then(handleResponse)
  
}

function updatePassword(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}update-password`, requestOption).then(handleResponse)
  
}

function downloadUserReports(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}user-acti-report`, requestOption).then(handleResponse)
  
}
function downloadResCredReports(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}res-tran-report`, requestOption).then(handleResponse)
  
}

function addResNotif(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-res-notif`, requestOption).then(handleResponse)
}

function resNotifList(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}res-notif`, requestOption).then(handleResponse)
}

function getRealNotif(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-res-notif`, requestOption).then(handleResponse)
}

function getRealNotifAll(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-res-notif-all`, requestOption).then(handleResponse)
}

function getRealNotifCount(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-res-notif-count`, requestOption).then(handleResponse)
}

function deleteNotification(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}delete-res-notif`, requestOption).then(handleResponse)
}

function disableMac(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}disable-mac`, requestOption).then(handleResponse)
}

function addClient(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-client`, requestOption).then(handleResponse)
}

function clientList(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}client-list`, requestOption).then(handleResponse)
}

function updateCreditPointClient(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-credit-client`, requestOption).then(handleResponse)
}

function debitCreditPointClient(formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}debit-credit-client`, requestOption).then(handleResponse)
}
function clientUserActiLogs (formData){
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}client-tran-logs`, requestOption).then(handleResponse)
}

function getSocialDetails(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-social-widget`, requestOption).then(handleResponse)
} 

function fetchCodeList(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-iboprotv-codelist`, requestOption).then(handleResponse)
} 

function addCodeForIboPro(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-iboprotv-code`, requestOption).then(handleResponse)
}

function addEditPlaylist(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}ibopro-add-edit-playlist`, requestOption).then(handleResponse)
}

function changeCodeStatus(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}ibopro-add-change-status`, requestOption).then(handleResponse)
}

function multiAppActivation(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-multi-app-activate`, requestOption).then(handleResponse)
}

function creditSharePasswordValidate(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}credit-share-password`, requestOption).then(handleResponse)
}

function myTickets(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}my-tickets`, requestOption).then(handleResponse)
}

function addTicket(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}add-ticket`, requestOption).then(handleResponse)
}

function creditSharePasswordRegister(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}register-credit-share-pass`, requestOption).then(handleResponse)
}

function changeTicketStatus(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}change-ticket-status`, requestOption).then(handleResponse)
}

function getChartData(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-chart-data`, requestOption).then(handleResponse)
}

function updateCreditSharePassword(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}credit-share-pass`, requestOption).then(handleResponse)
}
function searchMac(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}search-mac`, requestOption).then(handleResponse)
}

function getPassimPaymentLink(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-payment-link`, requestOption).then(handleResponse)
}

function getPaymentDetails(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-payment-details`, requestOption).then(handleResponse)
}

function myOrders(formData) {
  let jsonData = encryption(JSON.stringify(formData));
  let dataObj = {
    data:jsonData
  };
  const requestOption = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(dataObj)
  }
  return fetch(`${baseUrl}get-orders-list`, requestOption).then(handleResponse)
}


