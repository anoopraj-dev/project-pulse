import PageBanner from '@/components/shared/components/PageBanner'
import { pageBannerConfig } from '@/components/shared/configs/bannerConfig'
import React from 'react'

const patientDashboard = () => {
  return (
    <div className='h-screen'>
      <PageBanner config={pageBannerConfig.patientDashboard}/>
    </div>
  )
}

export default patientDashboard
