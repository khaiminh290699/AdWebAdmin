import { useState } from "react";
import Api from "../../api";

function useLoginHook() {
  const api = new Api();

  const [ state, setState ] = useState({ error: {}, logined: false, isLoading: false })

  const action = {
    onFinish: async (value) => {
      const { username, password } = value;
      setState({ ...state, isLoading: true })
      const rs = await api.login(username, password);
      if (rs.status != 200) {
        setState({ ...state, error: { message: rs.message }, isLoading: false })
        return;
      }
      const { data: { user } } = rs;
      localStorage.setItem("token", user.token);
      delete user.token;
      localStorage.setItem("user", JSON.stringify(user));
      setState({ ...state, logined: true, isLoading: false })
    },

    onFinishFailed: (err) => {
      console.log({ err })
    }
  }

  return {
    state,
    action
  }
}

export default useLoginHook;