function importAll(r) {
    let lotties = {};
    r.keys().map((item) => { lotties[item.replace('./', '')] = r(item); return true });
    return lotties;
}
const lotties = importAll(require.context('./'));
export default lotties;