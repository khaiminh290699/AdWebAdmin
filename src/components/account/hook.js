import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import Api from "../../api";
import { Space, Tooltip, Typography } from "antd";
import PasswordHidden from "./password";

const { Text, Link } = Typography;

function useAccountManageHook() {
  const api = new Api();
  const [state, setState] = useState({ accounts: [], webs: [], edited: undefined, password: "", username: "", web_id: null, creating: false, isLoading: true });

  useEffect(async () => {
    const webs = await api.listWebs();
    const accounts = await api.listAccounts();
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
  
    onEdit: () => {
      if (state.creating) {
        const web = state.webs.filter((webs) => webs.id === state.web_id)[0] || {};
        state.accounts.unshift({
          web_key: web.web_key,
          web_name: web.web_name,
          web_url: web.web_url,
          web_id: web.id,
          username: state.username,
          password: new Buffer(state.password).toString("base64"),
        })
      } else {
        state.accounts[state.edited.index] = {
          ...state.accounts[state.edited.index],
          username: state.username,
          password: new Buffer(state.password).toString("base64")
        }
      }
      
      setState({ ...state, accounts: [...state.accounts], edited: undefined,  username: "", password: "", creating: false })
    },
  
    onSave: async () => {
      setState({ ...state, isLoading: true  })
      await api.accountUpsert(state.accounts);
      const accounts = await api.listAccounts();
      setState({ ...state, accounts, isLoading: false });
    }
  }

  const value = {
    columns: [
      { title: "Account name", key: "username", dataIndex: "username", render: (data) => <>{data}</> },
      { title: "Password", key: "password", dataIndex: "password",   width: "20%", render: (data) => <PasswordHidden password={data} /> },
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
          return (
            <Space size="middle">
              <EditOutlined style={{ fontSize: "18px", color: "#faad14" }} 
                onClick={() => {
                  setState({ ...state, edited: { index, ...data }, username: data.username, password: new Buffer(data.password, "base64").toString("ascii") })
                }}
              />
              <DeleteOutlined style={{ fontSize: "18px", color: "#ff4d4f" }}
                onClick={() => {
                  state.accounts.splice(index, 1);
                  setState({ ...state, accounts: [...state.accounts] })
                }}
              />
            </Space>
          )
        }
      }
    ]
  }

  return {
    state,
    action,
    value
  }
}

export default useAccountManageHook;