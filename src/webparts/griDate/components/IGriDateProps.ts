import { IDataRecord } from "../IDataRecord";

export interface IGriDateProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  tabdata: IDataRecord[];
  onClickGenerate: ()=>void;
  onClickRemove: ()=>void;
  loadData: ()=>Promise<IDataRecord[]>;
}
