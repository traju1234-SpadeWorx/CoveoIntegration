import * as React from 'react';
//import styles from './CoveoFeatureStories.module.scss';
import { ICoveoFeatureStoriesProps } from './ICoveoFeatureStoriesProps';
import SearchBox from "../../../Components/SearchBox";
import QuerySummary from "../../../Components/QuerySummary";
import ResultList from "../../../Components/ResultList";
import Pager from "../../../Components/Pager";
import Facet from "../../../Components/Facet";
import ResultsPerPage from "../../../Components/ResultsPerPage";
import FacetBreadcrumbs from "../../../Components/FacetBreadcrumbs";
import { loadSearchAnalyticsActions, loadSearchActions } from "@coveo/headless";
import CenteredTabs from "../../../Components/CenteredTabs";
import DidYouMean from "../../../Components/DidYouMean";
import headlessEngine from "../../../Components/Engine";
import HeadlessTab from "../../../Components/Tab";
import Sort from "../../../Components/Sort";
import { Box, Container, Grid, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
//import { buildSearchEngine, buildContext, getOrganizationEndpoints} from "@coveo/headless";  
//import { HttpClient, HttpClientResponse} from '@microsoft/sp-http';
import { default as pnp } from "sp-pnp-js";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CoveoServices from '../../../common/services/CoveoServices';


export interface ICoveoFeatureStoriesPropsState{
  viewType:string;  
}
export default class CoveoFeatureStories extends React.Component<ICoveoFeatureStoriesProps, ICoveoFeatureStoriesPropsState> {
  
  constructor(props: ICoveoFeatureStoriesProps, state: ICoveoFeatureStoriesPropsState) {
    super(props);
    this.changeResultView = this.changeResultView.bind(this);
    //Setup the context to PnPjs
    pnp.setup({
      spfxContext: this.props.context,
    });
    this.state = {
      viewType:"List"      
    };
  }
  private changeResultView(event: any, nextView: any) {
    if (nextView !== null) {
      this.setState(() => {
        return {
          ...this.state,
          viewType: nextView,
        };
      });
    }
  }

  public async componentDidMount() {
     //Call Azure Token Service and Get Token
     //this.GetCoveoTokenAndResults2();    
    CoveoServices.Instance.GetCoveoTokenAndResults(this.props.currentLoginInfo.UserEmail,this.props.coveoConfig.OrgID, this.props.coveoConfig.APIKey, this.props.coveoConfig.AzureFunctionURL)    
    const { logInterfaceLoad } = loadSearchAnalyticsActions(headlessEngine);
    const { executeSearch } = loadSearchActions(headlessEngine);
    headlessEngine.dispatch(executeSearch(logInterfaceLoad()));
  }

  // private async GetCoveoTokenAndResults2():Promise<void>
  // {
  //   let strCoveoToken: string = "";
  //   const requestHeaders: Headers = new Headers();
  //   requestHeaders.append("Content-type", "application/json");
  //   const postOptions : RequestInit = {
  //     headers: requestHeaders,
  //     body: `{\r\n    Email: '${this.props.currentLoginInfo.UserEmail}',\r\n    OrgID: '${this.props.coveoConfig.OrgID}', \r\n    APIKey: '${this.props.coveoConfig.APIKey}' \r\n}`,
  //     method: "POST"  
  //   };    
  //   //Azure Function API call 
  //   this.props.context.httpClient.post(this.props.coveoConfig.AzureFunctionURL, HttpClient.configurations.v1, postOptions).then((response: HttpClientResponse) => {
  //     response.json().then((responseJSON: JSON) => {
  //       strCoveoToken = JSON.stringify(responseJSON);
  //       if (response.ok) {
  //         strCoveoToken =  JSON.parse(JSON.stringify(responseJSON).trim()).token;
  //         console.log(strCoveoToken);         
  //         //Display search results using Token and Organisation ID 
  //         const headlessEngine = buildSearchEngine({
  //           configuration: {    
  //             organizationId: this.props.coveoConfig.OrgID,     
  //             accessToken:strCoveoToken,
  //             organizationEndpoints: getOrganizationEndpoints(this.props.coveoConfig.OrgID)
  //           }
  //         });  
  //         buildContext(headlessEngine).add("website", "engineering");          
  //         const { logInterfaceLoad } = loadSearchAnalyticsActions(headlessEngine);
  //         const { executeSearch } = loadSearchActions(headlessEngine);
  //         headlessEngine.dispatch(executeSearch(logInterfaceLoad()));
  //       } else {
  //         console.log("Response Not Received");
  //       }         
  //     })
  //     .catch ((response: any) => {
  //       let errMsg: string = `WARNING - error when calling URL ${this.props.coveoConfig.AzureFunctionURL}. Error = ${response.message}`;
  //       console.log(errMsg);       
  //     });      
  //   });
  // }

  public render(): React.ReactElement<ICoveoFeatureStoriesProps> {    
    return (
      <Container maxWidth="xl">  
        {/* Show Tabs  */}
        <CenteredTabs>
            <HeadlessTab id="All" label="Everything" expression=""/>
            <HeadlessTab id="Support" label="Support" expression="" />
            <HeadlessTab id="Applications" label="Application Resources" expression=""/>
            <HeadlessTab id="ITTipsandTricks" label="Tips and Tricks Resources" expression="" />
            <HeadlessTab id="LatestITUpdates" label="Latest IT Updates" expression=""/>
            <HeadlessTab id="HowDoI" label="How do I?" expression=""/>
            <HeadlessTab id="ITPolicies" label="IT Policies & Processes" expression=""/>                          
        </CenteredTabs>    
        <SearchBox />
        <Box my={1}>
          <FacetBreadcrumbs />
          <DidYouMean/>
          <Grid container>
            {/* Search Refiners */}
            <Grid item xs={4}>
              <Facet title="Language" field="language" />
              <Facet title="Author" field="author" />
              <Facet title="File Type" field="filetype" />
              <Facet title="Source" field="source" />
              <Facet title="Year" field="year"/>
              <Facet title="Month" field="month" />              
            </Grid>
            <Grid item xs={8}>
              <Grid container my={3} alignItems="center">
                {/* Query Summary */}
                <Grid item xs={8}>
                  <QuerySummary />
                </Grid>
                {/* Show Results List or Grid View */}                
                <Grid item xs={12} sm={4} md={4} marginY={2}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <ToggleButtonGroup value={this.state.viewType} exclusive onChange={this.changeResultView} color='error' size='small'>
                      <ToggleButton value="list" aria-label="list">
                        <ViewListIcon />
                      </ToggleButton>
                      <ToggleButton value="module" aria-label="module">
                        <ViewModuleIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Grid>
                {/* Show Sort Order */}
                <Grid item xs={4}>
                  <Sort />
                </Grid>
              </Grid>
              {/* This is your Search Result section */}
              <ResultList {...this.state}/>
              {/* Search Result Pagination and Results per page */}
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
