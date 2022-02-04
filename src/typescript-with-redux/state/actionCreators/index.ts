import axios from 'axios'
import { Dispatch } from 'redux'
import { ActionTypes } from '../actionTypes/index'
import { Action } from '../actions/index'

export const searchRepositories = (term: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionTypes.SEARCH_REPOSITORIES,
    })
    try {
      const { data }: any = await axios.get(
        `https://registry.npmjs.org/-/v1/search`,
        {
          params: {
            text: term,
          },
        }
      )
      const names = data.objects.map((el: any) => {
        return el.package.name
      })
      dispatch({
        type: ActionTypes.SEARCH_REPOSITORIES_SUCCESS,
        payload: names,
      })
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SEARCH_REPOSITORIES_ERROR,
        payload: error.message,
      })
    }
  }
}
