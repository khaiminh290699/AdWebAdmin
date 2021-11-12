import axios from "axios";

const { REACT_APP_API_HOST } = process.env;

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: REACT_APP_API_HOST,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      Promise.reject(error)
    })
    
    this.api.interceptors.response.use((response) => {
      // if (response.data.status === 200) {
      //   return response.data.data;
      // } else {
      //   alert(response.data.message);
      //   return Promise.reject(new Error(response.data.message));
      // }
      return response.data;
    }, (error) => {
      Promise.reject(error);
      return { status: 500, message: error.message };
    })
  }

  login = async (username, password) => {
    return await this.api.post("/auth/log-in", { username, password });
  }

  getInfo = async () => {
    return await this.api.post("/auth/get-info");
  }

  searchApi = async (q, page, num = 5) => {
    return await this.api.get(`/search`, { params: { q, page, num } })
  }

  uploadApi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    const { data: { data } } = await axios.post(`${REACT_APP_API_HOST}/file/upload`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return data;
  }

  removeFileApi = async (filenames = []) => {
    if (filenames.length) {
      return;
    }
    return await this.api.post("/file/remove", { filenames });
  }

  listWebs = async (wheres = [], order = { created_at: -1 }, pageIndex, pageSize) => {
    return await this.api.post("/web/list", { wheres, order, pageIndex, pageSize });
  }

  listAccounts = async (wheres = [], order = { created_at: -1 }, pageIndex, pageSize, mode) => {
    return await this.api.post("/account/list", { wheres, order, pageIndex, pageSize, mode });
  }

  accountUpsert = async (accounts) => {
    return await this.api.post("/account/upsert", { accounts });
  }

  getCommunity = async (urls) => {
    return await this.api.post("/web/get-community", { urls });
  }

  listForums = async (wheres = [], order = { created_at: -1 }) => {
    return await this.api.post("/web/forums", { wheres, order });
  }

  createPost = async (post, forums, settings, backlinks) => {
    return await this.api.post("/post/create", { post, forums, settings, backlinks });
  }

  getProgressing = async (id) => {
    return await this.api.get(`/progressing/${id}`);
  }

  reProgressing = async (id) => {
    return await this.api.post(`/progressing/re-progress`, { id })
  }

  getListTimerPost = async (inDate, wheres = [], order = {}) => {
    return await this.api.post(`/post/list-timer`, { inDate, wheres, order });
  }

  accountToogle = async (account_id) => {
    return await this.api.post(`/account/toogle`, { account_id });
  }

  listPosts = async (wheres, order = { "created_at": -1 }, pageIndex, pageSize, mode) => {
    return await this.api.post(`/post/list`, { wheres, order, pageSize, pageIndex, mode });
  }

  togglePost = async (post_id) => {
    return await this.api.post(`/post/toggle`, { post_id });
  }

  cancelProgressing = async (progressing_id) => {
    return await this.api.post(`/progressing/cancel`, { progressing_id });
  }

  getOnePost = async (id) => {
    return await this.api.get(`/post/${id}`);
  }

  listUsers = async (wheres = [], order = { "created_at": -1 }, page, limit) => {
    return await this.api.post(`/auth/users`, { wheres, order, pageSize: limit, pageIndex: page });
  }

  setPermission = async (user_id, permission) => {
    return await this.api.post(`/auth/set-permission`, { user_id, permission });
  }

  resetPassword = async (user_id, password) => {
    return await this.api.post(`/auth/reset-password`, { user_id, password });
  }

  createUser = async (username, password) => {
    return await this.api.post(`/auth/sign-in`, { username, password });
  }

  toggleUser = async (user_id) => {
    return await this.api.post(`/auth/toggle-activate`, { user_id });
  }

  createBackLink = async (link_url) => {
    const str = window.location.href.split("/");
    const web_host = `${str[0]}//${str[2]}/redirect`
    return await this.api.post(`/post/backlink/create`, { link_url, web_host });
  }

  removeBacklink = async (ids) => {    
    return await this.api.post(`/post/backlink/delete`, { ids });
  }

  getBackLink = async (backlink_id, post_id, forum_id, setting_id, type, timer_at) => {
    return await this.api.post(`/post/backlink/get`, { backlink_id, post_id, forum_id, setting_id, type, timer_at });
  }

  getInTime = async (from, to) => {
    return await this.api.post(`/statistic/in-time`, { from, to });
  }

  getTotal = async (from, to) => {
    return await this.api.post(`/statistic/get-total`, { from, to });
  }

  updatePost = async (post, accountSettings) => {
    return await this.api.post(`/post/update`, { post, accountSettings });
  }

  createWeb = async (web_url, web_name, web_key, actions) => {
    return await this.api.post(`/web/upsert`, { web_url, web_name, web_key, actions });
  }

  updateWeb = async (id, web_url, web_name, web_key, actions) => {
    return await this.api.post(`/web/upsert`, { id, web_url, web_name, web_key, actions });
  }

  getOneWeb = async (id) => {
    return await this.api.get(`/web/${id}`);

  }
}

export default Api;