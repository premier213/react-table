import faker from "@faker-js/faker";

interface ProgressType {
  id: string;
  range: string;
  value: number | string;
}

export const Progress = ({ id, range, value }: ProgressType) => {
  return (
    <>
      <div className="text-slate-400 text-xs">
        {faker.datatype.number({ max: 9000 })}
        <span className="px-1">job remaining</span>
      </div>
      <div className="flex w-40 items-center">
        <div
          className="w-full bg-gray-200 rounded-sm h-2.5 dark:bg-gray-700"
          id={id + "progress"}
        >
          <div
            className={`${range} h-2.5 rounded-sm`}
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="px-4">{`${value}%`}</div>
      </div>
    </>
  );
};
export const Owner = ({ value, id }: Partial<ProgressType>) => {
  return (
    <>
      <img src={faker.image.avatar()} className="w-6 rounded-full" alt={id} />
      {value}
    </>
  );
};
