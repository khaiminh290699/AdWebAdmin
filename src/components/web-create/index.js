import { Button, Card, Divider, Input, InputNumber, Space, Typography, Select, Tooltip, Modal, Tag, Table, Checkbox, Alert, Collapse } from "antd";
import React, { useState } from "react";
import useWebCreateHook from "./hook";
import { PlusOutlined, MinusOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import slug from "slug";

const { Text } = Typography;

function WebCreate() {
  const { state, action, value, setState } = useWebCreateHook();

  return (
    <Card title="Web Create">
      <Space>
        <Text strong style={{ display: "inline-block", width: "100px" }}>Web name</Text><Text strong> : </Text>
        <Input value={state.web_name} onChange={action.onNameChange} style={{ width: "900px" }}></Input>
      </Space>
      <p />
      <Space>
        <Text strong style={{ display: "inline-block", width: "100px" }}>Web URL</Text><Text strong> : </Text>
        <Input value={state.web_url} onChange={action.onURLChange} style={{ width: "900px" }}></Input>
      </Space>
      <p />
      <Space>
        <Text strong style={{ display: "inline-block", width: "100px" }}>Web key</Text><Text strong> : </Text>
        <Input value={slug(state.web_name || "", "_")} disabled={true} style={{ width: "900px" }}></Input>
      </Space>

      <Divider />

      <Text strong>Forums :</Text>
      <p />
      <Space>
        <Text strong>Forum name :</Text>
        <Input value={state.forum_name} style={{ width: "250px" }} onChange={(event) => setState({ ...state, forum_name: event.target.value })} />
        <Text strong>Forum URL :</Text>
        <Input value={state.forum_url} style={{ width: "500px" }} onChange={(event) => setState({ ...state, forum_url: event.target.value })} />
        {
          state.updateForum != null ? 
          (
            <>
              <Button type="primary" style={{ backgroundColor: "#fadb14", borderColor: "#fadb14" }}
                onClick={action.onEditForum}
              ><EditOutlined /> Edit</Button>
              <Text strong type="danger"><CloseOutlined onClick={() => setState({ ...state, updateForum: null, forum_url: null, forum_name: null  })} /></Text>
            </>
          )
          :
          (
            <>
              <Button type="primary" onClick={action.onAddForum}><PlusOutlined /> Add</Button>
            </>
          )
        }
      </Space>
      <p />
      <Table 
        dataSource={state.forums}
        columns={value.columns}
        pagination={{ pageSize: 5, current: state.page, pageSizeOptions: [5], onChange: (page) => { setState({ ...state, page }) } }}
      />

      <Divider />

      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel showArrow={false} header={<Alert message="Login Actions" type="success" />} key="1">
          <ActionInput type="login" actionName="Login action" actions={state.loginActions} setActions={(actions) => {
            state.loginActions = actions;
            setState({ ...state })
          }} />  
        </Collapse.Panel>

        <Collapse.Panel showArrow={false} header={<Alert message="Logout Actions" type="error" />} key="2">
          <ActionInput type="logout" actionName="Logout action" actions={state.logoutActions} setActions={(actions) => {
            state.logoutActions = actions;
            setState({ ...state })
          }} />   
        </Collapse.Panel>

        <Collapse.Panel showArrow={false} header={<Alert message={<>Post Actions <Text type="secondary" italic>(From Forum Page)</Text></>} type="info" />} key="3">
          <ActionInput type="posting" actionName="Post action" actions={state.postActions} setActions={(actions) => {
            state.postActions = actions;
            setState({ ...state })
          }} />   
        </Collapse.Panel>

        <Collapse.Panel showArrow={false} header={<Alert message="Get Forum Actions" type="warning" />} key="4">
          <ActionInput type="get_forum" actionName="Get forum action" actions={state.getForumActions} setActions={(actions) => {
            state.getForumActions = actions;
            setState({ ...state })
          }} />    
        </Collapse.Panel>

      </Collapse>

      {/* <Alert message="Login Actions" type="success" />
      <ActionInput type="login" actionName="Login action" actions={state.loginActions} setActions={(actions) => {
        state.loginActions = actions;
        setState({ ...state })
      }} />       */}

      {/* <Divider /> */}

      {/* <Alert message="Logout Actions" type="error" /> */}
      {/* <ActionInput type="logout" actionName="Logout action" actions={state.logoutActions} setActions={(actions) => {
        state.logoutActions = actions;
        setState({ ...state })
      }} />    */}

      {/* <Divider /> */}

      {/* <Alert message={<>Post Actions <Text type="secondary" italic>(From Forum Page)</Text></>} type="info" /> */}
      {/* <ActionInput type="posting" actionName="Post action" actions={state.postActions} setActions={(actions) => {
        state.postActions = actions;
        setState({ ...state })
      }} />    

      <Divider /> */}

      {/* <Alert message="Get Forum Actions" type="warning" />
      <ActionInput type="get_forum" actionName="Get forum action" actions={state.getForumActions} setActions={(actions) => {
        state.getForumActions = actions;
        setState({ ...state })
      }} />     */}

      <Divider />

      <Space>
        <Button type="primary" onClick={action.onCreate}>{ state.edit ? "Edit" : "Creat" }</Button>
      </Space>

    </Card>
  )
}

function ActionInput(props) {
  const { type, actionName, actions, setActions } = props;

  const axes = ["child", "descendant", "following", "following-sibling"]

  const [ state, setState ] = useState({
    index: null,
    key: null,
    value: null,
    modal: null,
    output_attribute: null,
    output_value: null,
    field: false
  })

  const action = {
    onActionAdd: () => {
      actions.push({
        tag: "div",
        // text: null,
        attributes: {},
        ancestors: [],
        action: "click", 
        input: null,
        output: {},
        type
      })
      setActions([...actions]);
    },

    onChangeAction: (index, key, value) => {
      actions[index][key] = value;
      if (key === "action") {
        if (value === "input") {
          actions[index].input = "username";
          actions[index].output = {};
        }

        if (value === "click") {
          actions[index].input = null;
          actions[index].output = {};
        }

        if (value === "not_found") {
          actions[index].input = null;
          actions[index].output = {};
        }
      }

      if (key === "tag") {
        if (value === "iframe") {
          actions[index].number = 0;
          actions[index] = {
            ...actions[index],
            // text: null,
            attributes: {},
            ancestors: [],
            action: "input", 
            input: "content",
            output: {},
            type
          }
        }
      }
      setActions([...actions]);
    },

    onAppendAction: (index) => {
      setActions(
        [
          ...actions.slice(0, index), 
          {
            tag: "div",
            // text: null,
            attributes: {},
            ancestors: [],
            action: "click", 
            input: null,
            output: {},
            type
          },
          ...actions.slice(index), 
        ]
      );
    },

    onRemoveAction: (index) => {
      actions.splice(index, 1);
      setActions([ ...actions ]);
    },

    onAddAttribute: () => {
      if (!state.key || !state.value) {
        alert("Must fillout");
        return;
      }
      if (actions[state.index].attributes[state.key]) {
        alert("This attribute exist");
        return;
      }
      actions[state.index].attributes = {
        ...actions[state.index].attributes,
        [state.key]: {
          value: state.value,
          field: state.field
        }
      };
      setActions([ ...actions ]);
      setState({ ...state })
    },

    onRemoveAttribute: (index, key) => {
      actions[index].attributes[key] = undefined;
      delete actions[index].attributes[key];
      setActions([ ...actions ]);
    },

    onAddAncestor: (index) => {
      actions[state.index].ancestors = [
        ...actions[state.index].ancestors.slice(0, index + 1), 
          {
            tag: "div",
            id: null,
            class: null,
            // text: null,
            axes: axes[1]
          },
          ...actions[state.index].ancestors.slice(index + 1), 
      ]
      setActions([...actions])
    },

    onRemoveAncestor: (index) => {
      actions[state.index].ancestors.splice(index, 1);
      setActions([...actions])
    },


    onChangeAncestor : (index, key, value) => {
      actions[state.index].ancestors[index][key] = value
      setActions([...actions])
    },

    onCancel: () => {
      setState({ ...state, index: null, key: null, value: null, modal: null, output_attribute: null, output_value: null, field: false });
    },

    onAddOutput: () => {
      const { output_attribute, output_value } = state;

      actions[state.index].output = {
        ...actions[state.index].output,
        [output_attribute]: output_value
      }
      
      setActions([...actions])
    },

    onRemoveOutput: (key) => {
      delete actions[state.index].output[key];
      setActions([...actions])
    }
  }

  const modal = () => {
    if (state.index != null) {
      return <Modal width={900} title={
        state.modal === "attributes" ?
        <Text strong>Setting attributes <Text type="secondary" italic>(You should init some specific attribute like id, class, name, text)</Text></Text>
        :
        <Text>Setting ancestors</Text>
      } visible={true} onCancel={action.onCancel}
        footer={[]}
      > 
        {
          state.modal === "attributes" ? 
          (
            <>
              <Space>
                <Text strong style={{ display: "inline-block", width: "70px" }}>Attributes </Text><Text>:</Text>
              </Space>
              <p />
              <Space>
                {
                  Object.keys(actions[state.index].attributes).map((key) => {
                    return (
                      <Tag color="magenta" style={{ marginBottom: "5px" }} closable onClose={() => action.onRemoveAttribute(state.index, key)}>
                        <Text strong>{key} :</Text>
                        <Text>{actions[state.index].attributes[key].value} <Text type="secondary" italic>{ actions[state.index].attributes[key].field ? "(using dynamic data from post data)" : null }</Text></Text>
                      </Tag>
                    )
                  })
                }
              </Space>
              <p />
              <Space>

                <Tooltip title="Using dynamic data from post">
                  <Text strong>Field data <Text type="danger">*</Text> :</Text>
                </Tooltip>
                <Checkbox value={state.field} onChange={(event) => { setState({ ...state, field: event.target.checked, value: event.target.checked ? "title" : null  }) }} />

                <Text strong>Attribute :</Text>
                <Input value={state.key} style={{ display: "inline-block", width: "250px" }} onChange={(event) => setState({ ...state, key: event.target.value })}></Input>
                
                <Text strong>Value :</Text>

                {
                  state.field ?
                  <Select style={{ display: "inline-block", width: "250px" }} value={state.value} onChange={(value) => { setState({ ...state, value }) }}>
                    {
                      ["username", "title", "content", "forum_name", "forum_url"].map((option) => <Select.Option value={option}>{ option }</Select.Option>)
                    }
                  </Select>
                  :
                  <Input value={state.value} style={{ display: "inline-block", width: "250px" }} onChange={(event) => setState({ ...state, value: event.target.value })}></Input>
                }

                
                <Button type="primary" icon={<PlusOutlined />} onClick={() => action.onAddAttribute(state.index)}>Add</Button>
              
              </Space>
            </>
          ) : null
        }

        {
          state.modal === "ancestors" ? 
          (
            <>
              <Space>
                <Text strong style={{ display: "inline-block", width: "70px" }}>Ancestor </Text><Text>:</Text>
              </Space>
              <p />
              {
                actions[state.index].ancestors.map((ancestor, index) => {
                  return (
                    <>
                      <Space>
                        <Text strong style={{ width: "20px", display: "inline-block" }}>{index + 1} : </Text>
                        <Text strong>Tag :</Text>
                        <Select value={ancestor.tag} style={{ width: "100px" }} onChange={(value) => action.onChangeAncestor(index, "tag", value)}>
                          {
                            ["a", "button", "div", "iframe", "input", "li", "span"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                          }
                        </Select>
                        <Text strong>Id :</Text>
                        <Input value={ancestor.id} style={{ width: "100px" }} placeholder="(NULL)" onChange={(event) => action.onChangeAncestor(index, "id", event.target.value)}></Input>
                        
                        <Text strong>Class :</Text>
                        <Input value={ancestor.class} style={{ width: "100px" }} placeholder="(NULL)" onChange={(event) => action.onChangeAncestor(index, "class", event.target.value)}></Input>

                        <Text strong>Text :</Text>
                        <Input value={ancestor.text} style={{ width: "100px" }} placeholder="(NULL)" onChange={(event) => action.onChangeAncestor(index, "text", event.target.value)}></Input>

                        <Text strong>Axes :</Text>
                        <Select value={ancestor.axes} style={{ width: "120px" }} onChange={(value) => action.onChangeAncestor(index, "axes", value)}>
                          {
                            axes.map((option) => <Select.Option value={option}>{option}</Select.Option>)
                          }
                        </Select>

                        <Text strong onClick={() => action.onAddAncestor(index)}><PlusOutlined /></Text>
                        <Text strong onClick={() => action.onRemoveAncestor(index)}><DeleteOutlined /></Text>
                      </Space>
                      <p />
                    </>
                  )
                })
              }
              <Divider />
              <Button type="dashed" block icon={<PlusOutlined />} onClick={() => action.onAddAncestor(actions[state.index].ancestors.length - 1)} >Add</Button>
            </>
          ) : null
        }

        {
          state.modal === "outputs" ?
          (
            <>
              <Space>
                <Text strong style={{ display: "inline-block", width: "70px" }}>Output </Text><Text>:</Text>
              </Space>
              <p />
              <div>
                {
                  Object.keys(actions[state.index].output).map((key) => {
                    return (
                      <div>
                        <Space style={{ marginBottom: "5px" }}>
                          + Get attribute <Tag>{key}</Tag> for '{actions[state.index].output[key]}' value <Text strong type="danger" onClick={() => action.onRemoveOutput(key)}><CloseOutlined /></Text>
                        </Space>
                      </div>
                    )
                  })
                }
              </div>
              <p />
              <Space>
                <Text strong style={{ display: "inline-block", width: "70px" }}>Attribute output </Text><Text>:</Text>
                <Input value={state.output_attribute} style={{ display: "inline-block", width: "250px" }} onChange={(event) => setState({ ...state, output_attribute: event.target.value })}></Input>
                <Text strong>Output value :</Text>
                <Select style={{ display: "inline-block", width: "250px" }} value={state.output_value} onChange={(value) => setState({ ...state, output_value: value })}>
                  {
                    [{ key: "forum_name", value: "Forum Name" }, { key: "forum_url", value: "Forum Link" },].map((item) => {
                      return (
                        <Select.Option value={item.key}>{item.value}</Select.Option>
                      )
                    })
                  }
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => action.onAddOutput(state.index)}>Add</Button>
              </Space>
            </>
          ) : null
        }
      </Modal>
    }
  }
  
  return (
    <>
      { modal() }
      <p/>
      {
        actions.map((item, index) => {
          if (item.tag != "iframe") {

            return <>
              <Space style={{ width: "1000px" }}>
                <Text strong>{index + 1}</Text>
                <Text strong>Tag: </Text>
                <Select style={{ width: "90px" }} value={item.tag} onChange={(value) => action.onChangeAction(index, "tag", value)}>
                  {
                    ["a", "button", "div", "iframe", "input", "li", "span", "p"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                {/* <Text strong >Text: </Text>
                <Input value={item.text} placeholder="(NULL)" style={{ width: "75px" }} onChange={(event) => action.onChangeAction(index, "text", event.target.value)} /> */}

                <Text strong>Attributes: </Text>
                <Button style={{ width: "100px" }} type="dashed" block icon={<PlusOutlined />} onClick={() => setState({ ...state, modal: "attributes", index })} >Setting</Button>

                <Text strong>Ancestors: </Text>
                <Button style={{ width: "100px" }} type="dashed" block icon={<PlusOutlined />} onClick={() => setState({ ...state, modal: "ancestors", index })} >Setting</Button>

                <Text strong>No. :</Text>
                <Tooltip title="This is the number of element in list (if it negative it is from the end (EX: -1 is the laset element in list))">
                  <InputNumber value={item.number} placeholder="(NULL)" onChange={(value) => action.onChangeAction(index, "number", value)} />
                </Tooltip>

                <Text strong> Action :</Text>
                <Select style={{ width: "100px" }}  value={item.action} onChange={(value) => action.onChangeAction(index, "action", value)}>
                  {
                    ["click", "input", "find", "not_found"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                {
                  item.action === "input" ?
                  (
                    <>
                      <Text strong> Input :</Text>
                      <Select style={{ width: "100px" }}  value={item.input} onChange={(value) => action.onChangeAction(index, "input", value)}>
                        {
                          ["username", "password", "content", "title"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                        }
                      </Select>
                    </>
                  ) : null
                }

                {
                  item.action === "find" ?
                  (
                    <>
                      <Text strong> Output :</Text>
                      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setState({ ...state, modal: "outputs", index })} ></Button>
                    </>
                  ) : null
                }
              </Space>
              
              <Space size="small">
                <Button onClick={() => action.onAppendAction(index + 1)}><PlusOutlined /></Button>
                <Button onClick={() => action.onRemoveAction(index)}><MinusOutlined /></Button>
              </Space>

              <p />

              <Space direction="vertical">
                <Text type="danger">
                  * {item.action != "not_found" ?  `${item.action} on` : "You doesn't want exist Element that has"}: {item.tag} {item.text ? `tag contain text '${item.text}'` : ''}
                </Text>
                {
                  Object.keys(item.attributes).length ?
                  <Text type="danger">
                    * Attribute :
                  </Text>
                  : null
                }
                {
                  Object.keys(item.attributes).map((attribute) => {
                    return (
                      <Text>+ <Text strong>{attribute}</Text>: {item.attributes[attribute].value} <Text type="secondary" italic>{ item.attributes[attribute].field ? "(using dynamic data from post data)" : null }</Text></Text>
                    )
                  })
                }
                {
                  item.ancestors.length ?
                  <Text type="danger">
                    * Ancestors :
                  </Text>
                  : null
                }
                {
                  item.ancestors.map(ancestor => {
                    return (
                      <Text>+ <Text strong>({ancestor.tag}{ancestor.id ? ` #${ancestor.id}` : ''}{ancestor.class ? ` .${ancestor.class}` : ''}{ancestor.text ? ` contain '${ancestor.text}'` : ''})</Text>: {ancestor.axes}</Text>
                    )
                  })
                }

                {
                  Object.keys(item.output).length ?
                  <Text type="success">
                    * Output :
                  </Text>
                  : null
                }
                {
                  Object.keys(item.output).map((key) => {
                    return (
                      <div>
                        <Space style={{ marginBottom: "5px" }}>
                          + Get attribute <Tag>{key}</Tag> for '{item.output[key]}' value.
                        </Space>
                      </div>
                    )
                  })
                }
              </Space>

              <Divider />
            </>
          }

          return (
            <>
              <Space style={{ width: "1000px" }}>
                <Text strong>{index + 1}</Text>
                <Text strong>Tag: </Text>
                <Select value={item.tag} style={{ width: "90px" }} onChange={(value) => action.onChangeAction(index, "tag", value)}>
                  {
                    ["a", "button", "div", "iframe", "input", "li", "span"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                <Text strong style={{ width: "70px", display: "inline-block" }}>No. :</Text>
                <Tooltip title="This is the number of frame in the windows">
                  <InputNumber value={item.number} placeholder="(NULL)" onChange={(value) => action.onChangeAction(index, "number", value)} />
                </Tooltip>

                <Text strong style={{ width: "80px", display: "inline-block" }}>Action: </Text>
                <Input style={{ width: "100px" }} value={item.action} disabled />

                <Space>
                  <Text strong>Input: </Text>
                  <Select value={item.input} style={{ width: "100px" }} onChange={(value) => action.onChangeAction(index, "input", value)}>
                    {
                      ["username", "password", "title", "content"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                    }
                  </Select>
                </Space>
              </Space>

              <Space style={{ width: "70px" }}>
                <Button onClick={() => action.onAppendAction(index + 1)}><PlusOutlined /></Button>
                <Button onClick={() => action.onRemoveAction(index)}><MinusOutlined /></Button>
              </Space>

              <Divider />
            </>
          )
        })
      }
      <Button type="dashed" block icon={<PlusOutlined />} onClick={action.onActionAdd} >Add {actionName}</Button>
    </>
  )
}

export default WebCreate;