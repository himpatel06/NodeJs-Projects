
import pool from '../config/dbconnectio'
import * as schema from '../schema/schemas'

const getUserByEmail = async(email:string)=>{
    try{
     
    const result = await pool.query(`select * from users where email = $1`,[email]);
    return {
        error:false,
        message:"get user data successfull",
        data:result.rows
    }
    }
    catch(err){
        return{
            error:true,
            message:"error "+err,
            data:null
        }  
    }
    
}
const inserUser = async(email:string,password:string,fullname:string) =>{
    try{
        let result = await pool.query(`insert into users(email,password,fullname) values($1,$2,$3) returning u_id`,[email,password,fullname]);
    if (!result) {
        return {
            error:true,
            message:"",
            data:null
        }
    }
    else{
        return{
            error:false,
            message:"Data inserted successfully",
            data:result.rows
        }
    }
}
catch(err){
 return {
            error:true,
            message:"error"+err,
            data:null
 }
}
}

const updateUser = async (user:schema.user)=>{
    try{

        if(user.email)
        await pool.query(`update users set email=$1 where u_id = $2`,[user.email,user.u_id]);
        if(user.fulname)
        await pool.query(`update users set fullname=$1 where u_id = $2`,[user.fulname,user.u_id]);
        if(user.password)
        await pool.query(`update users set password=$1 where u_id = $2`,[user.password,user.u_id]);

        return {
            error:false,
            message:"Data updated successfully",
            data:null
        }

    }
    catch(err){
        return{
            error:true,
            message:"error"+err,
            data:null
        }
    }
}
const getUserById = async (u_id:number)=>{
    try {const user = await pool.query(`select * from users where u_id=$1`,[u_id]);
    if(user)
    return{
        error:false,
        message:"get user by id",
        data:user.rows}
    else{
        return {
            error:true,
            message:"Cannot get the data",
            data:null
        }
    }
}
catch(err){
    return{
            error:true,
            message:"error:" + err,
            data:null
    }
}
}

export{
    getUserByEmail,
    inserUser,
    updateUser,
    getUserById
}