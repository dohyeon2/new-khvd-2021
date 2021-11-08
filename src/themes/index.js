import images from "../images";

const theme = {
    colors: {
        primary: "#FF358E",
        foreground: "#fff",
        background: "#1E095B",
    },
    font: {
        family: {
            englishBold: `'SBAggroB', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif`,
            notoSans: `Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif`
        },

        translateLetterSpacing: (fontsize, letterSpace) => {
            return (fontsize / 1000 * letterSpace) + "px";
        }
    },
    backgorundImage: `url(${images['intro-background.png']})`,
};

export default theme;