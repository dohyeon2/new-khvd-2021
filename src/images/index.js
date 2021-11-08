function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item).default; return true });
    return images;
}
const images = importAll(require.context('./'));
export default images;