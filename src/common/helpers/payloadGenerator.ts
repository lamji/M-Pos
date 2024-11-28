import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export const updateQtyPayload = ({ type, items, values, total }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        type: type,
      };
    }),
    personName: values.personName,
    cash: total,
    date: new Date(),
    total,
    _id: uuidv4(),
  };
};

export const createTransactionPayload = ({ type, items, values, total }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        _id: uuidv4(),
        type: type,
      };
    }),
    personName: values.personName,
    cash: total,
    date: new Date(),
    total,
    _id: uuidv4(),
  };
};

export const updateUtangPayload = ({ type, items, values, total }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        _id: uuidv4(),
        type: type,
      };
    }),
    personName: values.personName,
    cash: total,
    date: new Date(),
    total,
    _id: values._id === '' ? uuidv4() : values._id,
  };
};

export const cashUpdateQty = ({ type, items, cashAmount, total }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        type: type,
      };
    }),
    cash: cashAmount,
    total,
    date: new Date(),
    _id: uuidv4(),
  };
};

export const cashTransactionQty = ({ type, items, cashAmount, total }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        _id: uuidv4(),
        type: type,
      };
    }),
    cash: cashAmount,
    total,
    date: new Date(),
    _id: uuidv4(),
  };
};

export const partialTransactionPayload = ({
  type,
  items,
  values,
  partialAmount,
  desiredAmount,
  total,
}: any) => {
  return {
    type: type,
    items: [
      {
        name: `Partial payment of ${moment(new Date()).format('lll')}`,
        price: desiredAmount,
        quantity: 1,
        id: new Date(),
        type: type,
        _id: uuidv4(),
      },
      {
        name: `Partial Balance of ${moment(new Date()).format('lll')}`,
        price: total - desiredAmount,
        quantity: 1,
        id: new Date(),
        type: 'Utang',
        _id: uuidv4(),
      },
    ],
    personName: values.personName,
    partialItems: items,
    cash: partialAmount,
    total: desiredAmount,
    date: new Date(),
    partialAmount: desiredAmount,
    isPartial: true,
    _id: uuidv4(),
  };
};

export const partialQtyPayload = ({ type, items, values, partialAmount, desiredAmount }: any) => {
  return {
    type: type,
    items: items.map((item: any) => {
      return {
        ...item,
        type: type,
      };
    }),
    personName: values.personName,
    cash: partialAmount,
    total: desiredAmount,
    date: new Date(),
    partialAmount: desiredAmount,
    _id: uuidv4(),
  };
};

export const partialUtangPayload = ({
  type,
  total,
  desiredAmount,
  values,
  partialAmount,
  items,
}: any) => {
  return {
    type: type,
    items: [
      {
        name: `Partial Balance of ${moment(new Date()).format('lll')}`,
        price: total - desiredAmount,
        quantity: 1,
        id: new Date(),
        type: type,
      },
    ],
    partialItems: items,
    personName: values.personName,
    cash: partialAmount,
    total: total - desiredAmount,
    partialAmount: desiredAmount,
    date: new Date(),
    _id: values._id === '' ? uuidv4() : values._id,
  };
};
