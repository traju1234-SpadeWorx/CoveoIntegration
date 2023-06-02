import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'CoveoFeatureStoriesWebPartStrings';
import CoveoFeatureStories from './components/CoveoFeatureStories';
import { ICoveoFeatureStoriesProps } from './components/ICoveoFeatureStoriesProps';

import CoveoServices from '../../common/services/CoveoServices';
import { ICurrentLoginInfo } from '../../common/modal/ICurrentLoginInfo';
import { ICoveoConfig } from '../../common/modal/ICoveoConfig';

export interface ICoveoFeatureStoriesWebPartProps {
  description: string;
  context: WebPartContext;
}

export default class CoveoFeatureStoriesWebPart extends BaseClientSideWebPart<ICoveoFeatureStoriesWebPartProps> {
  private CurrentLoginInfo: ICurrentLoginInfo;
  private CoveoConfigDetails: ICoveoConfig;

  public onInit(): Promise<void> {
    return super.onInit().then(async _ => {      
      //Intiate CoveoService Class Object
      CoveoServices.initialize(this.context);
    });
  }

  public async render(): Promise<void> {
    await this.call().then(() => {
      const element: React.ReactElement<ICoveoFeatureStoriesProps> = React.createElement(
        CoveoFeatureStories,
        {
          description: this.properties.description,         
          hasTeamsContext: !!this.context.sdks.microsoftTeams,
          userDisplayName: this.context.pageContext.user.displayName,
          context: this.context,
          currentLoginInfo: this.CurrentLoginInfo,
          coveoConfig:this.CoveoConfigDetails
        }
      );
      ReactDom.render(element, this.domElement);
    });
  }

  public async call(): Promise<void> {    
    //Get Current Logged User Info
    await CoveoServices.Instance.GetCurrentUserInfo().then(results => {
      this.CurrentLoginInfo = results;
      Promise.resolve();
    }).catch(err => {
      console.error("Error occured in ITBanner webpart : Call():GetCurrentUserInfo" + err);
    });

     //Get Azure Function App Details
     await CoveoServices.Instance.getCoveoConfigDetails().then(results => {
      this.CoveoConfigDetails = results;    
    }).catch(err => {
      console.error("Error occured in Coveo Search Result webpar : Call():getCoveoConfigDetails" + err);
    });
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
}
