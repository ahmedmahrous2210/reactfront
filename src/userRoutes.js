import React from 'react';
//import Profile from './views/UserPanel/Profile/Profile';
const Dashboard = React.lazy(() => import('./views/UserPanel/Dashboard/UserDashboard'));
const Courses = React.lazy(() => import('./views/UserPanel/Courses/Courses'));
const Exams = React.lazy(() => import('./views/UserPanel/ExamStep/ExamStep'));
const Profile = React.lazy(() => import('./views/UserPanel/Profile/Profile'));

const userRoutes = [
    { path: '/dashboard', exact:true, name: 'Dashboard', component: Dashboard },
    { path: '/courses', exact:true, name: 'Dashboard', component: Courses },
    { path: '/exams', exact:true, name: 'Dashboard', component: Exams },
    { path: '/profile', exact:true, name: 'Profile', component: Profile }
];
export default userRoutes;