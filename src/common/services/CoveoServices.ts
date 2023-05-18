import { WebPartContext } from '@microsoft/sp-webpart-base';
//import { AadHttpClient } from "@microsoft/sp-http";
import '@pnp/sp/webs';
import { sp } from "@pnp/sp/presets/all";
import { ICurrentLoginInfo } from '../../common/modal/ICurrentLoginInfo';
import { ICoveoConfig } from '../../common/modal/ICoveoConfig';

export class CurrentLoginInfo implements ICurrentLoginInfo {   
    public UserEmail: string;    
}

export class CoveoConfigDetails implements ICoveoConfig {   
    public OrgID: string;
    public APIKey:string;
    public AzureFunctionURL:string;   
}
export default class CoveoService {  
    public static _instance: CoveoService;
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
}