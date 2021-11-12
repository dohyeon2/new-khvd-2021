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
            notoSans: `'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif`,
            nanumSquare: `'NanumSquare', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif`
        },

        translateLetterSpacing: (fontsize, letterSpace) => {
            return (fontsize / 1000 * letterSpace) + "px";
        }
    },
    backgorundImage: `url(${images['intro-background.png']})`,
    breakPoints: {
        s: 600,
        m: 900,
        l: 1200,
    }
};

export default theme;