import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GriDateWebPartStrings';
import GriDate from './components/GriDate';
import { IGriDateProps } from './components/IGriDateProps';
import { IDataRecord } from './IDataRecord';

export interface IGriDateWebPartProps {
  description: string;
  tabdata: IDataRecord[];
}

export default class GriDateWebPart extends BaseClientSideWebPart<IGriDateWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IGriDateProps> = React.createElement(
      GriDate,
      /**
       * So, here as props should be passed data, that don't change frequently,
       * because this render method is called sparsely. Data should be passed through
       * callback methods, obtaining data -> packed with Promise, 
       * all other data should be treated as "initial",
       * or changed by PropertyPanel Fields 
       */
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        tabdata: this.properties.tabdata,
        onClickGenerate: this._addRandomDataToProps.bind(this),
        onClickRemove: this._removeRandomDataRecord.bind(this),
        loadData: this._getDataRecords.bind(this),
      } as IGriDateProps
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _addRandomDataToProps(): void {
    const d: IDataRecord[] = [];
    for(let i: number = 0; i < 10; i++) {
      const aName: string = this._generateRandomName();
      const aScore: number = Math.floor(Math.random()*100) + 1;
      const aDate: Date = this._generateRandomDate(new Date(2020,1,1), new Date(2022,8,31));
      d.push({name: aName, score: aScore, date:aDate});
    }
    this.properties.tabdata = d;
    //console.log(this.properties.tabdata);
    //this.render(); // Question: is it a supposed way to refresh a view with new data?
    // ? maybe Rx Component have to pull data from WP thru callback function and put into its state to force rerender
  }

  private _removeRandomDataRecord(): void {
    const len: number = this.properties.tabdata.length;
    const index: number = Math.floor(Math.random()*len);
    //console.log("prepare to remove", len, index, this.properties.tabdata)
    if (len > 0) {
      this.properties.tabdata.splice(index, 1);
      this.properties.tabdata = [].concat(this.properties.tabdata); // we neen a new Array object for Rx state...
    }
    
    //this.render();
  }

  private _generateRandomName(): string {
    let res: string = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const l :number = Math.floor(Math.random() * 10) + 2;
    
    for (let i: number = 0; i < l; i++) {
      res += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return res;
  }

  private _generateRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  private _getDataRecords(): Promise<IDataRecord[]> {
    return new Promise( (resolve, reject) => {
      resolve(this.properties.tabdata);
    });
  }

}
