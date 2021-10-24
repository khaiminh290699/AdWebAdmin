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
      if (response.data.status === 200) {
        return response.data.data;
      } else {
        alert(response.data.message);
        return;
      }
    }, (error) => {
      alert(error.message);
      Promise.reject(error);
    })
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

  listWebs = async (wheres = [], order = { created_at: -1 }) => {
    return await this.api.post("/web/list", { wheres, order });
  }

  listAccounts = async (wheres = [], order = { created_at: -1 }) => {
    return await this.api.post("/account/list", { wheres, order });
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

  createPost = async (post, forums, settings) => {
    return await this.api.post("/post/create", { post, forums, settings });
  }

  getProgressing = async (id) => {
    return await this.api.get(`/progressing/${id}`);
  }
}

export default Api;