import { useState,useEffect } from 'react';
import ProfileView from '../../components/user/doctor/profile/ProfileView'
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useParams } from 'react-router-dom';
import ShimmerCard from '../../components/ui/loaders/ShimmerCard';
import { blockDoctor, fetchDoctorById,unblockDoctor} from '../../api/admin/adminApis';
import { approveDoctorProfile,verifyDoctorDocuments,rejectDoctorProfile } from '../../api/doctor/doctorApis';
import DoctorStatusBanner from '../../components/user/doctor/profile/DoctorStatusBanner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { RevokeStatusModal, SendCommentModal } from '../../components/ui/modals/ModalInputs';
import { useModal } from '../../contexts/ModalContext';


const DoctorProfileView = () => {
  const [user, setUser] = useState(null);
  const fetchDoctorAction = useAsyncAction();
  const approveAction = useAsyncAction();
  const viewDocAction = useAsyncAction();
  const unblockAction = useAsyncAction();
  const { id } = useParams(); 
  const navigate = useNavigate();
  const {openModal} = useModal();

  //------------- FETCH DOCTOR ------------------
  const fetchDoctor = async () => {
    try {
      await fetchDoctorAction.executeAsyncFn(async () => {
        const response = await fetchDoctorById(id); 
        console.log(response?.user)
        setUser(response?.user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //--------------- VERIFY DOCUMENTS ------------
    const handleVerifyDocuments = async (id) => {
      try {
        await viewDocAction.executeAsyncFn(async () => {
          const res = await verifyDoctorDocuments(user._id);
          if (res.data.success) {
            navigate(`/admin/doctor/${id}/documents`);
          }
        });
      } catch (error) {
        console.log(error);
        toast("Failed to load documents");
      }
    };

//-------------- APPROVE DOCTOR -------------------
   const handleApproveDoctor = async () => {
    try {
      await approveAction.executeAsyncFn(async () => {
        const res = await approveDoctorProfile(user._id);
        if (res.data.success) {
          setUser(res.data.user)
          toast.success(res.data.message);
          navigate(`/admin/doctor/${id}`);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Request Approval failed");
    }
  };

//----------------- REJECT DOCTOR ------------------
  const handleReject = async () => {
    try {
      openModal("Reject this request?", SendCommentModal, { id: user._id, apiCall:rejectDoctorProfile, onSubmit: (updatedUser)=> setUser(updatedUser)  });
    } catch {
      toast.error("Something went wrong");
    }
  };

  //-------------- BLOCK DOCTOR --------------------
  const handleBlock = async() =>{
    try {
      openModal('Block this doctor?', SendCommentModal, { id: user._id, apiCall: blockDoctor,onSubmit:(updatedUser)=>setUser(updatedUser) })
    } catch (error) {
      
    }
  }

  //------------ UNBLOCK DOCTOR -------------------
  const handleUnblock = async() => {
    try {
      await unblockAction.executeAsyncFn( async ()=> {
        const res = await unblockDoctor(user._id);
         if (res.success) {
          setUser(res.user)
          toast.success('Successfully unblocked the doctor');
          navigate(`/admin/doctor/${id}`);
        }
      })
    } catch (error) {
      console.log(error)
      toast.error('Unblock operation failed')
    }
  }

  //--------------- REVOKE STATUS -------------------
  const handleRevokeStatus = async() => {
    try {
      openModal('Revoke doctor profile Status',RevokeStatusModal,{id: user._id,onSubmit:(updatedUser)=> setUser(updatedUser)})
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (fetchDoctorAction.loading) return <ShimmerCard />;
  if (!user) return null;
    
  return (
    <div className='flex flex-col mt-18'>
      <DoctorStatusBanner approvalStatus={user?.status} resubmissionApproved={user.resubmissionApproved} submissionCount={user.submissionCount} variant="admin"/>
      <ProfileView viewer='admin' user= {user} onApprove={handleApproveDoctor} onVerify={handleVerifyDocuments} onReject ={handleReject} onBlock={handleBlock} onRevokeStatus={handleRevokeStatus} onUnblock={handleUnblock}/>
    </div>
  )
}

export default DoctorProfileView