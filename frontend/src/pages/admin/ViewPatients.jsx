import React, { useState,useEffect } from 'react'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { getAllPatients } from '../../api/admin/adminApis';
import toast from 'react-hot-toast';
import DataTable from '../../components/shared/components/DataTable';
import { patientColumns } from '../../components/shared/configs/TableConfigs';
import PatientStatusTabs from '../../components/user/admin/patients/PatientStatusTabs';
import { useNavigate } from 'react-router-dom';

const ViewPatients = () => {
    const [activeTab,setActiveTab] = useState('active')
    const [patients,setPatients] = useState(null);
    const navigate = useNavigate();
    const fetchPatientsAction = useAsyncAction();

    const fetchAllPatients = () =>{
        fetchPatientsAction.executeAsyncFn(async ()=>{
            const res = await getAllPatients();
            console.log(res.data.users)
            if(!res?.data?.success) {
                return toast.error('Failed to load data')
            }
            setPatients(res?.data?.users)
        })
    }

    const handleView = (id) =>{
        navigate(`/admin/patient/${id}`)
    }

    const filteredPatients = patients?.filter((patient)=> patient?.status === activeTab)

    useEffect(()=>{
        fetchAllPatients();
    },[])

  return (
    <div className="p-12 mt-18 min-h-screen">
        <PatientStatusTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
        <DataTable data={filteredPatients} columns={patientColumns} onView={handleView}/>
    </div>
  )
}

export default ViewPatients