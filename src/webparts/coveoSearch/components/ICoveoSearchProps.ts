import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICurrentLoginInfo } from '../../../common/modal/ICurrentLoginInfo';
import { ICoveoConfig } from '../../../common/modal/ICoveoConfig';
export interface ICoveoSearchProps {
  description: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  currentLoginInfo: ICurrentLoginInfo;
  coveoConfig: ICoveoConfig;
}

