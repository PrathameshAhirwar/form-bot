import * as style from './main.module.css'
import leftDesign from './assets/SVG.png'
import rightDesign from './assets/Container (3).png'
import backgroundLeft from './assets/Background+Blur.png'
import backgroundRight from './assets/Background+Blur (1).png'
import formImg from './assets/Figure.png'

const MainLandingPage = () => {
  return (
    <>
        <div className={style.container}>
            {/* left design */}
            <div>
                <img src={leftDesign} alt="" />
            </div>
            {/* center text */}
            <div className={style.centerText}>
                <h1>Build advanced chatbots visually</h1>
                <p>Typebot gives you powerful blocks to create unique
                chat experiences. Embed them anywhere on your web/mobile
                apps and start collecting results like magic
                </p>
                <h4 className={style.btn}>Create a FormBot for free</h4>
            </div>
            {/* right design */}
            <div>
                <img src={rightDesign} alt="" />
            </div>

        </div>
        {/* Form Image */}
        <div className={style.container1}>
            
            {/* background*/}
            <div className={style.background}>
                <img src={backgroundLeft} alt="" />
                <img src={backgroundRight} alt="" />
            </div>
            <div className={style.formImage}>
                <img src={formImg} alt="" />
            </div>
            
        </div>
    </>
  )
}

export default MainLandingPage