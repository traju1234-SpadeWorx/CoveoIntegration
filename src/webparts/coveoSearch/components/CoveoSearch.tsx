import * as React from 'react';
//import styles from './CoveoSearch.module.scss';
import { ICoveoSearchProps } from './ICoveoSearchProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { default as pnp } from "sp-pnp-js";
import { HttpClient, HttpClientResponse} from '@microsoft/sp-http';
import * as Coveo from 'coveo-search-ui';

export default class CoveoSearch extends React.Component<ICoveoSearchProps, {}> {

  constructor(props: ICoveoSearchProps, {}) {
    super(props);
    //Setup the context to PnPjs
    pnp.setup({
      spfxContext: this.props.context,
    });
    SPComponentLoader.loadCss('https://static.cloud.coveo.com/searchui/v2.8521/css/CoveoFullSearch.css');
    SPComponentLoader.loadScript('https://static.cloud.coveo.com/searchui/v2.8521/js/CoveoJsSearch.js');
    SPComponentLoader.loadScript('https://static.cloud.coveo.com/searchui/v2.8521/js/templates/templates.js');
    SPComponentLoader.loadScript('https://static.cloud.coveo.com/searchui/v2.8521/js/cultures/en.js');
  }

  public async componentDidMount() {
    //Call Azure Token Service and Get Token
    this.GetCoveoTokenAndLoadSearchBox();    
  }
  private async GetCoveoTokenAndLoadSearchBox():Promise<void>
  {
    let strCoveoTkn: string = "";
    const requestHeaders: Headers = new Headers();
    requestHeaders.append("Content-type", "application/json");
    const postOptions : RequestInit = {
      headers: requestHeaders,
      body: `{\r\n    Email: '${this.props.currentLoginInfo.UserEmail}',\r\n    OrgID: '${this.props.coveoConfig.OrgID}', \r\n    APIKey: '${this.props.coveoConfig.APIKey}' \r\n}`,
      method: "POST"  
    };    
    //Azure Function API call 
    this.props.context.httpClient.post(this.props.coveoConfig.AzureFunctionURL, HttpClient.configurations.v1, postOptions).then((response: HttpClientResponse) => {
      response.json().then((responseJSON: JSON) => {
        strCoveoTkn = JSON.stringify(responseJSON);
        if (response.ok) {
          strCoveoTkn =  JSON.parse(JSON.stringify(responseJSON).trim()).token;
          console.log("from SearchBox ======   "+ strCoveoTkn);         
          //Display search results using Token and Organisation ID   
          Coveo.SearchEndpoint.configureCloudV2Endpoint(this.props.coveoConfig.OrgID, strCoveoTkn);
          Coveo.init(document.getElementById("search"));
          
        } else {
          console.log("Response Not Received");
        }         
      })
      .catch ((response: any) => {
        let errMsg: string = `WARNING - error when calling URL ${this.props.coveoConfig.AzureFunctionURL}. Error = ${response.message}`;
        console.log(errMsg);       
      });      
    });
  }

  public render(): React.ReactElement<ICoveoSearchProps> {
    return (
      <div id="search" className="coveo-search-section">     
        <div className="CoveoSearchbox">        
        </div>
    </div>
    );    
  }
}
