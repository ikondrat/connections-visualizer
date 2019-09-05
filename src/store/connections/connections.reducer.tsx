import { ConnectionsState } from './ConnectionsProvider';
import { Connection } from '../../Home/types';
import { DateRange } from './connections.types';

export const initialState: ConnectionsState = {
  isPending: false,
  payload: null,
  dateRange: null,
  percentage: 20,
  connections: null
};

interface SuccessPayload {
  connections: Connection[];
}

interface SelectPayload {
  connections: Connection[];
  dateRange: DateRange;
  percentage: number;
}
export type ConnectionsAction =
  | { type: 'success'; payload: SuccessPayload }
  | { type: 'selectByDate'; payload: SelectPayload }
  | { type: 'failure'; error: string };

export const connectionsReducer = (
  state: ConnectionsState,
  action: ConnectionsAction
) => {
  switch (action.type) {
    case 'success':
      return {
        ...state,
        payload: action.payload.connections
      };
    case 'selectByDate':
      const { connections, dateRange, percentage } = action.payload;
      return {
        ...state,
        connections,
        dateRange,
        percentage
      };
    default:
      return state;
  }
};
