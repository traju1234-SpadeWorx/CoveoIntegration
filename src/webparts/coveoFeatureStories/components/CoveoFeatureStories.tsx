import * as React from 'react';
//import styles from './CoveoFeatureStories.module.scss';
import { ICoveoFeatureStoriesProps } from './ICoveoFeatureStoriesProps';

//import SearchBox from "../../../Components/SearchBox";
import QuerySummary from "../../../Components/QuerySummary";
import ResultList from "../../../Components/ResultList";
import Pager from "../../../Components/Pager";
import Facet from "../../../Components/Facet";
import ResultsPerPage from "../../../Components/ResultsPerPage";
//import FacetBreadcrumbs from "../../../Components/FacetBreadcrumbs";
import { loadSearchAnalyticsActions, loadSearchActions } from "@coveo/headless";
import headlessEngine from "../../../Components/Engine";
import Sort from "../../../Components/Sort";
import { Box, Container, Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ICoveoFeatureStoriesState } from './ICoveoFeatureStoriesState';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

export default class CoveoFeatureStories extends React.Component<ICoveoFeatureStoriesProps, ICoveoFeatureStoriesState> {


  public constructor(props: ICoveoFeatureStoriesProps, state: ICoveoFeatureStoriesState) {
    super(props);

    this.state = {
      view: "list",
    };
  }

  public async componentDidMount() {
    const { logInterfaceLoad } = loadSearchAnalyticsActions(headlessEngine);
    const { executeSearch } = loadSearchActions(headlessEngine);
    headlessEngine.dispatch(executeSearch(logInterfaceLoad()));

  }

  handleChange = (event: any, nextView: any) => {
    this.setState(() => {
      return {
        ...this.state,
        view: nextView,
      };
    });

  };

  public render(): React.ReactElement<ICoveoFeatureStoriesProps> {
    return (
      <Container maxWidth="xl">


        {/* <SearchBox /> */}
        <Box my={1}>
          {/* <FacetBreadcrumbs /> */}
          <Grid container>
            <Grid item xs={4}>
              <Facet title="Brand" field="ec_brand" />
              <Facet title="Frequencies" field="eng_frequencies" />
              <Facet title="Processor" field="eng_processor" />
              <Facet title="Store name" field="store_name" />
            </Grid>
            <Grid item xs={8}>
              <Grid container my={3} alignItems="center">
                <Grid item xs={12} sm={4} md={4} marginY={2}>
                  <QuerySummary />
                </Grid>
                <Grid item xs={12} sm={4} md={4} marginY={2}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <ToggleButtonGroup
                      value={this.state.view}
                      exclusive
                      onChange={this.handleChange}
                      color='error'
                      size='small'
                    >
                      <ToggleButton value="list" aria-label="list">
                        <ViewListIcon />
                      </ToggleButton>
                      <ToggleButton value="module" aria-label="module">
                        <ViewModuleIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4} md={4} marginY={2}>
                  <Sort />
                </Grid>
              </Grid>
              <ResultList {...this.state} />
              <Box my={4}>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={6} md={6}>
                    <Pager />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
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
