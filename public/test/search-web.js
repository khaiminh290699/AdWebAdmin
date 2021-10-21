import { Card, Checkbox, Divider, List, Pagination, Space, Tooltip, Typography } from "antd";
import Search from "antd/lib/input/Search";
import React, { useState } from "react";
import Api from "../../api";
import WebTooltip from "./web-tooltip";

const { Text, Link } = Typography;

function SearchWeb(props) {
  const api = new Api();
  const { querySearch, webs, searchResult, onStateChange, pageSearch , checkedUrls } = props;
  const [state, setState] = useState({ isSearching: false });
  const onSearch =  async(value) => {
    if (!value) {
      onStateChange({
        searchResult: {},
        pageSearch: 1
      });
      return;
    }
    setState({ ...state, isSearching: true });
    const searchResult = await api.searchApi(querySearch, pageSearch);
    setState({ ...state, isSearching: false });
    onStateChange({ searchResult });
  }

  const onCheck = (check, link) => {
    if (check) {
      checkedUrls[link] = true;
    } else {
      delete checkedUrls[link];
    }
    onStateChange({ checkedUrls, reloadCommunity: true });
  }

  const onPagination = async (page, num) => {
    const searchResult = await api.searchApi(querySearch, page, num);
    onStateChange({ searchResult, pageSearch: page });
  }

  return (
    <Card title="Search forums website">
      <Search value={querySearch} loading={state.isSearching} allowClear enterButton="Search" size="large" onChange={(event) => onStateChange({ querySearch: event.target.value })} onSearch={onSearch} />
      <Divider/>
      <List
        bordered
        dataSource={searchResult.items || []}
        footer={
          <Pagination total={searchResult.queries ? searchResult.queries.request[0].totalResults : 0} pageSize={5} current={pageSearch} onChange={onPagination} />
        }
        renderItem={item => 
          <List.Item>
            <Space direction="horizontal" size="middle">
              <Checkbox checked={checkedUrls[item.link] ? true : false} onChange={(event) => onCheck(event.target.checked, item.link)} />
              <Space direction="vertical">
                <div>
                  <div><Tooltip
                    title={() => {
                      const web = webs.filter((web) => web.url.includes(item.displayLink))[0] || {};
                      return <WebTooltip web={web} ></WebTooltip>
                    }}
                  ><Link href={item.link} strong italic>{item.title}</Link></Tooltip></div>
                  <div><Text type="secondary">{item.link}</Text></div>
                </div>
                <Text><div dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} ></div></Text>
              </Space>
            </Space>
          </List.Item>
          }
      />
    </Card>
  )
}

export default SearchWeb;