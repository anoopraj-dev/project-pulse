import { createAlert } from "../services/alert/alert.service.js";
import { AlertRules } from "../utils/alertRules.js";

export const monitorMiddleware = (req,res,next) =>{
    const start = Date.now();

    console.log('Monitoring System performance..')

    res.on('finish', async()=>{
        const duration = Date.now() - start;

        try {
            const rule = AlertRules.slowApi(duration);

            if(rule){
                await createAlert(rule);
            }
        } catch (error) {
            console.log('Alert middleware error',error)
        }
    });

    next();
}