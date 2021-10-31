import { Space, Switch, Tooltip, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import Api from "../../api";
import useAppContext from "../../App.context";
import { CheckCircleTwoTone, RedoOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

function useUserManageHook() {
  const defaultPassword = "khaiminh2906";
  const api = new Api();
  const [state, setState] = useState({ isLoading: true, users: [], page: 1, total: 0, username: "", password: "", error: {} })
  const context = useContext(useAppContext);

  useEffect(async () => {
    if (!context.state.user || !context.state.user.isAdmin) {
      return;
    }
    const rs = await api.listUsers([], { "username": -1 }, state.page, value.limit);
    if (rs.status != 200) {
      return;
    }
    const { data: { users, total } } = rs;
    setState({ ...state, isLoading: false, users, total });
  }, [])

  const value = {
    limit: 5,
    columns: [
      { title: "Username", width: "40%", render: (data) => <Text strong>{data.username}</Text> },
      { title: "Password", width: "20%", render: (data) => { 
        return (
          <Space size="large">
            <Text strong>
              ********
            </Text>
            <span />
            <span />
            <span />
            <span />
            <span />
            <Tooltip title={`Reset password to ${defaultPassword}`}>
              <RedoOutlined 
                style={{ fontSize: "20px", color: "#ffec3d" }} 
                onClick={() => action.onResetPassword(data.id)}
              />
            </Tooltip> 
          </Space>
        ) 
      } },
      { title: "Admin", width: "10%", render: (data, _, index) => {
        return <Switch checked={data.permission >= 255} onChange={(checked) => action.onSwitchAdmin(checked, data.id, index)}></Switch>
      } },
      { title: "Active", width: "10%", render: (data, _, index) => {
        return <Switch checked={data.is_activated} onChange={(checked) => action.onSwitchActivate(checked, data.id, index)}></Switch>
      } },

    ]
  }

  const action = {
    onPaginationChange: async (page) => {
      setState({ ...state, isLoading: true })
      state.page = page
      const rs = await api.listUsers([], { "username": -1 }, state.page, value.limit);
      if (rs.status != 200) {
        return;
      }
      const { data: { users, total } } = rs;
      setState({ ...state, isLoading: false, users, total, page });
    },

    onUsernameChange: (event) => {
      setState({ ...state, username: event.target.value })
    },

    onPasswordChange: (event) => {
      setState({ ...state, password: event.target.value })
    },

    onCreateUser: async () => {
      const { username, password } = state;
      if (!username || !password) {
        state.error.create = "You must fill out"
        setState({ ...state });
        return;
      }
      setState({ ...state, isLoading: true });
      const rs = await api.createUser(username, password);
      if (rs.status != 200) {
        state.error.create = rs.message
        setState({ ...state, isLoading: false });
        return;
      }
      const { data: { user } } = rs;
      state.users.unshift(user);
      state.error.create = null;
      console.log(state);
      setState({ ...state, isLoading: false });
    },

    onResetPassword: async (user_id) => {
      setState({ ...state, isLoading: true });
      const rs = await api.resetPassword(user_id, defaultPassword);
      if (rs.status != 200) {
        return;
      }
      setState({ ...state, isLoading: false });
    },

    onSwitchAdmin: async (checked, user_id, index) => {
      setState({ ...state, isLoading: true });
      const rs = await api.setPermission(user_id, checked ? 255 : 128);
      if (rs.status != 200) {
        return;
      }
      const { data: { user } } = rs;
      state.users[index].permission = user.permission;
      setState({ ...state, isLoading: false });
    },
    
    onSwitchActivate: async (checked, user_id, index) => {
      setState({ ...state, isLoading: true });
      const rs = await api.toggleUser(user_id, checked);
      if (rs.status != 200) {
        return;
      }
      const { data: { user } } = rs;
      state.users[index].is_activated = user.is_activated;
      setState({ ...state, isLoading: false });
    }
  }

  return {
    context: context.state,
    state,
    value,
    action
  }
}

export default useUserManageHook;