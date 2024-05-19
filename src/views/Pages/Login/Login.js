import { AppNavbarBrand } from '@coreui/react';
import React, { Component } from 'react';
import Reaptcha from 'reaptcha';
import { Button, Card, CardBody, CardGroup, Col, Container,  Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import {apiService} from '../../../admin/_services/api.service';
import AlertMsgComponent from '../../../AlertMsgComponent';
import Loader from '../../../Loader';
import logo from '../../../assets/img/brand/new-logo.png';
import bg_img_two from '../../../assets/img/brand/bg_img_two.png';


const webLogoLocalStorage = localStorage.getItem('webLogo');
var loginLogo;
if(webLogoLocalStorage === null){
  loginLogo = logo;
}else{
  loginLogo = webLogoLocalStorage;
}
class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:'',
      error:[],
      loader:false,
      alertType:'danger',
      verified: true,
    }
  }

  componentDidMount(){
    let localData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));    
    if(localData != null &&  typeof localData.id != 'undefined'){
      this.props.history.push("/dashboard");
    }

  }

  // Function to add our give data into cache
  addDataIntoCache = (cacheName, url, response) => {
    // Converting our response into Actual Response form
    //const data = new Response(JSON.stringify(response));
  //console.log("himanshu----",cacheName, "---dd---", response );
    if ('caches' in window) {
      //console.log("khushbu----",cacheName, "---dd---", response );
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache) => {
        cache.put(url, response);
        alert('Data Added into cache!')
      });
    }

    return false;
  };


  onLoad = () => {
    this.setState({
        captchaReady: true
    });
};

onVerify = recaptchaResponse => {
    this.setState({
        verified: true
    });
};

  usernameOnChange = (e) =>{
    e.preventDefault();
    this.setState({
      username:e.target.value
    });
  }

  passwordOnChange = (e) => {
    e.preventDefault();

    this.setState({
      password:e.target.value
    });
  }
  
  onSubmit = (e) => {
    localStorage.clear();
    localStorage.removeItem('userData_'+localStorage.getItem('token'));
    e.preventDefault();
    let formData = {email:this.state.username, password:this.state.password};
    this.setState({loader: true, error:[]}, () => {
		// localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 
    //       'id':'jhkhu89989',
    //       'email': 'hima@gmail.com',
    //       'name': 'himanshu',
    //       'username': 'himanshu',
    //       'roleId':'kjh987y98yh98h9',
    //       'isVerifiedImage':true,
    //       'userImage':'jhg87y87',
    //       'userIdCard':'kjhxk',
    //       'imageApproveComment':'xkjhkx',
    //       'roleName':'admin'}));          
    //     window.location = "/";return;
    apiService.login(formData).then((loginResponse) => {
      this.setState({
        loader:false
      });
      if(typeof loginResponse.status !='undefined' && typeof loginResponse.token != 'undefined' && loginResponse.token !== '' && loginResponse.status){
        
        if(loginResponse.data.IBOReseller.group_id == 1){
          this.setState({          
            error:["Access denied from this portal for Super Admin."]
          });
          return false; 
        }

        //this.addDataIntoCache('webLogo', 'http://192.168.0.103:3001/', loginResponse);
        localStorage.setItem('webLogo', loginResponse.data.IBOReseller.web_logo);
        //return false;
        localStorage.removeItem('token');
        localStorage.setItem('token', loginResponse.token);
        localStorage.removeItem('userData_'+localStorage.getItem('token'));
        localStorage.setItem('userData_'+localStorage.getItem('token'), JSON.stringify({ 
          'id':loginResponse.data.IBOReseller.id,
          'email': loginResponse.data.IBOReseller.email,
          'name': loginResponse.data.IBOReseller.firstname,
          'username': loginResponse.data.IBOReseller.username,
          'roleId':loginResponse.data.IBOReseller.group_id,
          'resCreditPoint':loginResponse.data.IBOReseller.credit_point,
          'creditSharePassword':loginResponse.data.IBOReseller.credit_share_passcode,
          'web_logo':loginResponse.data.IBOReseller.web_logo,
          'web_title':loginResponse.data.IBOReseller.web_title,
          'isVerifiedImage':true,
          'userImage':"kljfkdfjk",
          'userIdCard':"kdjfhkg",
          'imageApproveComment':"kljg",
          'roleName':loginResponse.data.IBOReseller.group_id+"_"+loginResponse.data.IBOReseller.id}));          
        window.location = "/";
      }else{
        this.setState({          
          error:[loginResponse.msg]
        });
      }
    }).catch(error => {console.log("Catch=", error)});
  });
    
}
  render() {
    return (
      // style={{backgroundImage: `url(${logo})`
      <div className="login_bg app flex-row align-items-center">
        {this.state.loader ? <Loader />: ""}
        <Container  fluid={true}>
          <Row className="justify-content-center row">
            <Col md="4">
              <CardGroup className="12">
                <Card className="p-4">
                  <CardBody>
                    <Col md="12">
                    <Form name="login" onSubmit={this.onSubmit} style={{textAlign:"center"}}>
                    {this.state.error.length > 0 ? <AlertMsgComponent alertType={this.state.alertType} alertBody={this.state.error}/> : ""}
                    <img src={loginLogo} alt="IBO IPTV Logo" className="img-circle navbar-brand-full"  style={{padding:"6px"}}/>
                    {/* <AppNavbarBrand full={{ src: loginLogo,  alt: 'IBO IPTV Logo'}} /> */}
                    
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>    
                        <Input type="text" name="username" onChange={this.usernameOnChange} value={this.username} placeholder="Login ID" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" onChange={this.passwordOnChange} value={this.password} placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>           
                         <div className="col-md-9" style={{marginBottom:"8px"}}>
                          <Reaptcha
                            ref={e => (this.captcha = e)}
                            sitekey="6Lf-V-kdAAAAAI97IVi3fA8QVTA_jhr2KPth4G_5"
                            onVerify={this.onVerify}
                            size="normal"
                          />
                        </div>
                      </Row> 
                      <Row></Row>
                      <Row>
                        <Col md="12">
                          <button className="bor_rad btn-block" onClick={this.onSubmit} 
                          disabled={!this.state.verified}>Sign In</button>
                        </Col>
                      </Row>
                      
                    </Form>
                    </Col>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
