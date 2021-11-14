
import images from "../images";

export function WinnerIcon({winner}) {
    return <img className="winner-mark" src={images['winner/' + winner + ".png"]} />
}