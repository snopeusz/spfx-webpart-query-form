import { IFilterPreset, IFilterPresets } from "../../IFilterPresets";

export interface IFilterPresetBrowserProps {
    savePreset: (preset: IFilterPreset) => void;
    loadPresets: () => Promise<IFilterPresets>;
    removePreset: (id: IFilterPreset["id"]) => void;

}