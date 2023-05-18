import {
    buildSearchEngine,
    buildContext,
    getOrganizationEndpoints
  } from "@coveo/headless";  



  const headlessEngine = buildSearchEngine({
    configuration: {
    organizationId: "barcagroupproductionkwvdy6lp",
    accessToken: "xx5a7943ef-ea52-42e5-8742-51198cc651f7",
    organizationEndpoints: getOrganizationEndpoints('barcagroupproductionkwvdy6lp')

      // organizationId: "equinixnonproduction2po6l1c0d",
      // accessToken:"eyJhbGciOiJIUzI1NiJ9.eyJzZWFyY2hIdWIiOiJJVCBIVUIgLSBGdWxsIFNlYXJjaCIsInY4Ijp0cnVlLCJvcmdhbml6YXRpb24iOiJlcXVpbml4bm9ucHJvZHVjdGlvbjJwbzZsMWMwZCIsInVzZXJJZHMiOlt7InR5cGUiOiJVc2VyIiwibmFtZSI6InJhdGhhZGFrYW1hZGxhQGVxdWluaXguY29tIiwicHJvdmlkZXIiOiJFbWFpbCBTZWN1cml0eSBQcm92aWRlciJ9XSwicm9sZXMiOlsicXVlcnlFeGVjdXRvciJdLCJleHAiOjE2ODQyMzE4MDUsImlhdCI6MTY4NDE0NTQwNX0.xd1QT3m0y2-vwD9eUAvJ-OuR2CyhYhu1PwD81EdOQx4",
      // organizationEndpoints: getOrganizationEndpoints("equinixnonproduction2po6l1c0d")
    }
  });
  
  buildContext(headlessEngine).add("website", "engineering");  
  export default headlessEngine;  