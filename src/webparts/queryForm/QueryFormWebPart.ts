import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'QueryFormWebPartStrings';

import { IFilterPresets, IFilterPreset } from './IFilterPresets';
import FilterPresetBrowser from './components/FilterPresetBrowser/FilterPresetBrowser';
import { IFilterPresetBrowserProps } from './components/FilterPresetBrowser/IFilterPresetBrowserProps';

export interface IQFormWebPartProps {
  description: string;
  filterPresets: IFilterPresets;
}

export default class QueryFormWebPart extends BaseClientSideWebPart<IQFormWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

   

    const element: React.ReactElement<IFilterPresetBrowserProps> = React.createElement(
      FilterPresetBrowser,
      {
        savePreset: this._saveFilterPreset.bind(this),
        loadPresets: this._loadFilterPresets.bind(this),
        removePreset: this._removeFilterPresetWithId.bind(this),

      } as IFilterPresetBrowserProps
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

  
  private _saveFilterPreset(preset: IFilterPreset): void {
    const { id } = preset;
    const presets: IFilterPresets = this.properties.filterPresets;
    const presetIndex: number = presets.findIndex((p) => p.id === id);
    if (presetIndex > -1)
      presets.splice(presetIndex, 1);
    presets.push(preset);
  }

  private async _loadFilterPresets(): Promise<IFilterPresets> {
    return /*await*/ this.properties.filterPresets;
  }

  private _removeFilterPresetWithId(id: IFilterPreset["id"]): void {
    const presets: IFilterPresets = this.properties.filterPresets;
    const presetIndex: number = presets.findIndex((p) => p.id === id);
    if (presetIndex)
      presets.splice(presetIndex, 1);
  }

}
