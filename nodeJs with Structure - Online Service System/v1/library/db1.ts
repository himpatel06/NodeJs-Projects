import Connection from './connection';
import connection  from './connection';
import functions from './functions';

export class db {
	public table: string = '';
	private connection: any = '';
	public query: string = '';
	public uniqueField: string = '';
	public where: string = '';
	public orderby: string = '';
	public rpp: number = 20;
	public page: number = 1;
	public limit: string = '';
	public url: string = '';
	public totalRecords: number = 0;

	constructor() {

	}

	/**
	 * This function will execute given Query with checking of DB connection. It will return appropriate type of response in case of insert, update, delete, select etc.
	 * @param query query string
	 * @returns array | number
	 */
	async executeQuery(query: string,transection:boolean = false) {
		this.query = query;
		let connectionObj = new connection();
        console.log(query);
		try {
			this.connection = await connectionObj.getConnect();
			if (!this.connection) {
				throw 'Not connected to database.';
			}

			let result;
            if(transection){
                result = await Connection.clientConn.query(query);
            }
            else{
                result = await this.connection.query(query);
            }
			if (!result) return functions.output(true,"Error finding result");

			if (result.command == "INSERT") {
			return functions.output(false,`Insert query Exicuted Successfully`,result.rows[0]);
			
			}
            if (result.command == "SELECT")
            return functions.output(false,`Select query Exicuted Successfully`,result.rows);
            
			else if (result.command == "UPDATE") return functions.output(false,`Update query Exicuted Successfully`,result.rowCount);
			else if (result.command == "DELETE") return functions.output(false,`Delete query Exicuted Successfully`,result.rows);
	
		} catch (error) {
			console.log('e'+error);
            return functions.output(true,'Exicute Error: '+ error);
		}
	}

	/**
	 * Select records from DB with appropriate table and required where conditions. This function will use in SelectRecord, allRecords, list Records function with appropriate parameters.
	 * @param table table name
	 * @param fields fields of DB
	 * @param where where condition
	 * @param orderby order by starting with " ORDER BY"
	 * @param limit limit of DB records required
	 * @returns array
	 */
	async select(table: string, fields: string, where: string, orderby: string, limit: string) {
		let query = 'SELECT ' + fields + ' FROM ' + table + ' ' + where + ' ' + orderby + ' ' + limit;
		return await this.executeQuery(query);
	}

	/**
	 * Insert given data into given table. Given data should be key-value pair object with DB field name and it's value.
	 * @param table table name
	 * @param data array of data
	 */
	async insert(table: string, data: any,transection:boolean=false) {
		let columnsArray: any = new Array();
		let valuesArray: any = new Array();

		for (let key in data) {
			columnsArray.push(key);
			valuesArray.push(data[key]);
		}
		let columns: string = columnsArray.join(',');

		for (let i = 0; i < valuesArray.length; i++) {
			valuesArray[i] = String(valuesArray[i]);
			valuesArray[i] = valuesArray[i].replace(/'/g, "\''");
		}
		let values: string = valuesArray.join("','");

		let query = "INSERT INTO " + table + "(" + columns + ") values('" + values + "') RETURNING *";
		return await this.executeQuery(query,transection);
	}

	/**
	 * Update given data into table with appropriate where condition.
	 * @param table tablename
	 * @param data key value pair array/object
	 * @param where Where condition
	 */
	async update(table:string,data:any,condition:string,transection:boolean = false){
        let columnArr:string[] = [];
        for(let key in data){
            const str = key +' = ' + (typeof(data[key]) === 'string'? `'${data[key]}'` : data[key]);
            columnArr.push(str);
        }
        const column = columnArr.join(',');
        const query = 'UPDATE '+table + ' set '+column + ' where ' + condition;
       console.log(query);
        return await this.executeQuery(query,transection);
    }


	/**
	 * Delete record from table with given where condition.
	 * @param table tablename
	 * @param where where condition
	 */
	async delete(table: string, where: string) {
		let query = 'DELETE FROM ' + table + ' ' + where;
		return await this.executeQuery(query);
	}

	/**
	 * Select given fields from given table with unique id.
	 * @param id table unique id
	 * @param fields DB fields
	 */
	async selectRecord(id: number, fields = '*') {
		return await this.select(this.table, fields, 'WHERE ' + this.uniqueField + ' = ' + id, this.orderby, this.limit);
	}

	/**
	 * Insert record into DB with given array
	 * @param data key-value pair object
	 */
	async insertRecord(data: any,transection:boolean=false) {
		return await this.insert(this.table, data,transection);
	}

	/**
	 * Update given data with unique id
	 * @param id unique id
	 * @param data key-value pair array
	 */
	
    async updateRecord(table:string,data:any,condition:string,transection:boolean = false){
        const result = await this.update(table,data,condition,transection);
        return result;
    }
   

	/**
	 * Delete record with given unique id
	 * @param id unique id
	 */
	async deleteRecord(id: number) {
		return await this.delete(this.table, ' WHERE ' + this.uniqueField + '=' + id);
	}

	/**
	 * Return records with given fields and limit.
	 * @param fields DB fields
	 */
	async listRecords(fields = '*') {
		let start = (this.page - 1) * this.rpp;
		let result = await this.select(this.table, fields, this.where, this.orderby, 'LIMIT ' + this.rpp + ' OFFSET ' + start);
		return result;
	}

	/**
	 * Return all records with given where condition and order by.
	 * @param fields fields
	 */
	async allRecords(fields = '*') {
		let result = await this.select(this.table, fields, this.where, this.orderby, '');
		return  result;
	}

	/**
	 * Get count of records with given condition
	 * @param table tablename
	 * @param uniqueField unique fields
	 * @param where where condition
	 */
	async selectCount(table: string, uniqueField: string, where: string) {
		let query: string = 'SELECT count(' + uniqueField + ') as cnt FROM ' + table + ' ' + where;
		let result = await this.executeQuery(query);
		return result
	}

	// /**
	//  * Get total pages of records with given condition and given rpp.
	//  */
	// async getTotalPages() {
	// 	this.totalRecords = await this.selectCount(this.table, this.uniqueField, this.where);
	// 	let totalpages: number = Math.ceil(this.totalRecords / this.rpp);
	// 	return totalpages;
	// }

    async jointSelect(table:string,field='*'){
        let result = await this.select(table,field,this.where,this.orderby,'');
        return result;
    }
}

export default db;
