export interface IDataRecord {
  name: string;
  score: number;
  date: Date; // !! this is converted to JSON string on refresh, so it's kept as string, with no backward conversion to Date object!!!
}
