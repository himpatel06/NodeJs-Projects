interface getRecordSchema{
    table: string;
    column: string;
    condition: any;
}

interface getRecordByIdSchema{
    table:string,
    value:{
        [key: string]: any;
    }
}

interface customerAppointmentSchema{
    instructor_name:string,
    profession:string,
    service_details:{
        name:string,
        desc:string,
        price:string,
    },
    schedule:{
        date:string,
        start_time:string,
        end_time:string
    }

}

interface instructorAppointSchema{
    customer_detail:{
        Full_Name:string,
    },
    Service_detail:{
        name:string,
        price:number
    },
    schedule:{
        date:string,
        start_time:string,
        end_time:string
    }
    approval:string
}




export{
    getRecordSchema,
    getRecordByIdSchema,
    customerAppointmentSchema,
    instructorAppointSchema
}