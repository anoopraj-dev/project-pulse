import React from 'react'
import ChatContainer from '../../components/ui/messages/ChatContainer'
import PageBanner from '@/components/shared/components/PageBanner'
import { pageBannerConfig } from '@/components/shared/configs/bannerConfig'
import { useUser } from '@/contexts/UserContext'
import BlockedProfile from '@/components/shared/components/BlockedProfile'
import DoctorStatusBanner from '@/components/user/doctor/profile/DoctorStatusBanner'

const DoctorMessages = () => {
  const {user} = useUser();
  return (
    <div>
      <DoctorStatusBanner
            approvalStatus={user?.status}
            submissionCount={user?.submissionCount}
            variant="doctor"
          />
      {
        user?.isBlocked ? (
          <BlockedProfile/>
        ):(
          <>
          <PageBanner config={pageBannerConfig.doctorMessages}/>
      <ChatContainer/>
          
          </>
        )
      }
    </div>
    
  )
}

export default DoctorMessages