import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import usePostContext from "../post-create/context";

function useGoogleSearchHook() {
  const api = new Api();
  const context = useContext(usePostContext);
  const [state, setState] = useState({ isSearching: false });

  useEffect(async () => {}, [])

  const func = {
    cacheSearch: async (searchQuery, pageSearch, searchNum = 5) => {
      let searchResult = null;

      if (localStorage.getItem(`${searchQuery.trim()}_${pageSearch}`)) {
        const data = JSON.parse(localStorage.getItem(`${searchQuery.trim()}_${pageSearch}`))
        if (moment(data.searchAt).diff(moment(), "day") <= 1) {
          searchResult = data.searchResult;
        } else {
          localStorage.removeItem(`${searchQuery.trim()}_${pageSearch}`)
        }
      }

      if (searchResult === null){
        const rs = await api.searchApi(searchQuery, pageSearch, searchNum);
        if (rs.status != 200) {
          return;
        }
        searchResult = rs.data;
        localStorage.setItem(`${searchQuery.trim()}_${pageSearch}`, JSON.stringify({ searchResult, searchAt: new Date() }))
      }

      return searchResult;
    }
  }
  
  const action = {
    onSearchChange: (event) => {
      context.dispatch({ type: "searchQuery", data: { searchQuery: event.target.value } })
    },

    onSearch: async () => {
      const { state: { searchQuery } } = context;

      if (!searchQuery) {
        context.dispatch({ type: "searchResult", data: { searchResult: {} }})
        return
      }

      setState({ ...state, isSearching: true })

      const searchResult = await func.cacheSearch(searchQuery, 1);

      context.dispatch({ type: "searchResult", data: { searchResult, pageSearch: 1 } });
      setState({ ...state, isSearching: false })
    },

    onPaginationChange: async (pageSearch, num) => {
      const { state: { searchQuery } } = context;
      setState({ ...state, isSearching: true })

      const searchResult = await func.cacheSearch(searchQuery, pageSearch, num);

      context.dispatch({ type: "searchResult", data: { searchResult, pageSearch } });
      setState({ ...state, isSearching: false })
    },

    onCheckingPost: (checked, url) => {
      let { state: { selectedPosts } } = context;
      if (checked) {
        selectedPosts.push(url);
      } else {
        selectedPosts = selectedPosts.filter((checkedUrl) => checkedUrl != url);
      }
      context.dispatch({ type: "selectedPosts", data: { selectedPosts, refetchSelectForums: true } });
    },
    
    onNext: (pageProgressing) => {
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    }
  }
  return {
    context: context.state,
    action,
    state
  }
}

export default useGoogleSearchHook;