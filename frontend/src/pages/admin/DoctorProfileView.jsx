import { useState,useEffect } from 'react';
import ProfileView from '../../components/user/doctor/profile/ProfileView'
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useParams } from 'react-router-dom';
import ShimmerCard from '../../components/ui/loaders/ShimmerCard';
import { fetchDoctorById } from '../../api/admin/adminApis';
import DoctorStatusBanner from '../../components/user/doctor/profile/DoctorStatusBanner';

const DoctorProfileView = () => {
  const [user, setUser] = useState(null);
  const fetchDoctorAction = useAsyncAction();
  const { id } = useParams(); 
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

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (fetchDoctorAction.loading) return <ShimmerCard />;
  if (!user) return null;
    
  return (
    <div className='flex flex-col mt-18'>
      <DoctorStatusBanner approvalStatus={user?.status} variant="admin"/>
      <ProfileView user= {user}/>
    </div>
  )
}

export default DoctorProfileView