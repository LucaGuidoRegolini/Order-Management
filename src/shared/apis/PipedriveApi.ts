import axios, { AxiosInstance } from 'axios';

const PipedriveApi = (api_token: string): AxiosInstance => {
  return axios.create({
    baseURL: 'https://api.pipedrive.com/v1',
    params: {
      api_token,
    },
  });
};

export { PipedriveApi };
