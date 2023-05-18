import * as React from 'react';
//import styles from './CoveoFeatureStories.module.scss';
import { ICoveoFeatureStoriesProps } from './ICoveoFeatureStoriesProps';
import SearchBox from "../../../Components/SearchBox";
import QuerySummary from "../../../Components/QuerySummary";
import ResultList from "../../../Components/ResultList";
import Pager from "../../../Components/Pager";
import Facet from "../../../Components/Facet";
import ResultsPerPage from "../../../Components/ResultsPerPage";
//import FacetBreadcrumbs from "../../../Components/FacetBreadcrumbs";
import { loadSearchAnalyticsActions, loadSearchActions } from "@coveo/headless";
//import headlessEngine from "../../../Components/Engine";
import Sort from "../../../Components/Sort";
import { Box, Container, Grid, Typography } from "@mui/material";
import { buildSearchEngine, buildContext, getOrganizationEndpoints} from "@coveo/headless";  
import { HttpClient, HttpClientResponse} from '@microsoft/sp-http';
import { default as pnp } from "sp-pnp-js";

export default class CoveoFeatureStories extends React.Component<ICoveoFeatureStoriesProps, {}> {
  
  constructor(props: ICoveoFeatureStoriesProps) {
    super(props);
    //Setup the context to PnPjs
    pnp.setup({
      spfxContext: this.props.context,
    });
  }
  public async componentDidMount() {
     //Call Azure Token Service and Get Token
     this.GetCoveoTokenAndResults();     
  }

  private async GetCoveoTokenAndResults():Promise<void>
  {
    let strCoveoToken: string = "";
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
        strCoveoToken = JSON.stringify(responseJSON);
        if (response.ok) {
          strCoveoToken =  JSON.parse(JSON.stringify(responseJSON).trim()).token;
          console.log(strCoveoToken);
          //Display search results using Token and Organisation ID 
          const headlessEngine = buildSearchEngine({
            configuration: {    
              organizationId: this.props.coveoConfig.OrgID,     
              accessToken:strCoveoToken,
              organizationEndpoints: getOrganizationEndpoints(this.props.coveoConfig.OrgID)
            }
          });  
          buildContext(headlessEngine).add("website", "engineering");          
          const { logInterfaceLoad } = loadSearchAnalyticsActions(headlessEngine);
          const { executeSearch } = loadSearchActions(headlessEngine);
          headlessEngine.dispatch(executeSearch(logInterfaceLoad()));
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

  public render(): React.ReactElement<ICoveoFeatureStoriesProps> {    
    return (
      <Container maxWidth="xl">
        <Box my={3}>
          <Typography align="center" color="text.primary" variant="h2" component="h2" gutterBottom>
            Coveo Headless + Material UI With Customized Results
          </Typography>
        </Box>
        <SearchBox />
        <Box my={1}>
          {/* <FacetBreadcrumbs /> */}
          <Grid container>
            <Grid item xs={4}>
              <Facet title="Source" field="spsitename" />
              <Facet title="File Type" field="filetype" />
              <Facet title="Year" field="year"/>
              <Facet title="Month" field="month" />
            </Grid>
            <Grid item xs={8}>
              <Grid container my={3} alignItems="center">
                <Grid item xs={8}>
                  <QuerySummary />
                </Grid>
                <Grid item xs={4}>
                  <Sort />
                </Grid>
              </Grid>
              <ResultList />
              <Box my={4}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Pager />
                  </Grid>
                  <Grid item xs={6}>
                    <ResultsPerPage />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>);    
  }
}
