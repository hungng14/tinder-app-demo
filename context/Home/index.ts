/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useReducer } from "react";
import { ObjType } from "../../libs/types";
import { dataActions } from "./constant";
import dataReducer from "./reducer";
const DUMMY_APP_ID = process.env.NEXT_PUBLIC_DUMMY_APP_ID;

enum DataType {
  FakeApi,
  Backend,
}

type FilterType = {
  limit?: number;
  page?: number;
  type: DataType;
};

const useHomeData = () => {
  const initState = {
    data: null,
    loading: false,
    error: "",
  };

  const [state, dispatch] = useReducer(dataReducer, initState);

  const getUrl = useCallback((filter: FilterType) => {
    let url = null;
    const { type, ...query } = filter;
    let isFakeApi = type === DataType.FakeApi;
    const _query = new URLSearchParams({...query, page: query.page || 1, limit: query.limit || 10} as ObjType).toString();
    if (!isFakeApi) {
      url = `/api/user?${_query}`;
    } else if (!DUMMY_APP_ID) {
      url = "";
      console.error("DUMMY APP ID invalid");
    } else {
      url = `https://dummyapi.io/data/v1/user?${_query}`;
    }
    return url;
  }, []);

  const setData = useCallback(
    async (filter: FilterType) => {
      const { type, ...query } = filter;
      const oldData = state.data;
      dispatch({ type: dataActions.LOADING, payload: oldData });
      /**
       * struct: {
       *  0: {
       *      filter: {page: 1,},
       *      totalRecords: 100,
       *      currentList: [],
       *      currentPage: 1,
       *      data: {
       *          [page]: data[]
       *      }
       *  },
       *  1: {
       *      ...
       *  }
       * }
       */
      try {
        const limit = query?.limit || 10;
        const page = query?.page || 1;

        const oldDataByType = oldData?.[type] || {};
        if (oldDataByType && oldDataByType.data?.[page]?.length) {
          oldDataByType.currentList = oldDataByType.data[page];
          oldDataByType.currentPage = page;
          dispatch({
            type: dataActions.SUCCESS,
            payload: { ...oldData, [type]: oldDataByType },
          });
          return;
        }
        let isFakeApi = type === DataType.FakeApi;
        const url = getUrl(filter);
        if (!url) {
          dispatch({
            type: dataActions.SUCCESS,
            payload: oldData,
          });
          return;
        }
        const headers: ObjType = isFakeApi
          ? { "app-id": DUMMY_APP_ID as string }
          : {};
        const response = await fetch(url, {
          headers,
        });
        const result = await response.json();
        dispatch({
          type: dataActions.SUCCESS,
          payload: {
            ...(oldData || {}),
            [type]: {
              ...oldDataByType,
              filter: {
                ...(oldDataByType.filter || {}),
                page,
                limit,
              },
              currentPage: page,
              currentList: result.data,
              totalRecords: result.total,
              data: {
                ...(oldDataByType.data || {}),
                [page]: result.data,
              },
            },
          },
        });
      } catch (error: any) {
        console.debug("error", error);
        dispatch({
          type: dataActions.FAILURE,
          payload: error,
        });
      }
    },
    [state, getUrl]
  );

  const setNextPageData = useCallback(
    async (filter: FilterType) => {
      try {
        const oldData = state.data;
        const { type } = filter;
        const oldDataByType = oldData?.[type] || {};
        const nextPage = (oldDataByType.currentPage || 0) + 1;
        if (oldDataByType?.data?.[nextPage]?.length) return;
        let isFakeApi = type === DataType.FakeApi;
        const url = getUrl({ ...filter, page: nextPage });
        const headers: ObjType = isFakeApi
          ? { "app-id": DUMMY_APP_ID as string }
          : {};
        const response = await fetch(url, {
          headers,
        });
        const result = await response.json();
        dispatch({
          type: dataActions.SUCCESS,
          payload: {
            ...(oldData || {}),
            [type]: {
              ...oldDataByType,
              totalRecords: result.total,
              currentPage: nextPage,
              currentList: [...(oldDataByType.currentList || []), ...result.data],
              data: {
                ...(oldDataByType.data || {}),
                [nextPage]: result.data,
              },
            },
          },
        });
      } catch (error) {
          console.log('error', error)
      }
    },
    [state, getUrl]
  );

  return {
    state,
    actions: {
      setData,
      setNextPageData,
    },
  };
};

export default useHomeData;
