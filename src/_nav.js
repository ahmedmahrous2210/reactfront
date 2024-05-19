let localStorageData = JSON.parse(
  localStorage.getItem('userData_' + localStorage.getItem('token'))
)
if(localStorageData.roleId == '2'){
  var navBar = {
    items: [
      {
        name: 'Dashboard',
        url: '/transctions',
        icon: 'fa fa-history',
        children: [
          {
            name: 'Update CreditPasscode',
            url: '/credit-pass',
            icon: 'fa fa-edit'
          },
          {
            name: 'Counts',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },
          {
            name: 'Transaction Logs',
            url: '/transactions',
            icon: 'fa fa-gift'
          },
          {
            name: 'Credit Point Share Logs',
            url: '/credit-point-share-log',
            icon: 'fa fa-gift'
          }
        ]
      },
      {
        name: 'Tickets',
        url: '/my-tickets',
        icon: 'fa fa-list',
        children: [
          {
            name: 'Ticket List',
            icon: 'fa fa-list',
            url: '/my-tickets'
          },
          {
            name: 'New Ticket',
            icon: 'fa fa-plus',
            url: '/add-ticket'
          }
        ]
      },
      {
        name: 'Users',
        url: '/users',
        icon: 'icon-user',
        children: [
          
          {
            name: 'User List',
            icon: 'fa fa-list',
            url: '/users'
          },
          {
            name: 'Activated Mac',
            url: '/search-mac',
            icon: 'fa fa-search'
          }
        ]
      },
      {
      name: 'IBOPro Tv',
      url: '/iboprotv',
      icon: 'fa fa-star',
     
    },
    // {
    //   name: 'Recharge Credit',
    //   url: '/add-credit',
    //   icon: 'fa fa-gas-pump',
     
    // },
    
    {
        name: 'Multi Apps Activation',
        url: '/check-activate-multi',
        icon: 'fa fa-search',
      },
      {
        name: 'App Settings',
        url: '/create-res-app',
        icon: 'icon-settings',
        children: [
          {
            name: 'Add App Settings',
            url: '/create-res-app',
            icon: 'fa fa-user-plus'
          },
          {
            name: 'App Settings List',
            icon: 'fa fa-list',
            url: '/res-applications'
          }
        ]
      },
      {
        name: 'Reseller',
        url: '/reseller-list',
        icon: 'icon-plus',
        children: [
          {
            name: 'Reseller List',
            icon: 'fa fa-list',
            url: '/reseller-list'
          },
          {
            name: 'Add Sub Reseller',
            icon: 'fa fa-plus',
            url: '/add-reseller'
          }
        ]
      },
      {
        name: 'Offers & Notifications',
        url: '/offers',
        icon: 'fa fa-bell',
        
      },
      {
        name: 'Check Mac',
        url: '/check-detail',
        icon: 'fa fa-info', 
      },
      {
        name: 'Activations',
        url: '/check-activate',
        icon: 'fa fa-search',
      },
      
    ]
  }
}
export default navBar;
