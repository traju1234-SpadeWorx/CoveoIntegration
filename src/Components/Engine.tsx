
import {
    buildSearchEngine,
    buildContext,
    getOrganizationEndpoints
  } from "@coveo/headless";  
import CoveoServices from '../common/services/CoveoServices';
import '@pnp/sp/webs';
import { sp } from "@pnp/sp/presets/all";


// CoveoServices.Instance.getCoveoConfigDetails().then(results => {  
//   console.log(results); 
// }).catch(err => {
//    console.error("Error occured in ITBanner webpart : Call():GetCurrentUserInfo" + err);
//  });

 // const getTokenInfo = function()
//Pass OrgID and Coveo Token
  const headlessEngine = buildSearchEngine({
    configuration: {    
      organizationId: "getTokenInfo",     
      accessToken: "",
      organizationEndpoints: getOrganizationEndpoints("equinixproductionx5sna09x")
    }
  });  
  
  buildContext(headlessEngine).add("website", "engineering");  
  export default  headlessEngine;