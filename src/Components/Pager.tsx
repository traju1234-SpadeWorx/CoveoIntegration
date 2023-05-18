import * as React from 'react';
import { buildPager, Pager as PagerType, PagerState } from "@coveo/headless";
import headlessEngine from "../Components/Engine";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
export default class Pager extends React.Component {
  private headlessPager: PagerType;
  state: PagerState;

  constructor(props: any) {
    super(props);

    this.headlessPager = buildPager(headlessEngine, {
      options: { numberOfPages: 3 },
    });

    this.state = this.headlessPager.state;
  }

  componentDidMount() {
    this.headlessPager.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessPager.state);
  }

  setPage(pageNumber: number) {
    this.headlessPager.selectPage(pageNumber);
  }

  get page() {
    return this.headlessPager.state.currentPage;
  }

  get count() {
    return this.headlessPager.state.maxPage;
  }

  render() {
    return (
      <Box>
        <Typography gutterBottom>Current page</Typography>
        {/* <Pagination
          page={this.page}
          // count={this.count}
          count={5}
          boundaryCount={2}
          onChange={(e, page) => this.setPage(page)}
          variant="outlined"
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIos, next: ArrowForwardIos }}
              {...item}
            />
          )}
        /> */}
        <Pagination
          page={this.page}
          // count={this.count}
          count={5}
          boundaryCount={2}
          onChange={(e, page) => this.setPage(page)}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIos, next: ArrowForwardIos }}
              {...item}
            />
          )}
        />
      </Box>
    );
  }
}
