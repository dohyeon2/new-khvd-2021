import { useDispatch, useSelector } from 'react-redux';
import { setGlobal as setGlobalReducer } from '../reducers/global';

/**
 * Global State 관리를 위한 React Hook
 * @returns {object} { global, setGlobal }
 */
function useGlobal() {
  const { global } = useSelector(s => s);
  const dispatch = useDispatch();

  /**
   * object로 상태를 입력받아 Global reducer에 상태를 dispatch하는 함수
   * @param {object} data Global state에 삽입하길 원하는 새로운 state key:value 페어
   */
  const setGlobal = (data) => {
    dispatch(setGlobalReducer(data));
  }

  return { global, setGlobal };
}

export default useGlobal;