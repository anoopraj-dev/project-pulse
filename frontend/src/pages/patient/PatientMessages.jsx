
import PageBanner from '@/components/shared/components/PageBanner';
import ChatContainer from '../../components/ui/messages/ChatContainer';
import { pageBannerConfig } from '@/components/shared/configs/bannerConfig';

const PatientMessages = () => {

 return (
    <>
    <PageBanner config={pageBannerConfig.patientMessages}/>
    <ChatContainer/>
    
    </>

 )

};

export default PatientMessages;
