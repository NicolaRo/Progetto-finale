import {useState} from "react";

import Splash1 from '../assets/splash-1.png';
import Splash2 from '../assets/splash-2.png';
import Splash3 from '../assets/splash-3.png';

const SLIDES = [
    {
        emoji: "🌱",
        title:"Welcome to PackBack",
        content:"Shop local, eat fresh, and help the planet. PackBack connects you with local producers who deliver in reusable containers.",
        note: "A 5€ deposit is held at checkout — return all the containers and get your 5€ refunded. Simple.",
    },
    {
        emoji:"📦",
        title:"How it works",
        steps: [
            "🛒  Browse the app and see the products available",
            "👨‍🌾  Our listed producers will pack your order in reusable containers",
            "🚚  Receive your groceries",
            "♻️  Return the containers directly from the app and get your deposit back"
        ]
    },
    {
        emoji:"💶",
        title:"The 5€ deposit",
        content: "When you receive yor order, go to 'orders' and tap 'Confirm receipt & return containers'. This tells us you got your order and the containers are collectable.",
        note:"Your 5€ deposit is automatically refunded as soon as the producer confirms the containers are back. No hassle, no paperwork."
    }
];

const ONBOARDING_IMAGES = {
    "Splash1": Splash1,
    "Splash2": Splash2,
    "Splash3": Splash3
  };

function Onboarding({onComplete}) {
    const [current, setCurrent] = useState(0);
    const [dontShow, setDontShow] = useState(false);

    //Touch for swiping from mobile
    const [touchStart, setTouchStart] = useState(null);

    const handleTouchStart = (e) => setTouchStart (e.touches[0].clientX);

    const handleTouchEnd = (e) => {
        if(touchStart === null)
            return;

        const diff = touchStart - e.changedTouches [0].clientX;
        if(diff > 50) goNext();
        if(diff < 50) goPrev();
        setTouchStart(null);
    };

    const goNext = () => {
        if (current < SLIDES.length -1) setCurrent (current + 1);
    };

    const goPrev = () => {
        if(current > 0) setCurrent (current -1)
    };

    const handleComplete = () => {
        if(dontShow) localStorage.setItem("onboardingDone", true);
        onComplete();
    };
   
    const slide = SLIDES[current];

return(
    <div className="onboarding-overlay">
        <div
            className="onboarding-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            >
                {/*SLIDE CONTENT*/}
                <div className="onboarding-slide">
                    <span className="onboarding-emoji">{slide.emoji}</span>
                    <h2 className="onboarding-title">{slide.title}</h2>

                    {ONBOARDING_IMAGES && (
                    <div className="splash-img">
                      <img
                        className="splash-image"
                        src={ONBOARDING_IMAGES}
                        alt="onboarding illustrations"
                        />
</div>
                  )}



                    {slide.content && <p className="onboarding-content">{slide.content}</p>}
                    {slide.note && <p className="onboarding-note">{slide.note}</p>}

                    {slide.steps && (
                        <ul className="onboarding-steps">
                            {slide.steps.map((step, i) => (
                                <li key={i} className="onboarding-step">{step}</li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* DOTS */}
                <div className="onboarding-dots">
                    {SLIDES.map((_, i) => (
                        <span
                            key={i}
                            className={`onboarding-dot ${ i === current ? "active" : ""}`}
                            onClick={() => setCurrent(i)}
                        />
                    ))}
                </div>

                {/* NAVIGATION */}
                <div className="onboarding-nav">
                    {current > 0 && (
                        <button className="onboarding-btn-next"
                            onClick={goPrev}>☜ Back</button>
                    )}
                    {current < SLIDES.length - 1 ? (
                        <button className="onboarding-btn-next"
                            onClick={goNext}>Next ☞</button>
                    ) : (
                        <button className="onboarding-btn-start"
                            onClick={handleComplete}> Let's start 🛒</button>
                    )}
                </div>

                {/*DON'T SHOW AGAIN*/}
                <div className="onboarding-skip">
                    <input
                        type="checkbox"
                        id="dontShow"
                        checked={dontShow}
                        onChange={(e) => setDontShow(e.target.checked)}
                    />
                    <label htmlFor="dontShow">Don't show this again</label>
                </div>
            </div>
    </div>
);
}

export default Onboarding;