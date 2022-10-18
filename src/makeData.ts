import faker from "@faker-js/faker";

export type DefaultProps = {
  title: string;
  owner: string;
  due: string;
  progress: number;
  score: number;
  lastUpdated: string;
  subRows?: DefaultProps[];
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export const colorRange = (value: number, max: number) => {
  if (value >= 0 && value < max / 4) {
    return "bg-red-500";
  } else if (value >= max / 4 && value < (max / 4) * 2) {
    return "bg-yellow-500";
  } else if (value > (max / 4) * 2 && value < max) {
    return "bg-blue-500";
  } else {
    return "bg-green-500";
  }
};

const newTable = (): DefaultProps => {
  return {
    title: faker.name.title(),
    owner: faker.name.firstName(),
    due: `${faker.date.month()}   30`,
    progress: faker.datatype.number(100),
    score: faker.datatype.float({ min: 0, max: 9, precision: 0.1 }),
    lastUpdated: faker.helpers.shuffle<DefaultProps["lastUpdated"]>([
      "Never",
      "a Days ago",
      "2 Days ago",
    ])[0]!,
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): DefaultProps[] => {
    const len = lens[depth]!;
    return range(len).map((d): DefaultProps => {
      return {
        ...newTable(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
