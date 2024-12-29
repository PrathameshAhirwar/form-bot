import { HeaderLandingPage } from './HeaderLandingPage/HeaderLandingPage';
import style from './LandingPage.module.css';
import MainLandingPage from './MainLandingPage/MainLandingPage';
import FooterLandingPage from './FooterLandingPage/FooterLandingPage';

const LandingPage = () => {
  return (
    <>
        <div className={style.container}>
            <HeaderLandingPage />
            <MainLandingPage />
            <FooterLandingPage />
        </div>
    </>
  )
}

export default LandingPage