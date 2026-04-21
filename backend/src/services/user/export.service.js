import Export from '../../models/export.model.js'
import path from 'path'
import fs from 'fs';

export const createExportRequestService = async({
    role,
    targetId,
    userId,
})=>{
    if(role === 'patient' && userId !==targetId){
        throw new Error('Unauthorized')
    }

    const exportJob = await Export.create({
        role,
        patient: role ==='patient' ? targetId:null,
        doctor:role ==='doctor' ? targetId:null,
        status:queued
    });

    return{
        message:'Export queued',
        exportId:exportJob._id,
    }
}