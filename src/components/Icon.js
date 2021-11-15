
import images from "../images";
import lotties from "../lotties";
import LottieElement from "./LottieElement";

export function WinnerIcon({ winner }) {
    return <img className="winner-mark" src={images['winner/' + winner + ".png"]} />
}

export function ScrollDown(attr) {
    return <div
        {...attr}
    >
        <LottieElement
            lottieOption={{
                animationData: lotties['scroll-custom.json']
            }}
        />
        <div className="description">
            SCROLL DOWN
        </div>
    </div>
}

