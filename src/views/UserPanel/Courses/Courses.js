import React, { Component } from "react";
import { Modal, Button, DatePicker ,Collapse} from 'antd';

import { apiService } from '../../../admin/_services/api.service';
import "./Courses.css";
import Parser from 'html-react-parser';
import {ToastContainer, toast } from 'react-toastify';
import ExamStep from "../ExamStep/ExamStep";
import Loader from '../../../Loader';
import AlertMsgComponent from './../../../AlertMsgComponent';

import '../../../assets/css/modal.css';
const { Panel } = Collapse;
const modalStylewidth = {
  width: '100px',

}

const loggegdInData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
export default class Courses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      courseData: [],
      visible: false,
      modalData:null,
      modalTitle:null,
      alertType: 'danger',
      showAlert: false,
      alertBody: '',
      courseContent:''
    }
  }

  renderCourses(courses){
   // const imageUrl = `http://placehold.it/110x110/607d8b/fff?text=${courses.courseId.name}`;
   return (
    <Panel header={courses.course[0].name} key={courses._id}>
      {courses.exams.length > 0  ? 
      <p>
        <ul style={{"listStyleType":"circle"}}>
        {courses.exams.map((exam, examKey) => {
          return(<li key={examKey} >Exam - <i><strong>{exam.name}</strong></i> - <a onClick={() => this.renderModal(exam, courses.course[0].content, this)}>
          <i className="fa fa-hand-o-right mr-12"></i>
           Click to schedule
          </a></li>
          )
        })}
        </ul>
      </p>
      
      : "No exam available."} 
    <p>{(courses.course[0].content ? Parser(courses.course[0].content) : 'No content available')}</p>
   </Panel>

   );
  }

  submitExamSch = (e, exam) => {
    e.preventDefault();
    let formData = {examId:exam.examId, userId:loggegdInData.id,  createdBy:loggegdInData.id}
    this.setState({ loader: true, showAlert:false, visible:false }, () => {
      apiService.submitExamSchedule(formData).then((response) => {
        
        this.setState({
          loader: false
        });
        if (typeof response.success !== 'undefined' && response.success) { 
          toast.success("Successfully submitted examschedule", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });      

        } else {
          toast.error(response.message ? response.message : 'Examschedule submission failed.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });   
        }
      }).catch(error => { console.log("Catch=", error) });
    });
  }

  renderModal = (modalData, courseContent) => {
    
    this.setState({
      visible: true,
      modalData:modalData,
      modalTitle:modalData.name,
      courseContent:courseContent
    });
  }
  
  setExamTimeSlot = (timeSlot) => {

  }

  setModalCourses = () => {
    this.setState({
      visible1: true
    });
  };

  setModalVisibleOk = () => {
    this.setState({
      visible: false
    });
  };

  setModalVisibleCancel = () => {
    this.setState({
      visible: false
    });
  };

  _fetchCoursesList(pageNum) {
    this.setState({ loader: true }, () => {
      apiService.coursesExam(pageNum).then((courseList) => {
        this.setState({
          loader: false
        });
        if (typeof courseList.success !== 'undefined' && courseList.success) {          
          this.setState({
            courseData: courseList.data
          });          

        } else {
          this.setState({
            error: ['Invalid Credential.']
          });
        }
      }).catch(error => { console.log("Catch=", error) });
    });
  }

  componentDidMount() {
    this._fetchCoursesList(0);
  }

  render() {
    const courseDataList = this.state.courseData.filter((courses)=>courses._id);
    return (
      <div>
        {this.state.showAlert ? <AlertMsgComponent alertType={this.state.alertType} alertBody={this.state.alertBody} /> : ''}
        {this.state.loader ?  <Loader />: null}
        <h3>Schedule Course - Exam:</h3><hr/>
        <div className="container">
        <ToastContainer />
          <div className="row">
          <Collapse defaultActiveKey={['1']}>
          {courseDataList.map((user, index) => (
          
            this.renderCourses(user)
            ))}
              </Collapse>




          </div>
        </div>
        {this.state.modalData !==null ? 
        <Modal centered className="scheduleExamModal modal-dialog modal-xl" style={{ width: "700px" }}
          title={this.state.modalTitle}
          visible={this.state.visible}
          onOk={(e) => this.submitExamSch(e, this.state.modalData, this)}
          onCancel={this.setModalVisibleCancel}
          okText="Schedule Exam">
          <div className="row">
            
            <div className="col-md-8 col-sm-8 col-xs-8">
            {(this.state.courseContent ?Parser(this.state.courseContent) : 'No content available')}
            </div>
          </div>

        </Modal>
      : null}
      </div>

    );
  }
}