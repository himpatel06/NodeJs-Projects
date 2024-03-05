interface user {
    readonly u_id:number,
    fulname?:string,
    email?:string,
    password?:string
}

interface response{
    error:boolean,
    message:string,
    data:any
}

interface product{
    readonly p_id:number,
    productName:string,
    productDesc:string
    productPrice:number,
    productQty:number,
}



export {user,
    response,
    product
    
};