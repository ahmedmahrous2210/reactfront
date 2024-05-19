import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import {Modal} from 'antd';
import { HashRouter, Route, Switch } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
// import { renderRoutes } from 'react-router-config';
import './App.css';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Containers
const DefaultLayout = React.lazy(() => import('./Containers/DefaultLayout'));
// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const ForgotPassword = React.lazy(() => import('./views/Pages/User/ForgotPassword'));
const VerifyResetPassword = React.lazy(() => import('./views/Pages/User/VerifyResetPassword'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
let storageUserData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      adminPanel: false,
      seconds:15,
      counter:1
    }
    this.idleTimer = null
    this.handleOnAction = this.handleOnAction.bind(this)
    this.handleOnActive = this.handleOnActive.bind(this)
    this.handleOnIdle = this.handleOnIdle.bind(this)
  }


  componentDidMount(){
    
    if(storageUserData !== null && storageUserData.roleName === 'Admin'){      
      this.setState({
        adminPanel:true
      });
    } 
  }

 


  handleOnAction (event) {
     //console.log('user did something', event)
  }

  handleOnActive (event) {
    //  console.log('user is active', event)
    //  console.log('time remaining', this.idleTimer.getRemainingTime())
  }

  handleOnIdle (event) {
    this.setState({
      counter:this.state.counter + 1
    });
    //console.log('time remaining', this.idleTimer.getRemainingTime())
     if(this.idleTimer.getRemainingTime() === 0 && this.state.counter < 2){
      Modal.confirm({
        title: 'SessionTimeout',
        content: `Your Session is about to expire, click Cancel to keep logged in!`,
        onOk : () => {
          localStorage.removeItem('token');
          localStorage.removeItem('userData_'+localStorage.getItem('token'));
          window.location = "/";
        },
        onCancel : () => {
          this.handleOnActive();
        },
      });
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData_'+localStorage.getItem('token'));
        window.location = "/";
      }, 6000);
     }
    //console.log('last active', this.idleTimer.getLastActiveTime())
  }

  render() {
    return (
      <div >
        {storageUserData !== null && storageUserData.id !== '' ?
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          timeout={1000 * 60 * 90}
          onActive={this.handleOnActive}
          onIdle={this.handleOnIdle}
          onAction={this.handleOnAction}
          debounce={250}
        />
      : null}
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />            
              <Route exact path="/forgot-pass" name="Forgot Password" render={props => <ForgotPassword {...props}/>} />           
              <Route exact path="/verify-reset-pass" name="Verify Reset Password" render={props => <VerifyResetPassword {...props}/>} />           
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
      </div>
    );
  }
}
export default App;
