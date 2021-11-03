import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Api from "../../api";

function useBackLinkHook() {
  const api = new Api();
  const params = useParams();

  const [state, setState] = useState({ backlink: null, error: null })

  useEffect(async () => {
    let { backlink_id, post_id, forum_id, setting_id, type, timer_at } = params;
    const rs = await api.getBackLink(backlink_id, post_id, forum_id, setting_id, type, timer_at );
    if (rs.status != 200) {
      setState({ ...state, error: rs.message })
      return;
    }
    const { data: { backlink } } = rs;
    setState({ ...state, error: null, backlink })

  }, [])

  return {
    state
  }
}

export default useBackLinkHook;