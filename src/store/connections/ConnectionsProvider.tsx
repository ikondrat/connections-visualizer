import React, { useEffect, useReducer } from 'react';
import { Connection } from '../../Home/types';
import axios from 'axios';
import { connectionsReducer, initialState } from './connections.reducer';
import { getConnectionsByDate, getDateRange } from './connections.selector';
import { DateRange } from './connections.types';
import moment from 'moment';

type SelectByPercent = (percent: number) => void;

interface ConnectionsContextInterface {
  state: ConnectionsState;
  selectByPercent: SelectByPercent;
}
const ConnectionsContext = React.createContext<ConnectionsContextInterface>({
  state: initialState,
  selectByPercent: () => undefined
});

export interface ConnectionsState {
  isPending: boolean;
  payload: Connection[] | null;
  connections: Connection[] | null;
  percentage: number;
  dateRange: DateRange | null;
}

interface GetScaledValueProps {
  min: number;
  max: number;
  percentage: number;
}
type GetScaledValue = (props: GetScaledValueProps) => number;

export const getScaledValue: GetScaledValue = ({ min, max, percentage }) => {
  const diff = max - min;
  return percentage * diff + min;
};

const selectByPercent = (
  connections: Connection[],
  percent: number,
  dispatch: any
) => {
  const dateRange = getDateRange(connections);
  if (dateRange.till && dateRange.from) {
    const from = parseInt(moment(dateRange.from).format('x'), 10);
    const till = parseInt(moment(dateRange.till).format('x'), 10);
    const selectedDate = getScaledValue({
      min: from,
      max: till,
      percentage: percent / 100
    });
    const date = moment(selectedDate, 'x').format();
    dispatch({
      type: 'selectByDate',
      payload: {
        connections: getConnectionsByDate(connections, date),
        dateRange,
        percentage: percent
      }
    });
  }
};

const ConnectionsProvider: React.FC = props => {
  const [state, dispatch] = useReducer(connectionsReducer, initialState);

  useEffect(() => {
    if (state.payload === null) {
      axios({
        url: '/connections.json',
        method: 'get'
      }).then((response: any) => {
        dispatch({
          type: 'success',
          payload: {
            connections: response.data
          }
        });
        selectByPercent(response.data, 20, dispatch);
      });
    }
  });
  return (
    <ConnectionsContext.Provider
      value={{
        state,
        selectByPercent: (percent: any) =>
          state.payload && selectByPercent(state.payload, percent, dispatch)
      }}
    >
      {props.children}
    </ConnectionsContext.Provider>
  );
};

export { ConnectionsContext, ConnectionsProvider };
