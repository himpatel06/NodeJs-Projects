import {Pool} from 'pg';

class DBConnection{
    public pool;
    private entity;
    public constructor(entity:string){
        this.pool = new Pool({
            user:'postgres',
            host:'localhost',
            password:'123456798',
            database:'typescriptdb',
            port:5432
        });

        this.entity = entity; 

    }

    async getAllValueById(key:string,value:string | number){
        const query = `select * from ${this.entity} where ${key} = $1`
        const result = await this.pool.query(query,[value]);
        return result;

    }

    async insertValue(column:string[],values:any[],returningId:string|number,client?:any){
        const names = column.toString();
        console.log(names);
        const placeHolder = values.map((_,index)=>`$${index+1}`).toString();
        const query =`insert into ${this.entity}(${names}) values(${placeHolder}) returning ${returningId}`;

        let result;
        if(!client)
        result = await this.pool.query(query,values);
        else 
        result = await client.query(query,values);
        return result;
    }

    async getValueByCondition(column:string[],condition:string,values:any[]){
        const names = column.toString();
        const query = `select ${names} from ${this.entity} where ${condition}`
        let result = await this.pool.query(query,values);
        return result;
    }

    async updateValue(column:string[],condition:string,values:any[],client?:any){

        const placeHolder = column.map((value,index)=>{
            return `${value}=$${index+1}`
        }).toString();

        const query = `update ${this.entity} set ${placeHolder} where ${condition}`;

        let result;
        if(!client)
        result = await this.pool.query(query,values);
        else
        result = await client.query(query,values);
        return result;

    }
    async getJoinData(column:string[],condition:string,joinCondition:string,values:any[],tables:string[]){
        const names = column.toString();

        const query = `select ${names} from ${tables[0]} inner join ${tables[1]} on ${joinCondition} where ${condition}`;
        let result = await this.pool.query(query,values);
        return result;

    }

    async deleteItem(condition:string,value:any[],client?:any){
        
        const query = `delete from ${this.entity} where ${condition}`;
        let result;
        if(!client)
        result = await this.pool.query(query,value);
        else
        result = await client.query(query,value);
        return result;
    }
}


export default DBConnection;