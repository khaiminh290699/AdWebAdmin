import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import usePostContext from "../post/context";

function useAccountSettingHook() {
  const api = new Api();
  const context = useContext(usePostContext);
  const [state, setState] = useState({ isLoading: true, accounts: [] });

  useEffect(async () => {
    const { state: { selectedForums, accountSettings } } = context;
    const { accounts } = await api.listAccounts([{ web_url: { $in: selectedForums.map((selectedForum) => selectedForum.web_url) } }]);
    setState({ ...state, isLoading: false, accounts })
    context.dispatch({ accountSettings: accountSettings.filter((accountSetting) => !accounts.some((account) => account.id === accountSetting.account_id) ) })
  }, [])

  const action = {
    
  }

  return {
    context: context.state,
    state,
    action
  }

}

export default useAccountSettingHook;