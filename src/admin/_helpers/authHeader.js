export function authHeader(skipContentType){
    const currentUser = localStorage.getItem('token');
    if(skipContentType){
        return {'Content-Type':'application/json', Accept:'application/json'}
    }else{
        if(currentUser){
            return {'Content-Type':'application/json', Accept:'application/json'}
        }else{
            return {'Content-Type':'application/json', Accept:'application/json'};
        }
    }
    
}