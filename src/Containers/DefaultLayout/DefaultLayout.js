import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Modal } from 'antd';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { apiService } from '../../admin/_services/api.service';
import {
 
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props){
    super(props);
    this.state = {
      closeSideBar:false
    };
    
  }
  loading = () => <div className="animated fadeIn pt-1 text-center" style={{color:"white"}}>Loading...</div>

  componentDidMount(){
    let localData = JSON.parse(localStorage.getItem('userData_'+localStorage.getItem('token')));
    if(localData === null || localData.id === undefined || localData.roleId === undefined){
      this.props.history.push("/");
    }
   
    if(this.props.location.pathname === '/exams'){
      this.setState({closeSideBar:"true"})
    }

  }

  

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">
       
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          {(this.state.closeSideBar === "true") ? <AppSidebar fixed display="lg" >
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>: <AppSidebar fixed display="lg" minimized >
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>}
          
          <main className="main">
            <br></br>
            
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                   
                    return route.component ? (
                      
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  
                  <Redirect from="/users" to="/users" />
                </Switch>
              </Suspense>
            </Container>
          </main>
         
        </div>
        <br></br>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;