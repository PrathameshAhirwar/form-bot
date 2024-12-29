import React from 'react'
import style from './footer.module.css'
import Logo from './Logo.png'

const FooterLandingPage = () => {
  return (
    <>
        <div className={style.container}>
            <div className={style.col1}>
                <div className={style.logo}>
                    <img src={Logo} alt=""/><h3>FormBot</h3>
                </div>
                <p>Made with ❤️ by 
                    <br/><u>@Cuvette</u></p>
            </div>
            <div className={style.col2}>
                <h3>Product</h3>
                <p><u>Status</u></p>
                <p><u>Documentation</u></p>
                <p><u>Roadmap</u></p>
                <p><u>Pricing</u></p>
            </div>
            <div className={style.col3}>
                <h3>Community</h3>
                <p><u>Discord</u></p>
                <p><u>GitHub repository</u></p>
                <p><u>Twitter</u></p>
                <p><u>LinkedIn</u></p>
                <p><u>OSS Friends</u></p>
            </div>
            <div className={style.col4}>
                <h3>Company</h3>
                <p><u>About</u></p>
                <p><u>Contact</u></p>
                <p><u>Terms of Service</u></p>
                <p><u>Privacy Policy</u></p>
            </div>
        </div>
    </>
  )
}

export default FooterLandingPage