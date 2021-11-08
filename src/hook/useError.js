import { writeErrorLog } from "../api/error";

function useError() {
    return { writeErrorLog };
}

export default useError;