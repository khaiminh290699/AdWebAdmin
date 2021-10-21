import { Card, Space, Table, Tooltip, Typography, Input, Modal, Button, Divider, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "./password";
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;
const { Option } = Select;

function AccountManage() {
  const api = new Api();
  const [state, setState] = useState({ accounts: [], webs: [], edited: undefined, password: "", username: "", web_id: null, creating: false, isLoading: true });

  useEffect(async () => {
    const webs = await api.listWebs();
    const accounts = await api.listAccounts();
    setState({ ...state, accounts, webs, isLoading: false });
  }, [])

  const columns = [
    { title: "Account name", key: "username", dataIndex: "username", render: (data) => <>{data}</> },
    { title: "Password", key: "password", dataIndex: "password",   width: "20%", render: (data) => <PasswordHidden password={data} /> },
    { title: "Website", key: "name", dataIndex: "name", render: (data, account) => <Tooltip placement="topLeft" title={() => {
      return (
        <table>
          <tr>
            <td><Text strong>URL :</Text></td>
            <td><Link href={account.url}>{account.url}</Link></td>
          </tr>
          <tr>
            <td><Text strong>Key :</Text></td>
            <td><Text type="secondary">{account.key}</Text></td>
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
                console.log(state.accounts);
                setState({ ...state, accounts: [...state.accounts] })
              }}
            />
          </Space>
        )
      }
    }
  ]

  const onChange = (value, type) => {
    state[type] = value;
    setState({ ...state })
  }

  const onCancel = () => {
    setState({ ...state, creating: false, edited: undefined, username: "", password: "" })
  }

  const onCreate = () => {
    setState({ ...state, creating: true, web_id: state.webs[0].id });
  }

  const onEdit = () => {
    if (state.creating) {
      const web = state.webs.filter((webs) => webs.id === state.web_id)[0] || {};
      state.accounts.unshift({
        key: web.key,
        name: web.name,
        url: web.url,
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
  }

  const onSave = async () => {
    setState({ ...state, isLoading: true  })
    await api.accountUpsert(state.accounts);
    const accounts = await api.listAccounts();
    setState({ ...state, accounts, isLoading: false });
  }

  return (
    <Card title="Account Manage">
      <Space>
        <Button type="primary" onClick={onCreate}><Text strong><PlusOutlined />Create new</Text></Button>
        <Tooltip>
          <Button type="default" onClick={onSave}><Text strong><SaveOutlined /> Save</Text></Button>
        </Tooltip>
        {
          state.isLoading ? <Spin /> : <></>
        }
      </Space>
      <Divider/>
      <Modal title="Edit account" visible={ state.creating || state.edited != undefined } onCancel={onCancel}
        footer={[
          <Button type="primary" onClick={() => onEdit()}>
            { state.creating ? "Create" : "Edit" }
          </Button>
        ]}
      >
        <table width="100%">
          <tr>
            <td><Text strong>Website :</Text></td>
            <td>
              {
                !state.creating ?
                <Link strong href={state.edited ? state.edited.url : "#"}>{state.edited ? state.edited.name : ""}</Link>
                :
                <Select defaultValue={state.webs[0].id}
                  onChange={(value) => onChange(value, "web_id")}
                >
                  {
                    state.webs.map((web) => <Option value={web.id}>
                      <Tooltip title={
                      <table>
                        <tr>
                          <td><Text strong>URL :</Text></td>
                          <td><Link href={web.url}>{web.url}</Link></td>
                        </tr>
                        <tr>
                          <td><Text strong>Key :</Text></td>
                          <td><Text type="secondary">{web.key}</Text></td>
                        </tr>
                      </table>
                    }> {web.name}</Tooltip>
                    </Option>)
                  }
                </Select>
              }
            </td>
          </tr>
          <br></br>
          <tr>
            <td><Text strong>Username :</Text></td>
            <td><Input value={state.username} onChange={(event) => onChange(event.target.value, "username")}></Input></td>
          </tr>
          <br></br>
          <tr>
            <td><Text strong>Password :</Text></td>
            <td><Input type="password" value={state.password} onChange={(event) => onChange(event.target.value, "password")}></Input></td>
          </tr>
        </table>
      </Modal>
      <Table
        bordered={true}
        columns={columns} 
        dataSource={state.accounts}
        pagination={false}
        rowKey="id"
      />
    </Card>
  )
}

export default AccountManage;