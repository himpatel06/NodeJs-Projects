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
interface cart{
    total_items:number,
    total_quantites:number,
    sub_total:number,
    net_total:number,
    cart_items:any
}



export {user,
    response,
    product,
    cart
    
};