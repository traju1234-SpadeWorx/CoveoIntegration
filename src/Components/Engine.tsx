
import {
    buildSearchEngine,
    buildContext,
    getOrganizationEndpoints
  } from "@coveo/headless";  

  const headlessEngine = buildSearchEngine({
    configuration: {    
      organizationId: "equinixnonproduction2po6l1c0d",     
      accessToken:"eyJhbGciOiJIUzI1NiJ9.eyJzZWFyY2hIdWIiOiJJVCBIVUIgLSBGdWxsIFNlYXJjaCIsInY4Ijp0cnVlLCJvcmdhbml6YXRpb24iOiJlcXVpbml4bm9ucHJvZHVjdGlvbjJwbzZsMWMwZCIsInVzZXJJZHMiOlt7InR5cGUiOiJVc2VyIiwibmFtZSI6InJhdGhhZGFrYW1hZGxhQGVxdWluaXguY29tIiwicHJvdmlkZXIiOiJFbWFpbCBTZWN1cml0eSBQcm92aWRlciJ9XSwicm9sZXMiOlsicXVlcnlFeGVjdXRvciJdLCJleHAiOjE2ODQ0MTYyMjYsImlhdCI6MTY4NDMyOTgyNn0.WvDkiip0cTeC0vG0P8BYEo_WJ2sm98yv6IlyS78MHZM",
      organizationEndpoints: getOrganizationEndpoints("equinixnonproduction2po6l1c0d")
    }
  });
  
  buildContext(headlessEngine).add("website", "engineering");  
  export default headlessEngine;  