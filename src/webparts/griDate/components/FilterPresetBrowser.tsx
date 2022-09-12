import * as React from 'react';
import { ActionButton, DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, IColumn, ITextField, PrimaryButton, TextField } from 'office-ui-fabric-react';
import DateOpenRange from './DateOpenRange';
import { IFilterPresetBrowserProps } from './IFilterPresetBrowserProps';
import { IFilterPreset, IFilterPresets } from '../IFilterPresets';
import { useBoolean } from '@fluentui/react-hooks';

interface IFilterPresetTableRow {
    id: IFilterPreset["id"];
    name: IFilterPreset["name"];
    sdate: IFilterPreset["data"]["startDate"];
    edate: IFilterPreset["data"]["endDate"];
}

function _mapIFilterPresetsToIFilterPresetTableRowArray(presets: IFilterPresets): IFilterPresetTableRow[] {
    const loadedRows: IFilterPresetTableRow[] = [];
    presets.forEach((p: IFilterPreset) => {
        const { id, name, data } = p;
        loadedRows.push({
            id: id,
            name: name,
            sdate: data.startDate,
            edate: data.endDate
        })
    });
    return loadedRows;
}

const _columns: IColumn[] = [
    { key: 'id', name: 'ID', fieldName: 'id', minWidth: 20, maxWidth: 40, isResizable: true },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 40, maxWidth: 200, isResizable: true },
    { key: 'sdate', name: 'Start Date', fieldName: 'sdate', minWidth: 60, maxWidth: 100, isResizable: true },
    { key: 'edate', name: 'End Date', fieldName: 'edate', minWidth: 60, maxWidth: 100, isResizable: true },
];

function _renderItemColumn(item: IFilterPresetTableRow, index: number, column: IColumn): JSX.Element {
    const fieldContent: Date | string | number = item[column.fieldName as keyof IFilterPresetTableRow];
    switch (column.key) {
        case 'sdate':
        case 'edate':
            if (fieldContent === undefined)
                return <span> None </span>
            if (typeof fieldContent["toDateString"] === 'function') // eslint-disable-line dot-notation
                return <span>{(fieldContent as Date).toDateString()}</span>;
        default: // eslint-disable-line no-fallthrough
            return <span>{fieldContent}</span>;
    }
}

export default (props: IFilterPresetBrowserProps): JSX.Element => {
    const {
        loadPresets,
        savePreset,
        //removePreset
    } = props;
    const [rows, setRows] = React.useState<IFilterPresetTableRow[]>([]);
    const [saveDialog, { toggle: toggleSaveDialog }] = useBoolean(false);

    // like instance variables:
    const startDate: React.MutableRefObject<Date> = React.useRef<Date>();
    const endDate: React.MutableRefObject<Date> = React.useRef<Date>();
    const presetNameTextField: React.MutableRefObject<ITextField> = React.useRef<ITextField>();
    const highestId: React.MutableRefObject<number> = React.useRef<number>(0);

    const _loadData: () => Promise<void> = React.useCallback(async () => {
        const presets: IFilterPresets = await loadPresets();
        const presetRows: IFilterPresetTableRow[] = _mapIFilterPresetsToIFilterPresetTableRowArray(presets);
        let maxId: number = 0;
        presetRows.forEach(({ id }) => { if (id > maxId) maxId = id; });
        highestId.current = maxId;
        setRows(presetRows);
    }, [setRows, loadPresets]);

    React.useEffect(() => {
        void _loadData(); // eslint-disable-line no-void
    }, [_loadData]);

    const _savePreset: React.MouseEventHandler<ActionButton> = React.useCallback(() => {
        const s: Date = startDate.current;
        const e: Date = endDate.current;
        const n: string = presetNameTextField.current.value;
        const i: number = highestId.current + 1;
        const newPreset: IFilterPreset = {
            id: i,
            name: n,
            data: {
                startDate: s,
                endDate: e
            }
        };
        console.log("Saving preset...", s && s.toJSON(), e && e.toJSON(), n);
        savePreset(newPreset);
        toggleSaveDialog();
        void _loadData(); // eslint-disable-line no-void
    }, [_loadData, toggleSaveDialog, savePreset]);



    const _onChangeDateRange: (start: Date | undefined, end: Date | undefined) => void = React.useCallback(
        (start: Date | undefined, end: Date | undefined) => {
            //console.log("! Data range changed to ", start && start.toString(), end && end.toString());
            startDate.current = start;
            endDate.current = end;
        }, []);

    return (
        <section>
            <DateOpenRange
                onDateRangeChange={_onChangeDateRange}
                label="data ważności"
                defaultStartDate={startDate.current}
                defaultEndDate={endDate.current}
            />

            <DefaultButton onClick={toggleSaveDialog} iconProps={{ iconName: 'Save' }}> Save </DefaultButton>
            <Dialog
                hidden={!saveDialog}
                onDismiss={toggleSaveDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Save preset as",
                    subText: "Type a name for current preset."
                }}
            >
                <TextField componentRef={presetNameTextField} />
                <DialogFooter>
                    <PrimaryButton onClick={_savePreset} text="Save" />
                    <DefaultButton onClick={toggleSaveDialog} text="Cancel" />
                </DialogFooter>

            </Dialog>

            <h3> Presets </h3>
            <DetailsList
                items={rows}
                setKey="id"
                columns={_columns}
                onRenderItemColumn={_renderItemColumn}
            />

        </section>
    );
}
