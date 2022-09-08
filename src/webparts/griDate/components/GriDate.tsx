import * as React from 'react';
import styles from './GriDate.module.scss';
import { IGriDateProps } from './IGriDateProps';
import { ActionButton, DetailsList, IColumn, IIconProps } from 'office-ui-fabric-react';
import { IDataRecord } from '../IDataRecord';
import { DateRangeElement } from './Datex';

const _columns: IColumn[] = [
  { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'score', name: 'Score', fieldName: 'score', minWidth: 40, maxWidth: 200, isResizable: true },
  { key: 'date', name: 'Date', fieldName: 'date', minWidth: 100, maxWidth: 200, isResizable: true },
];

function _renderItemColumn(item: IDataRecord, index: number, column: IColumn): JSX.Element {
  const fieldContent: Date | string | number = item[column.fieldName as keyof IDataRecord];
  switch (column.key) {
    case 'date':
      /** 
       * It seems somehow when storing/refreshing page WP properties are 
       * stored by *.toJSON() conversion to JSON string.
       */
      console.log("from _renderItemColumn (Rx) - date key, fieldContent:", fieldContent, typeof fieldContent);
      // eslint-disable-next-line dot-notation
      if (typeof fieldContent["toDateString"] === 'function') {
        return <span>{(fieldContent as Date).toDateString()}</span>;
      } else {
        return <span>{fieldContent}</span>;
      }

    default:
      return <span>{fieldContent}</span>;
  }
}

const _generateDataButtonIcon: IIconProps = { iconName: 'AutoEnhanceOn' };

export default (props: IGriDateProps): JSX.Element => {
  const [tabdata, setTabData] = React.useState([] as IDataRecord[]);

  const {
    onClickGenerate,
    onClickRemove,
    loadData
  } = props;

  const _loadData: () => Promise<void> = React.useCallback(async () => {
    // loadData().then((d: IDataRecord[]) => {
    //   setTabData(d);
    // }, () => { });
    setTabData(await loadData());
  }, [setTabData, loadData]);

  React.useEffect(() => {
    void _loadData(); // eslint-disable-line no-void
  }, [_loadData]);

  const _onClickRemove: React.MouseEventHandler<ActionButton> = React.useCallback(() => {
    onClickRemove();
    void _loadData(); // eslint-disable-line no-void
  }, [onClickRemove, _loadData]);

  const _onClickGenerate: React.MouseEventHandler<ActionButton> = React.useCallback(() => {
    onClickGenerate();
    void _loadData(); // eslint-disable-line no-void
  }, [onClickGenerate, _loadData]);

  const _onJustRefresh: React.MouseEventHandler<ActionButton> = React.useCallback(() => {
    void _loadData(); // eslint-disable-line no-void
  }, [_loadData]);


  return (
    <section className={`${styles.griDate}`}>

      <DateRangeElement
        disabled={false}
      />

      {/* <h3>Tabdata</h3>
      <div>
        {tabdata.map(({ name, score, date }, i) => (
          <div key={name}>
            {i + 1}, {name}, {score}, {date.toDateString()}
          </div>))}
      </div>
       */}

      <ActionButton onClick={_onClickGenerate} iconProps={_generateDataButtonIcon} > Generate data </ActionButton>
      <ActionButton onClick={_onClickRemove} iconProps={{ iconName: 'Delete' }} > Remove data </ActionButton>
      <ActionButton onClick={_onJustRefresh} iconProps={{ iconName: 'Refresh' }} > Refresh </ActionButton>

      <h3> DetailsList </h3>
      <DetailsList
        items={tabdata}
        columns={_columns}
        onRenderItemColumn={_renderItemColumn}
      />

    </section>
  );
}
