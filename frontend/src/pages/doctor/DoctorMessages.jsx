import React from 'react'
import ChatContainer from '../../components/ui/messages/ChatContainer'
import PageBanner from '@/components/shared/components/PageBanner'
import { pageBannerConfig } from '@/components/shared/configs/bannerConfig'

const DoctorMessages = () => {
  return (
    <div>
      <PageBanner config={pageBannerConfig.doctorMessages}/>
      <ChatContainer/>
    </div>
    
  )
}

export default DoctorMessages