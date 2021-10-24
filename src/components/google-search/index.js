import { Button, Card, Checkbox, Divider, Input, List, Pagination, Space, Tooltip, Typography } from "antd";
import React from "react"
import { Link } from "react-router-dom";
import WebTooltip from "../web-tooltip";
import useGoogleSearchHook from "./hook";
import { DoubleRightOutlined  } from '@ant-design/icons';

const { Text } = Typography;

function GoogleSearch() {
  const { context, state, action } = useGoogleSearchHook();
  return (
    <Card title={<Text strong>Search forums website</Text>}>
    <Input.Search value={context.searchQuery} loading={state.isSearching} allowClear enterButton="Search" size="large" onChange={action.onSearchChange} onSearch={action.onSearch} />
    <Divider/>
    <List
      bordered
      dataSource={context.searchResult.items || []}
      footer={context.searchResult.queries ? <Pagination total={context.searchResult.queries.request[0].totalResults} pageSize={5} current={context.pageSearch} onChange={action.onPaginationChange} /> : null}
      renderItem={post => 
        <List.Item>
          <SearchResultItem 
            post={post}
            web={context.webs.filter((web) => web.web_url.includes(post.displayLink))[0]}
            checked={context.selectedPosts.filter((checkedPost) =>  post.link === checkedPost)[0]}
            onCheckingPost={action.onCheckingPost}
          />
        </List.Item>
        }
    />
    <Divider/>
    <Tooltip title={<Text strong italic>View forums of posts and choosing the forums</Text>} >
      <Button style={{ float: "right" }} type="primary" onClick={() => action.onNext("forums")}> Forums <DoubleRightOutlined /> </Button>
    </Tooltip>
  </Card>
  )
}

function SearchResultItem (props) {
  const { post: { title, link, htmlSnippet }, checked, onCheckingPost, web } = props;
  return (
    <Space direction="horizontal" size="middle">
      <Checkbox checked={checked} onChange={(event) => onCheckingPost(event.target.checked, link)} />
      <Space direction="vertical">
        <div>
          <div>
            <WebTooltip web={web} >
              <Typography.Link href={link} strong italic>{title}</Typography.Link>
            </WebTooltip>
          </div>
          <div><Text type="secondary" italic>{link}</Text></div>
        </div>
        <Text><div dangerouslySetInnerHTML={{ __html: htmlSnippet }} ></div></Text>
      </Space>
    </Space>
  )
}

export default GoogleSearch;