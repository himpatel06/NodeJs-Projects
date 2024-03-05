import {Pool} from 'pg';
import functions from './functions'


class Connection{
    static poolConn:any;
    static clientConn:any;
    async getConnect(){
        if(!Connection.poolConn){
            const result = await this.connect();
            Connection.clientConn = result;
            if(!result) return false;
        }

        return Connection.poolConn;
    }
 
   async connect(){
    try{
         Connection.poolConn = new Pool({
            database:process.env.DB_DATABASE,
            host:process.env.DB_HOST,
            password:process.env.DB_PASSWORD,
            port:5432,
            user:process.env.DB_USER
        });
        
        const result = await Connection.poolConn.connect();
        if(result){
            console.log("Connected to the DB");
            return result;
        }
        return false;
        
    }
    catch(err){
        return functions.output(true,"Error connecting DB");
    }
}
}

export default Connection;