import { WebPartContext } from '@microsoft/sp-webpart-base';
//import { AadHttpClient } from "@microsoft/sp-http";
import '@pnp/sp/webs';
import { sp } from "@pnp/sp/presets/all";
import { ICurrentLoginInfo } from '../../common/modal/ICurrentLoginInfo';
import { ICoveoConfig } from '../../common/modal/ICoveoConfig';
import { ICoveoTokenDetails } from '../../common/modal/ICoveoTokenDetails';

import { HttpClient, HttpClientResponse} from '@microsoft/sp-http';

export class CurrentLoginInfo implements ICurrentLoginInfo {   
    public UserEmail: string;    
}

export class CoveoConfigDetails implements ICoveoConfig {   
    public OrgID: string;
    public APIKey:string;
    public AzureFunctionURL:string;   
}

export class CoveoTokenDetails implements ICoveoTokenDetails {   
    public OrgID: string;   
    public CoveoToken:string;  
}

export default class CoveoServices {  
    public static _instance: CoveoServices;
    //private spfxAadClient: AadHttpClient; 

    public constructor(private ctx: any) {        
        sp.setup({
            spfxContext: this.ctx
        });
    }
    /**
     * The initialization method, which is supposted to call at the beginning time.
     * @param ctx The web-part context
     */
    public static initialize(ctx: WebPartContext) {
        this._instance = new this(ctx);
    }
    public static get Instance() {       
        return this._instance;
    }

    /**get User Profile by UserName**/
    public async GetCurrentUserInfo(): Promise<CurrentLoginInfo> {
        const currentLoginInfo: CurrentLoginInfo = new CurrentLoginInfo();
        return await sp.web.currentUser().then((response) => {
            currentLoginInfo.UserEmail = response.Email.toString();           
            return currentLoginInfo;
        });
    }

     /**Get Coveo Config Details**/
     public async getCoveoConfigDetails(): Promise<CoveoConfigDetails> {
        var CoveoConfigListItem: ICoveoConfig = new CoveoConfigDetails();
        var item: any = await sp.web.lists.getByTitle("Coveo_Config").items.top(1).select("*").get();
        if (item != null && item[0].ID > 0) {
            item = item[0];
            CoveoConfigListItem.APIKey = item.APIKey;
            CoveoConfigListItem.OrgID = item.OrgID;
            CoveoConfigListItem.AzureFunctionURL = item.AzureFunctionURL;
        }
        return CoveoConfigListItem;
    }

    public async GetCoveoTokenAndResults(UserEmail:string, OrgID:string, APIKey:string, AzureFunctionURL:string):Promise<CoveoTokenDetails>
    {
        var strCoveoToken: string = "";
        var currCoveoTokenDetails: ICoveoTokenDetails = new CoveoTokenDetails();
        const requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-type", "application/json");
        const postOptions : RequestInit = {
        headers: requestHeaders,
            body: `{\r\n    Email: '${UserEmail}',\r\n    OrgID: '${OrgID}', \r\n    APIKey: '${APIKey}' \r\n}`,
            method: "POST"  
        };    
        //Azure Function API call 
        this.ctx.httpClient.post(AzureFunctionURL, HttpClient.configurations.v1, postOptions).then((response: HttpClientResponse) => {
            response.json().then((responseJSON: JSON) => {
                strCoveoToken = JSON.stringify(responseJSON);
                if (response.ok) {
                    strCoveoToken =  JSON.parse(JSON.stringify(responseJSON).trim()).token;
                    console.log("From Service     "+strCoveoToken);
                    currCoveoTokenDetails.OrgID = OrgID;
                    currCoveoTokenDetails.CoveoToken = strCoveoToken;
                } else {
                    console.log("Response Not Received");
                }         
            })
            .catch ((response: any) => {
                let errMsg: string = `WARNING - error when calling URL ${AzureFunctionURL}. Error = ${response.message}`;
                console.log(errMsg);       
            });      
        });
        return currCoveoTokenDetails;    
    }
}