import axios from 'axios';
import queryString from 'query-string';
import { WatchlistInterface, WatchlistGetQueryInterface } from 'interfaces/watchlist';
import { GetQueryInterface } from '../../interfaces';

export const getWatchlists = async (query?: WatchlistGetQueryInterface) => {
  const response = await axios.get(`/api/watchlists${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWatchlist = async (watchlist: WatchlistInterface) => {
  const response = await axios.post('/api/watchlists', watchlist);
  return response.data;
};

export const updateWatchlistById = async (id: string, watchlist: WatchlistInterface) => {
  const response = await axios.put(`/api/watchlists/${id}`, watchlist);
  return response.data;
};

export const getWatchlistById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/watchlists/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWatchlistById = async (id: string) => {
  const response = await axios.delete(`/api/watchlists/${id}`);
  return response.data;
};
