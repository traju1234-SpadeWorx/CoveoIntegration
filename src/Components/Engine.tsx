
import {
    buildSearchEngine,
    buildContext,
    getOrganizationEndpoints
  } from "@coveo/headless";  
import CoveoServices from '../common/services/CoveoServices';

CoveoServices.Instance.GetCurrentUserInfo().then(results => { 
  console.log(results); 
}).catch(err => {
  console.error("Error occured in ITBanner webpart : Call():GetCurrentUserInfo" + err);
});
CoveoServices.Instance.getCoveoConfigDetails().then(results => {  
  console.log(results); 
}).catch(err => {
  console.error("Error occured in ITBanner webpart : Call():GetCurrentUserInfo" + err);
});

//Pass OrgID and Coveo Token
  const headlessEngine = buildSearchEngine({
    configuration: {    
      organizationId: "equinixnonproduction2po6l1c0d",     
      accessToken:"NotWorking",
      organizationEndpoints: getOrganizationEndpoints("equinixnonproduction2po6l1c0d")
    }
  });
  
  buildContext(headlessEngine).add("website", "engineering");  
  export default headlessEngine;  