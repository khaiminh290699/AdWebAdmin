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
    isLoadingCircle: true,
  });

  return {
    state
  }
}

export default useStatisticHook;