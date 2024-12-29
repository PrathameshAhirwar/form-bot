import style from './header.module.css'
import Logo from './Logo.png'
import { NavLink } from 'react-router'

export const HeaderLandingPage = () => {
  return (
    <div className={style.container}>
        {/* Logo Container */}
        <div className={style.logo}>
          <img src={Logo} alt=""/>
          <h2>FormBot</h2>
        </div>
        {/* Navigation Container */}
        <div className={style.nav}>
          <ul className={style.navList}>
            <NavLink to='/login' className={style.signIn}>Sign in</NavLink> 
            <NavLink className={style.createForm}>Create a FormBot</NavLink>
          </ul>
        </div>
    </div>
  )
}
