import { getScaledValue } from './ConnectionsProvider';

it('scales the value', () => {
  expect(
    getScaledValue({
      min: 12,
      max: 17,
      percentage: 0.5
    })
  ).toEqual(14.5);
});
