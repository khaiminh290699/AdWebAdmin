import { Button, Card, Divider, Input, InputNumber, Space, Typography, Select, Tooltip, Modal, Tag } from "antd";
import React, { useState } from "react";
import useWebCreateHook from "./hook";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import slug from "slug";

const { Text } = Typography;

function WebCreate() {
  const { state, action, setState } = useWebCreateHook();

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

      <Text strong>Login account action :</Text>
      <ActionInput type="login" actionName="Login action" actions={state.loginActions} setActions={(actions) => {
        state.loginActions = actions;
        setState({ ...state })
      }} />      

      <Divider />

      <Text strong>Logout account action :</Text>
      <ActionInput type="logout" actionName="Logout action" actions={state.logoutActions} setActions={(actions) => {
        state.logoutActions = actions;
        setState({ ...state })
      }} />   

      <Divider />

      <Text strong>Post action :</Text>
      <ActionInput type="posting" actionName="Post action" actions={state.postActions} setActions={(actions) => {
        state.postActions = actions;
        setState({ ...state })
      }} />    

      <Divider />

      <Text strong>Get forum from post :</Text>
      <ActionInput type="get_forum" actionName="Get forum action" actions={state.getForumActions} setActions={(actions) => {
        state.getForumActions = actions;
        setState({ ...state })
      }} />    

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
  })

  const action = {
    onActionAdd: () => {
      actions.push({
        tag: "div",
        text: null,
        attributes: {},
        ancestors: [],
        action: "click", 
        input: null,
        type
      })
      setActions([...actions]);
    },

    onChangeAction: (index, key, value) => {
      actions[index][key] = value;
      if (key === "action") {
        if (value === "input") {
          actions[index].input = "username";
        }

        if (value === "click") {
          actions[index].input = null;
        }
      }

      if (key === "tag") {
        if (value === "iframe") {
          actions[index].number = 0;
          actions[index] = {
            ...actions[index],
            text: null,
            attributes: {},
            ancestors: [],
            action: "input", 
            input: "content",
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
            text: null,
            attributes: {},
            ancestors: [],
            action: "click", 
            input: null,
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
        [state.key]: state.value
      };
      setActions([ ...actions ]);
      setState({ ...state })
    },

    onRemoveAttribute: (index, key) => {
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
            text: null,
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
      setState({ ...state, index: null, key: null, value: null, modal: null });
    },

  }

  const modal = () => {
    if (state.index != null) {
      return <Modal width={900} title={
        state.modal === "attributes" ?
        <Text strong>Setting attributes <Text type="secondary" italic>(You should init some specific attribute like id, class, name)</Text></Text>
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
                        <Text>{actions[state.index].attributes[key]}</Text>
                      </Tag>
                    )
                  })
                }
              </Space>
              <p />
              <Space>
                <Text strong style={{ display: "inline-block", width: "70px" }}>Attribute </Text><Text>:</Text>
                <Input value={state.key} style={{ display: "inline-block", width: "250px" }} onChange={(event) => setState({ ...state, key: event.target.value })}></Input>
                <Text strong>Value :</Text>
                <Input value={state.value} style={{ display: "inline-block", width: "250px" }} onChange={(event) => setState({ ...state, value: event.target.value })}></Input>
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
                        <Text strong style={{ width: "40px", display: "inline-block" }}>{index + 1} : </Text>
                        <Text strong>Tag :</Text>
                        <Select value={ancestor.tag} style={{ width: "100px" }} onChange={(value) => action.onChangeAncestor(index, "tag", value)}>
                          {
                            ["a", "button", "div", "iframe", "input", "li", "span"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                          }
                        </Select>
                        <Text strong>Id :</Text>
                        <Input value={ancestor.id} style={{ width: "100px" }} onChange={(event) => action.onChangeAncestor(index, "id", event.target.value)}></Input>
                        
                        <Text strong>Class :</Text>
                        <Input value={ancestor.class} style={{ width: "100px" }} onChange={(event) => action.onChangeAncestor(index, "class", event.target.value)}></Input>

                        <Text strong>Text :</Text>
                        <Input value={ancestor.text} style={{ width: "100px" }} onChange={(event) => action.onChangeAncestor(index, "text", event.target.value)}></Input>

                        <Text strong>Axes :</Text>
                        <Select value={ancestor.axes} style={{ width: "100px" }} onChange={(value) => action.onChangeAncestor(index, "axes", value)}>
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
              <Space style={{ width: "1020px" }}>
                <Text strong style={{ width: "20px", display: "inline-block" }}>{index + 1} : </Text>
                <Text strong>Tag: </Text>
                <Select value={item.tag} style={{ width: "75px" }} onChange={(value) => action.onChangeAction(index, "tag", value)}>
                  {
                    ["a", "button", "div", "iframe", "input", "li", "span"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                <Text strong >Text: </Text>
                <Input value={item.text} placeholder="(NULL)" style={{ width: "75px" }} onChange={(event) => action.onChangeAction(index, "text", event.target.value)} />

                <Text strong>Attributes: </Text>
                <Button style={{ width: "125px" }} type="dashed" block icon={<PlusOutlined />} onClick={() => setState({ ...state, modal: "attributes", index })} >Attributes</Button>

                <Text strong>Ancestors: </Text>
                <Button style={{ width: "125px" }} type="dashed" block icon={<PlusOutlined />} onClick={() => setState({ ...state, modal: "ancestors", index })} >Ancestors</Button>

                <Text strong> Action :</Text>
                <Select value={item.action} style={{ width: "75px" }} onChange={(value) => action.onChangeAction(index, "action", value)}>
                  {
                    ["click", "input", "find"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                {
                  item.action === "input" ?
                  (
                    <>
                      <Text strong> Input :</Text>
                      <Select value={item.input} style={{ width: "125px" }} onChange={(value) => action.onChangeAction(index, "input", value)}>
                        {
                          ["username", "password", "content", "title"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                        }
                      </Select>
                    </>
                  ) : null
                }
              </Space>
              
              <Space style={{ width: "70px" }}>
                <Button onClick={() => action.onAppendAction(index + 1)}><PlusOutlined /></Button>
                <Button onClick={() => action.onRemoveAction(index)}><MinusOutlined /></Button>
              </Space>

              <p />

              <Space direction="vertical">
                <Text type="danger">
                  *{item.tag} {item.text ? `tag contain text '${item.text}'` : ''}
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
                      <Text>+ <Text strong>{attribute}</Text>: {item.attributes[attribute]}</Text>
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
              </Space>

              <Divider />
            </>
          }

          return (
            <>
              <Space style={{ width: "1020px" }}>
                <Text strong style={{ width: "20px", display: "inline-block" }}>{index + 1} : </Text>
                <Text strong>Tag: </Text>
                <Select value={item.tag} style={{ width: "75px" }} onChange={(value) => action.onChangeAction(index, "tag", value)}>
                  {
                    ["a", "button", "div", "iframe", "input", "li", "span"].map((option) => <Select.Option value={option}>{option}</Select.Option>)
                  }
                </Select>

                <Text strong style={{ width: "33px", display: "inline-block" }}>No. :</Text>
                <Tooltip title="This is the number of frame in the windows">
                  <InputNumber value={item.number} placeholder="(NULL)" style={{ width: "70px" }} onChange={(value) => action.onChangeAction(index, "number", value)} />
                </Tooltip>

                <Text strong style={{ width: "80px", display: "inline-block" }}>Action: </Text>
                <Input style={{ width: "125px" }} value={item.action} disabled />

                <Space>
                  <Text strong style={{ width: "70px", display: "inline-block" }}>Input: </Text>
                  <Select value={item.input} style={{ width: "125px" }} onChange={(value) => action.onChangeAction(index, "input", value)}>
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