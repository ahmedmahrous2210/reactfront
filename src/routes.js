import React from 'react'

const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/Icons/Flags'))
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'))
const SimpleLineIcons = React.lazy(() =>
  import('./views/Icons/SimpleLineIcons')
)

const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./admin/_components/Dashboard/Dashboard'));
const Inbox = React.lazy(() => import('./views/Inbox/Inbox'));
// const Users = React.lazy(() => import('./views/Users/Users'));
const Users = React.lazy(() => import('./admin/_components/User/Users'));
const User = React.lazy(() => import('./admin/_components/User/User'));


const AddUserForm = React.lazy(() =>
  import('./admin/_components/User/AddUserForm')
)


const AddStreamList = React.lazy(() =>
  import('./admin/_components/User/AddStreamList')
)

const StreamCodeList = React.lazy(() =>
  import('./admin/_components/User/StreamActivationCodeList')
)


//appupdate routes
const AddAppUpdate = React.lazy(() =>
  import('./admin/_components/AppUpdate/add-app-update')
)
const AppUpdateList = React.lazy(() =>
import('./admin/_components/AppUpdate/app-update-list')
)
const AppMessageList = React.lazy(() =>
import('./admin/_components/Message/MessageList')
)

const AddMessage = React.lazy(() =>
import('./admin/_components/Message/AddMessage')
)

const AddReseller = React.lazy(() =>
import('./admin/_components/Reseller/AddReseller')
)

const ResellerList = React.lazy(() =>
import('./admin/_components/Reseller/ResellerList')
)
const SearchUser = React.lazy(() => 
  import('./admin/_components/User/SearchUser')
);
const SubResellerAssignment = React.lazy(() => 
  import('./admin/_components/Reseller/SubResellerAssignment')
);

const CreditPointTransLogs = React.lazy(() => 
  import('./admin/_components/Dashboard/TransactionsLog')
);

const CreditPointShareTranLogs = React.lazy(() => 
import('./admin/_components/Dashboard/CreditPointShareTranLogs')
);
const CheckAndActivate = React.lazy(() =>
import('./admin/_components/CommonUser/CheckAndActivate')
);
const AddStreamListCommon = React.lazy(() =>
import('./admin/_components/CommonUser/AddStreamList')
);

const ClientDetail = React.lazy(()=>
import('./admin/_components/Reseller/ClientDetail')
);
const CheckAndShowMacDetail =  React.lazy(() => 
import('./admin/_components/CommonUser/CheckAndShowMacDetail')
);

const CreateApplication =  React.lazy(() => 
import('./admin/_components/Applications/CreateApplication')
);

const ApplicationList = React.lazy(() =>
 import('./admin/_components/Applications/ApplicationList')
);

const CreateResellerApplication = React.lazy(() =>
 import('./admin/_components/Applications/CreateResellerApplication')
);


const ResellerApplicationList = React.lazy(() =>
 import('./admin/_components/Applications/ResellerApplicationList')
);

const UpdatePassword = React.lazy(() =>
 import('./admin/_components/User/UpdatePassword')
);

const AddResellerNotitification = React.lazy(() =>
  import('./admin/_components/ResellerNotification/AddResellerNotification')
);

const ResellerNotificationList = React.lazy(() =>
  import('./admin/_components/ResellerNotification/ResellerNotificationList')
);
 
const Offers =  React.lazy(() =>
import('./admin/_components/Dashboard/Offers')
);

const DisableMacForm = React.lazy(() => 
import('./admin/_components/User/DisableMacForm')
);


const Clients = React.lazy(() => 
import('./admin/_components/Clients/Clients')
); 
const AddClient = React.lazy(() => 
import('./admin/_components/Clients/AddClient')
); 

const ClientTransactionsLog = React.lazy(() => 
import('./admin/_components/Dashboard/ClientTransactionsLog')
);

const IBOProTVApp = React.lazy(()=>
import('./admin/_components/CommonUser/IBOProTVApp')
);

const CheckAndActivateMultiApp =  React.lazy(() => 
import ('./admin/_components/CommonUser/CheckAndActivateMultiApp')
);

const TicketListComponent =  React.lazy(() => 
  import ('./admin/_components/Tickets/TicketListComponent')
);

const AddTicketComponent = React.lazy(() =>
  import ('./admin/_components/Tickets/AddTicketComponent')
);

const UpdateCreditSharePassword = React.lazy(() => 
  import('./admin/_components/Reseller/UpdateCreditSharePassword')
);

