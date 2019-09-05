import moment from 'moment';
import { Connection } from '../../Home/types';
import { Date, DateRange } from './connections.types';

export interface PlotData {
  data: any;
  options: any;
}
export type ConnectionSelector = (
  connections: Connection[],
  date: Date
) => Connection[];

export const getConnectionsByDate: ConnectionSelector = (connections, date) => {
  const filterDate = moment(date, 'x');
  return connections.filter(connection => {
    const checkIn = moment(connection.checkIn, 'x');
    const checkOut = moment(connection.checkOut, 'x');
    return checkIn.isBefore(filterDate) && checkOut.isAfter(filterDate);
  });
};

type GetDateRange = (connections: Connection[]) => DateRange;

export const getDateRange: GetDateRange = (connections: Connection[]) => {
  let from: Date | null = null;
  let till: Date | null = null;

  connections &&
    connections.forEach(connection => {
      const checkIn = moment(connection.checkIn);
      const checkOut = moment(connection.checkOut);
      if (from === null || checkIn.isBefore(from)) {
        from = moment(connection.checkIn).format();
      }
      if (till === null || checkOut.isAfter(till)) {
        till = moment(connection.checkOut).format();
      }
    });
  return { from, till };
};
