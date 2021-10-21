// import React, { useEffect, useState } from "react";
// import { Card, Space, Table, Tooltip, Typography, Input, Modal, Button, Divider, Select, Spin, Row, Col } from "antd";
// import Api from "../../api";
// import SearchWeb from "./search-web";
// import Community from "./community";
// import ContentEditor from "./content-editor";
// import Account from "./account";
// import moment from "moment";

// const { Text } = Typography;

// function PostCreate() {
//   const api = new Api();
//   let [state, setState] = useState({ 
//     isLoading: true, 
//     stage: "search", 
//     title: "",
//     content: "", 
//     accountSetting: {}, 
//     webs: [], 
//     checkedUrls: {}, 
//     checkedAccounts: [], 
//     querySearch: "", 
//     searchResult: {},
//     communities: [],
//     pageSearch: 1,
//     isLocking: false,
//     reloadCommunity: true,
//     uploadedFiles: [],
//     errorMessage: {}
//   }); 

//   useEffect(async () => {
//     const webs = await api.listWebs();
//     setState({ ...state, webs, isLoading: false })

//     window.addEventListener("beforeunload",async (e) => {
//       e.preventDefault();
//       await api.removeFileApi(state.uploadedFiles);
//     })
//   }, [])

//   const onStateChange = (newValue) => {
//     setState({ ...state, ...newValue });
//   }

//   const onCreate = () => {
//     const { title, content } = state; 

//     const communities = state.communities.reduce((results, communitiy) => {
//       if (!results.filter((result) => result.comunity === communitiy.href)[0]) {
//         results.push({
//           comunity: communitiy.href,
//           web_key: communitiy.key,
//           web_id: communitiy.id
//         })
//       }
//       return results;
//     }, [])

//     const accounts = Object.keys(state.accountSetting).map((account_id) => {
//       return {
//         account_id,
//         create_type: state.accountSetting[account_id].create,
//         setting_timer: state.accountSetting[account_id].timer === "not" ? null : moment(state.accountSetting[account_id].timer).format("HH:00")
//       }
//     })

//     console.log({
//       communities,
//       accounts
//     })

//     // setState({ ...state, uploadedFiles: [] })
//   }

//   return (
//     <Card title={
//       <Space>
//         <Text>Create post</Text> {state.isLoading ? <Spin></Spin> : null}
//       </Space>
//     }>
//       {
//         state.stage === "search" ? 
//         <>
//           <SearchWeb querySearch={state.querySearch} checkedUrls={state.checkedUrls} searchResult={state.searchResult} webs={state.webs} pageSearch={state.pageSearch} errorMessage={state.errorMessage} onStateChange={onStateChange}></SearchWeb>
//           {
//             state.errorMessage["search"] ?
//             <Text type="danger" strong>{state.errorMessage["search"]}</Text> : null
//           }
//           <Divider></Divider>
//           <Button type="primary" onClick={() => {
//             if (!Object.keys(state.checkedUrls).length) {
//               state.errorMessage["search"] = "You have to choose the post for get forum you want to post to!"
//               setState({ ...state, errorMessage: { ...state.errorMessage } })
//               return;
//             }
//             delete state.errorMessage["search"]
//             setState({ ...state, stage: "community", errorMessage: { ...state.errorMessage } })
//           }}>Next</Button>
//         </> : null
//       }
//       {
//         state.stage === "community" ? <>
//           <Community webs={state.webs} checkedUrls={state.checkedUrls} communities={state.communities} isLocking={state.isLocking} reloadCommunity={state.reloadCommunity} onStateChange={onStateChange}></Community> 
//           <Divider></Divider>
//           <Row>
//             <Col span={8}>
//               <Button type="default" disabled={state.isLocking} onClick={() => setState({ ...state, stage: "search" })}>Back</Button>
//             </Col>
//             <Col span={1} offset={15}>
//               <Button type="primary" disabled={state.isLocking} onClick={() => setState({ ...state, stage: "content" })}>Next</Button>
//             </Col>
//           </Row>
//         </>: null
//       }
//       {
//         state.stage === "content" ? <>
//           <ContentEditor title={state.title} content={state.content} uploadedFiles={state.uploadedFiles} onStateChange={onStateChange}></ContentEditor> 
//           {
//             state.errorMessage["content"] ?
//             <Text type="danger" strong>{state.errorMessage["content"]}</Text> : null
//           }
//           <Divider></Divider>
//           <Row>
//             <Col span={8}>
//               <Button type="default" onClick={() => setState({ ...state, stage: "community" })}>Back</Button>
//             </Col>
//             <Col span={1} offset={15}>
//               <Button type="primary" onClick={() => {
//                 if (!state.content || !state.title) {
//                   state.errorMessage["content"] = "You have to fill out full title & content!"
//                   setState({ ...state, errorMessage: { ...state.errorMessage } })
//                   return;
//                 }
//                 delete state.errorMessage["content"]
//                 setState({ ...state, stage: "account" })
//               }}>Next</Button>
//             </Col>
//           </Row>
//         </>: null
//       }
//       {
//         state.stage === "account" ? <>
//           <Account checkedUrls={state.checkedUrls} accountSetting={state.accountSetting} webs={state.webs} onStateChange={onStateChange}></Account>
//           <Divider></Divider>
//           <Row>
//             <Col span={8}>
//               <Button type="default" onClick={() => setState({ ...state, stage: "content" })}>Back</Button>
//             </Col>
//             <Col span={1} offset={15}>
//               <Button type="primary" onClick={onCreate}>Create</Button>
//             </Col>
//           </Row>
//         </>: null
//       }
//     </Card>
//   )
// }

// export default PostCreate;

