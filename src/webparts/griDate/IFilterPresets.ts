export interface IFilterPresetData {
  startDate: Date | undefined;
  endDate: Date | undefined;
}
export interface IFilterPreset {
  id: number;
  name: string;
  data: IFilterPresetData;
}
export type IFilterPresets = IFilterPreset[];
