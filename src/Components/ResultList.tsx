import * as React from 'react';
import ResultLink from "./ResultLink";
import {
  buildResultList,
  ResultList as ResultListType,
  Result,
  ResultListState,
} from "@coveo/headless";
import headlessEngine from "../Components/Engine";
import {
  Card,
  CardContent,
  CardMedia,
  Grid, 
  Typography,
} from "@mui/material";

export default class ResultList extends React.Component {
  private headlessResultList: ResultListType;
  state: ResultListState;

  constructor(props: any) {
    super(props);

    this.headlessResultList = buildResultList(headlessEngine, {
      options: {
        fieldsToInclude: ["BannerImageUrl", "Title", "author"],
      },
    });

    this.state = this.headlessResultList.state;
  }

  componentDidMount() {
    this.headlessResultList.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessResultList.state);
  }

  componentWillUnmount() {
    this.headlessResultList.subscribe(() => {});
  }

  render() {
    // const formatter = new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency: "USD",
    // });
    return (
      <Grid container spacing={2}>
        {this.state.results.map((result: Result) => {
          return (
            <Grid
              item
              xs={4}
              display="grid"
              alignItems="stretch"
              key={result.uniqueId}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${result.raw.BannerImageUrl!}`}
                />
                <CardContent>
                  <Typography variant="h5">
                    {<ResultLink result={result} />}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.raw.description}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {result.raw.author}                    
                  </Typography>                  
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}
