import moment from "moment";
import React, { useEffect, useState } from "react";
import Api from "../../api";

function useStatisticHook() {
  const api = new Api();
  let [state, setState] = useState({
    inTime: [],
    from: moment().startOf("date").subtract(3, "month"),
    to: moment().endOf("date"),
    isLoadingLine: true,
    isLoadingCircle: true
  });

  useEffect(async () => {
    state.isLoadingLine = true;
    setState({ ...state });
    const rs = await api.getInTime(state.from, state.to);
    if (rs.status != 200) {
      return;
    }
    const { data: { result: inTime } } = rs;
    state.inTime = inTime;
    state.isLoadingLine = false
    setState({ ...state });
  }, [state.from, state.to])

  useEffect(async () => {
    state.isLoadingCircle = true;
    setState({ ...state });
    const rs = await api.getTotal(state.from, state.to);
    if (rs.status != 200) {
      return;
    }
    const { data: { result: total } } = rs;
    state.total = total
    state.isLoadingCircle = false;
    setState({ ...state });
  }, [state.from, state.to])

  return {
    state
  }
}

export default useStatisticHook;