const SearchMacLocal = React.lazy(() => 
  import('./admin/_components/CommonUser/SearchMacLocal')
);

const BuyCreditPoints = React.lazy(() => 
  import('./admin/_components/Reseller/BuyCreditPoints')
);

const SuccessPay = React.lazy( () =>
  import('./admin/_components/Reseller/SuccessPay')
);

const FailedPay = React.lazy( () =>
import('./admin/_components/Reseller/FailedPay')
);

const CreditPaymentOrders = React.lazy(() =>
import('./admin/_components/Reseller/CreditPaymentOrders')
);
const routes = [
  { path: '/login', exact: true, name: 'Login' },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  {
    path: '/icons/simple-line-icons',
    name: 'Simple Line Icons',
    component: SimpleLineIcons
  },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'Users', component: User },
  { path: '/inbox', exact: true, name: 'Inbox', component: Inbox },
  { path: '/add-user', exact: true, name: 'Users', component: AddUserForm },
  { path: '/add-streamlist', exact: true, name: 'Users', component: AddStreamList },

  
  { path: '/add-app-update', exact: true, name: 'AppUpdate', component: AddAppUpdate },
  { path: '/app-update-list', exact: true, name: 'AppUpdate', component: AppUpdateList },
  { path: '/add-new-message', exact: true, name: 'Message', component: AddMessage },
  { path: '/message-list', exact: true, name: 'Message', component: AppMessageList },
  { path: '/reseller-list', exact: true, name: 'Reseller', component: ResellerList },
  { path: '/add-reseller', exact: true, name: 'Reseller', component: AddReseller },
  { path: '/sub-reseller', exact: true, name: 'Reseller', component: SubResellerAssignment },
  { path: '/acti-list', exact: true, name: 'Users', component: StreamCodeList },
  { path: '/search-user', exact: true, name: 'Users', component: SearchUser },
  { path: '/transactions', exact: true, name: 'Transactions', component: CreditPointTransLogs },
  { path: '/credit-point-share-log', exact: true, name: 'Transactions', component: CreditPointShareTranLogs },
  { path: '/check-activate', exact: true, name: 'Users', component: CheckAndActivate },
  { path: '/add-streamlist-common', exact: true, name: 'Streamlist', component: AddStreamListCommon },
  { path: '/client-detail', exact: true, name: 'Profile', component: ClientDetail },
  { path: '/check-detail', exact: true, name: 'CheckMac', component: CheckAndShowMacDetail },
  { path: '/create-app', exact: true, name: 'Application', component: CreateApplication },
  { path: '/applications', exact: true, name: 'Application', component: ApplicationList },
  { path: '/create-res-app', exact: true, name: 'Application', component: CreateResellerApplication },
  { path: '/res-applications', exact: true, name: 'Application', component: ResellerApplicationList },
  { path: '/update-password',  exact: true, name: 'User', component: UpdatePassword },
  { path: '/add-res-notif',  exact: true, name: 'ResellerNotification', component: AddResellerNotitification },
  { path: '/res-notif-list',  exact: true, name: 'ResellerNotification', component: ResellerNotificationList },
  { path: '/offers',  exact: true, name: 'Offers', component: Offers },
  { path: '/disable-mac',  exact: true, name: 'DisableMac', component: DisableMacForm },
  { path: '/clients',  exact: true, name: 'Clients', component: Clients },
  { path: '/add-client',  exact: true, name: 'Clients', component: AddClient },
  { path: '/client-tran',  exact: true, name: 'Clients', component: ClientTransactionsLog },
  { path: '/iboprotv', exact: true, name: 'IBOPro TV',  component: IBOProTVApp},
  { path: '/check-activate-multi', exact: true, name: 'IBOPro TV',  component: CheckAndActivateMultiApp},
  { path: '/add-ticket', exact: true, name: 'Ticket', component:AddTicketComponent},
  { path: '/my-tickets', exact: true, name: 'Ticket', component:TicketListComponent},
  { path: '/credit-pass', exact:  true, name: 'Reseller', component: UpdateCreditSharePassword},
  { path: '/search-mac', exact:  true, name: 'CommonUser', component: SearchMacLocal},
  { path: '/add-credit', exact:  true, name: 'Reseller', component: BuyCreditPoints},
  { path: '/passimpay/success', exact:  true, name: 'Reseller', component: SuccessPay},
  { path: '/passimpay/failed', exact:  true, name: 'Reseller', component: FailedPay},
  { path: '/passimpay/orders', exact:  true, name: 'Reseller', component: CreditPaymentOrders}
  
]
export default routes
