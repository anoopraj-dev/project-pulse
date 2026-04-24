import Alert from "../../models/alert.model.js";

const cooldownMap = new Map();

export const createAlert = async(data) =>{
    const fingerprint = `${data.service} :${data.title}`;

    const last = cooldownMap.get(fingerprint);
    if(last && Date.now() - last < 5 * 60 * 1000){
        return;
    }

    cooldownMap.set(fingerprint, Date.now());

    return Alert.create({
        ...data,
        fingerprint
    })
}