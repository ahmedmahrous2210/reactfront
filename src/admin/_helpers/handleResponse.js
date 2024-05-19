// import {authenticationService} from '../_services/authentication.service';
//import ErrorComponent from "../_components/ErrorComponent";
// import React , {Component} from 'react';
import {decryption} from '../_services/encryption';
export function handleResponse(response){
    return response.text().then(text => {
        //var vghv = 'eyJjaXBoZXJ0ZXh0Ijoic0JtMjhYZVFlOW9uYnptTklja2hzR3BZWU5VZUR2U0pZOXloSzA0YTc4Rk53TFwvNWY2SDA0Z2dSODBpQnhNUVwvN1UxT1plYk1OYWVGZ2diemNnVnZaVDJJcGsxVUFpb2hFUDJxMStucGgyXC9iaXF1ZmxaXC9HYXYxd09NNWJaZHVDT0M2NWZpM0pYc08wYWJ4cE5jbDNCRTRUTHBEUXA1ajdhd05BVTdKWXdOZ1p6Y1Z1U2l2RXloN3FuWHFweEZoTFVzQzJHQ3d1U3ViWUtxaFU4dnVHWnVDeUtPaUliOURqcGQ4blwvYVBYaVFKZFM0TEozRjJ3VmhPYXcxTjRRS2FFbkJwRFI4dFNDUUc2eVJMbEwwcmpDQT09IiwiaXYiOiJiM2U2MGY0ZDkwNzRmMDQ1MjhjNWI5OTYyZWRmZjk4MyIsInNhbHQiOiI4MTYzMTI2NDhiN2ZhYTdmMzhhYjZiMzkwNjk2NTFiMzU4MWVkN2IyOTlhMDI3OWNmZmY4NTdjMGI3MWVjOGE0NzJiZTI0MmNlN2JmNWIxOGJiNjYyOWQ5YWZiM2FhOTYxNTkxMTM0YmQzMWNhMDEwMjk5YWJmZjA3NjA0YjdkNDgwNTk3MTdjNTJlMTZjZDg0ZTdmNTgxOGU4YTg3N2Y5ZDVhMzFmOGRiMzVlYjA4YTRjYWJhOTZhYzI3YTYyZmMxNmQxNzQyMTRiYWE4MDkxNjVmNzZkYzE3OTMyZDA5ZjVkZmEyOGY0ZjBkMzkzMTZhM2U5NDg4Y2E5OGVhNDk5NDJiMWU2YmI0ODBkY2M1OWUxNTM1NzA5ZDQ4NTdkN2FlODI2NjBjMWE4Y2E0NGVmMGI3NmJlMDNmOWQxYWZiZTA5YmVmNzUwNGI1ODg3MGZkNWFmYzE3ZWUyNzQ0NWIyODdmNmQ2OWMzZTEzZTFmZGQ4NmM3ZTZjYmE4ZjZjNDcxOThkYTcyN2MwN2Y2YWY2YWQ3ZjgzYzgwNTQ4YTk0NjUwMzk4YjAzZjQxM2ZjNjgwMmI3NDQ0YjcxYzFkNjc0OTc0ZTJjYTc0ZTE3ZGI3NDU2YTk0MzRkZTBjMWJkN2IyZDQxNjkyNmMwNGUzYjE1YTBkMDZkMjYxZWU1MWVhNSJ9';
        var dataObj = text && JSON.parse(atob(text));
        const data = JSON.parse(decryption(JSON.stringify(dataObj)));
       // console.log("decrypted data", data);
        let errorMsg = '';
        if(!response.ok){
            // if([401, 403, 500].indexOf(response.status) !== -1){
            if([401].indexOf(response.status) !== -1){
                localStorage.removeItem('token');
                localStorage.removeItem('userData_' + localStorage.removeItem('token'));
                //this.props.history.push("/");
                window.location.href = '/';
                // try{
                //     errorMsg = data.message || ['Something went wrong. Please try again later.'];
                // }catch(err){
                //     errorMsg = ['Something went wrong..'];
                // }
            }
            //const error = data;
            //return Promise.reject(error);
            return data;
        }
        return data;
    });
}