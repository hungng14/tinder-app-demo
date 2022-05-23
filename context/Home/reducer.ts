import { ActionType, initReducer } from '../utils'
import { dataActions} from './constant'

const dataReducer = (state: any, action: ActionType) => {
  return initReducer(
    state,
    action,
    {
      loading: dataActions.LOADING,
      success: dataActions.SUCCESS,
      failure: dataActions.FAILURE
    })
}

export default dataReducer