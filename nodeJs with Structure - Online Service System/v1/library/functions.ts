
class Functions{
    output(error:boolean,message:string,data:any = null){
        return {
            error:error,
            message:message,
            data:data
        }
    }


     istimeOverLap(day:any[]){

            let previousTime:any = undefined;
            for (const value of day){
            
            const startTime = value.split(' - ')[0];
            const endTime = value.split(' - ')[1];
            const start = new Date('2024-06-03 '+startTime);
            const end = new Date('2024-06-03 '+endTime);
            if(start > end){
                return true;
            }
            else{
                if(previousTime){
                    if(start < previousTime)
                    {
                        return true;
                    }
                    else
                    previousTime = end;
                }
                else{
                    previousTime = end;
                }
            }
            }
     
            return false;

    }

   

}

export default new Functions;