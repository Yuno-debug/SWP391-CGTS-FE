import './Background.css'
import image1 from '../../../assets/image1.jpg'
import image2 from '../../../assets/image2.jpg'
import image3 from '../../../assets/image3.png'
import video2 from '../../../assets/video2.mp4'
import gradientBackground from '../../../assets/image5.jpg'

const Background = ({playStatus,heroCount}) => {
    if (playStatus) {
        return (
            <div className='background-container'>
            <video className='background' autoPlay loop muted >
                <source src={video2} type='video/mp4' />
                </video>
            </div>
        ) 
    }
    else if (heroCount==0)
    return (
    <div className="background-container">
        <img src={image1} className="background" alt="Background 1" loading="lazy" />
        <img
            src={gradientBackground}
            className="gradient-overlay"
            alt="Gradient Background"/>
    </div>
    );
    else if (heroCount==1)
    {
        return (
            <div className="background-container">
                <img src={image2} className="background" alt="Background 1" loading="lazy" />
                <img
                    src={gradientBackground}
                    className="gradient-overlay"
                    alt="Gradient Background"/>
            </div>
        )
    }
    else if (heroCount==2)
        {
            return (
                <div className="background-container">
                    <img src={image3} className="background" alt="Background 1" loading="lazy" />
                    <img
                        src={gradientBackground}
                        className="gradient-overlay"
                        alt="Gradient Background"/>
                </div>
        )
    }
}

export default Background