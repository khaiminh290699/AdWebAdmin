import React, { useState, useEffect, useContext } from "react";
import { EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

import Api from "../../api";
import { Space, Tooltip, Typography } from "antd";
import PasswordHidden from "./password";
import useAppHook from "../../App.context"

const { Text, Link } = Typography;

function useAccountManageHook() {
  const api = new Api();

  const context = useContext(useAppHook);

  let [state, setState] = useState({ 
    accounts: [], 
    webs: [], 
    edited: undefined, 
    password: "", 
    username: "", 
    web_id: null, 
    creating: false, 
    isLoading: true,
    mode: null,
    page: 1,
    total: 0,
    listInsertButDisable: []
  });

  useEffect(async () => {
    const rs = await api.listWebs();
    if (rs.status != 200) {
      alert(rs.message);
      return;
    }
    const { data: { webs }} = rs;

    const rsa = await api.listAccounts();
    if (rs.status != 200) {
      alert(rs.message);
      return;
    }
    const { data: { accounts }} = rsa;
    setState({ ...state, accounts, webs, isLoading: false });
  }, [])


  const action = {
    onChange: (value, type) => {
      state[type] = value;
      setState({ ...state })
    },
  
    onCancel: () => {
      setState({ ...state, creating: false, edited: undefined, username: "", password: "" })
    },
  
    onCreate: () => {
      setState({ ...state, creating: true, web_id: state.webs[0].id });
    },
  
    onEdit: async () => {
      if (state.creating) {
        const user = JSON.parse(localStorage.getItem("user"));
        const web = state.webs.filter((webs) => webs.id === state.web_id)[0] || {};
        const { username, password } = state;
        const rs = await api.createAccount(username, new Buffer(password).toString("base64"), web.id);
        if (rs.status != 200) {
          alert(rs.message);
          return;
        }
        const { data: { account } } = rs;
        state.accounts.unshift({
          ...account,
          web_key: web.web_key,
          web_name: web.web_name,
          web_url: web.web_url,
          web_id: web.id,
          user_username: user.username,
        });

        // state.accounts.unshift({
        //   web_key: web.web_key,
        //   web_name: web.web_name,
        //   web_url: web.web_url,
        //   web_id: web.id,
        //   username: state.username,
        //   disable: true,
        //   user_username: user.username,
        //   password: new Buffer(state.password).toString("base64"),
        // })
      } else {
        const { username, password } = state;
        const { id } = state.accounts[state.edited.index];
        const rs = await api.updateAccount(id, username, new Buffer(password).toString("base64"));
        if (rs.status != 200) {
          alert(rs.message);
          return;
        }
        const { data: { account } } = rs;
        state.accounts[state.edited.index] = {
          ...state.accounts[state.edited.index],
          username: account.username,
          password: account.password
        }
      }
      
      setState({ ...state, accounts: [...state.accounts], edited: undefined,  username: "", password: "", creating: false })
    },
  
    onSave: async () => {
      setState({ ...state, isLoading: true  })
      await api.accountUpsert(state.accounts);
      const rs = await api.listAccounts();
      if (rs.status != 200) {
        return;
      }
      const { data: { accounts, listInsertButDisable } } = rs;
      setState({ ...state, accounts, listInsertButDisable, isLoading: false });
    },

    onAdminModeChange: async (checked) => {
      setState({...state, isLoading: true, listInsertButDisable: []})
      if (checked === true) {
        const rs = await api.listAccounts([], { "users.username": -1, "accounts.username": -1, "webs.id": -1 }, state.page, value.limit, "admin")
        if (rs.status != 200) {
          return;
        }
        const { data: { accounts, total } } = rs;
        setState({ ...state, mode: "admin", accounts, total, isLoading: false });
        return;
      }
      const rs = await api.listAccounts();
      if (rs.status != 200) {
        return;
      }
      const { data: { accounts } } = rs;
      setState({ ...state, accounts, mode: null, page: 1, isLoading: false });

    },

    onPaginationChange: async (page) => {
      if (state.mode === "admin") {
        setState({...state, isLoading: true})
        const rs = await api.listAccounts([], { "users.username": -1, "accounts.username": -1, "webs.id": -1 }, page, value.limit, state.mode);
        if (rs.status != 200) {
          return;
        }
        const { data: { accounts, total } } = rs;
        setState({ ...state,  page, accounts, total, isLoading: false });
        return;
      }
    },

    onDisableAccount: async (index) => {
      const { id: account_id } = state.accounts[index];
      const rs = await api.accountToogle(account_id);
      if (rs.status != 200) {
        return;
      }
      if (state.mode != "admin") { 
        state.accounts.splice(index, 1);
      } else {
        state.accounts[index] = {
          ...state.accounts[index],
          disable: rs.data.account.disable
        }
      }
      setState({ ...state, accounts: [...state.accounts] })
    }
  }

  const value = {
    limit: 5,
    columns: [
      { title: "Account name", key: "username", dataIndex: "username", width: "20%",render: (data) => <>{data}</> },
      { title: "Password", key: "password", dataIndex: "password",   width: "20%", render: (data) => <PasswordHidden password={data} /> },
      { title: "Disable", render: (data) => {
        if (data.disable) {
          return <StopOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} />
        } else {
          return <CheckCircleOutlined style={{ fontSize: "18px", color: "#1efa85" }} />
        }
      }},
      { title: "User", key: "user_username", dataIndex: "user_username",   width: "20%", render: (data) => <>{data}</> },
      { title: "Website", key: "name", dataIndex: "web_name", render: (data, account) => <Tooltip placement="topLeft" title={() => {
        return (
          <table>
            <tr>
              <td><Text strong>URL :</Text></td>
              <td><Link href={account.web_url}>{account.web_url}</Link></td>
            </tr>
            <tr>
              <td><Text strong>Key :</Text></td>
              <td><Text type="secondary">{account.web_key}</Text></td>
            </tr>
          </table>
        )
      }}>{data}</Tooltip> },
      {
        title: "Action",
        width: "100px",
        render: (_, data, index) => {
          if (state.mode === "admin") {
            if (!data.disable) {
              return <StopOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} onClick={() => action.onDisableAccount(index)} />
            } else {
              return <CheckCircleOutlined style={{ fontSize: "18px", color: "#1efa85" }} onClick={() => action.onDisableAccount(index)} />
            }
          }
          return (
            <Space size="middle">
              <EditOutlined style={{ fontSize: "18px", color: "#faad14" }} 
                onClick={() => {
                  setState({ ...state, edited: { index, ...data }, username: data.username, password: new Buffer(data.password, "base64").toString("ascii") })
                }}
              />
              <StopOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} onClick={() => action.onDisableAccount(index)} />
            </Space>
          )
        }
      }
    ]
  }

  return {
    context: context.state,
    state,
    action,
    value
  }
}

export default useAccountManageHook;