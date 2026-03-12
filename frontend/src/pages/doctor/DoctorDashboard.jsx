import PageBanner from '@/components/shared/components/PageBanner'
import { pageBannerConfig } from '@/components/shared/configs/bannerConfig'
import React from 'react'

const DoctorDashboard = () => {
  return (
    <div>
        <PageBanner config={pageBannerConfig.doctorDashboard}/>
    </div>
  )
}

export default DoctorDashboard