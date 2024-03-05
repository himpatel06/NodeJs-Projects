import Connection from "./connection";
import functions from './functions'
import * as schema from '../library/schema'


class db{
    
    async exicuteQuery(query:string,transection:boolean = false){
        try{
        const conn = new Connection();
        const pool = await conn.getConnect();
        if(!pool) return functions.output(true,"Error Connecting DB");
        
        let result;

        //If there is transection then using client Connection
        if(transection){
        console.log("In Client Connection")
        result = await Connection.clientConn.query(query);
        }
        
        //If there is no transection then using pool Connection
        else{
        console.log("In Pool Connection")
        result = await pool.query(query);
        }

        if(!result) return functions.output(true,"Error finding result");
        
        if (result.command == "INSERT") 
        return functions.output(false,`Insert query Exicuted Successfully`,result.rows[0]);
        
        if (result.command == "SELECT")
        return functions.output(false,`Select query Exicuted Successfully`,result.rows);
        
        if (result.command == "UPDATE")
        {

        return functions.output(false,`Update query Exicuted Successfully`,result.rowCount);
        }
        
        if (result.command == "DELETE")
        return functions.output(false,`Delete query Exicuted Successfully`,result.rows);
        


        }
        catch(err){
            console.log('e'+err);
            return functions.output(true,'Exicute Error: '+ err);
        }

            
    }
    async select(table:string,column:string,condition:string,page?:number,limit?:number){
        let query;
        
        if(limit && page){
        const offset = (page-1) * limit;
         query = 'SELECT ' + column + ' FROM ' + table + ' WHERE ' + condition + ' LIMIT ' + limit + ' offset '+ offset;
        }
        else
         query = 'SELECT ' + column + ' FROM ' + table + ' WHERE ' + condition;
       console.log(query);
        return await this.exicuteQuery(query);
    }
   

    async insert(table:string,data:any,transection:boolean = false){

        let columnArr:string[] = [];
        let valueArr:any[]=[];

        for(let key in data){
            columnArr.push(key);
            if(typeof(data[key]) === 'string')
            valueArr.push(`'${data[key]}'`);   
            else
            valueArr.push(data[key]); 
        }
        const column = columnArr.join(',');
        const value = valueArr.join(',');

        const query = "INSERT INTO "+table + ' ('+column+') ' + 'values(' + value +') returning *';
        return await this.exicuteQuery(query,transection);
    }
    async update(table:string,data:any,condition:string,transection:boolean = false){
        let columnArr:string[] = [];
        for(let key in data){
            const str = key +' = ' + (typeof(data[key]) === 'string'? `'${data[key]}'` : data[key]);
            columnArr.push(str);
        }
        const column = columnArr.join(',');
        const query = 'UPDATE '+table + ' set '+column + ' where ' + condition;
       console.log(query);
        return await this.exicuteQuery(query,transection);
    }

    async delete(table:string,condition:string,transection:boolean = false){
        const query = 'DELETE FROM '+table + ' WHERE ' + condition; 
        return await this.exicuteQuery(query,transection);
    }

    async getRecordById(data:{table:string,value:any},page:number=0,limit:number=0){
        const key = Object.keys(data.value)[0];
        const value = (typeof(data.value[key]) === 'string')? `'${data.value[key]}'` : data.value[key];
        const condition = `${key} = ${value}`
        const result = await this.select(data.table,'*',condition,page,limit);
        return result;
    }

    async getAllRecords(data:schema.getRecordSchema,page:number=0,limit:number=0){
       
        const result = await this.select(data.table,data.column,data.condition,page,limit);
        return result;
    }

    async insertRecord(table:string,data:any,transection:boolean = false){
        const result = await this.insert(table,data,transection);
        return result;
    }

    async updateRecord(table:string,data:any,condition:string,transection:boolean = false){
        const result = await this.update(table,data,condition,transection);
        return result;
    }

  

}


export default db;