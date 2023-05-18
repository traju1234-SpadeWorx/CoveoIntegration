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
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

interface IResultListProps {
  view?: string;
}

export default class ResultList extends React.Component<IResultListProps> {
  private headlessResultList: ResultListType;
  state: ResultListState;

  constructor(props: any) {
    super(props);
    console.log("props", props);

    this.headlessResultList = buildResultList(headlessEngine, {
      options: {
        fieldsToInclude: ["ec_image", "ec_price", "ec_rating"],
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
    this.headlessResultList.subscribe(() => { });
  }

  render() {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return (
      <Grid container spacing={2}>
        {this.state.results.map((result: Result) => {
          if (this.props.view === "list") {
            return (
              <Grid
                item
                xs={12}
                display="grid"
                alignItems="stretch"
                key={result.uniqueId}
              >
                <Card sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ padding: 1, width: '140px', height: 'fit-content' }}
                    image={`${result.raw.ec_image!}`}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant='subtitle1' fontWeight={400}>
                        {<ResultLink result={result} />}
                      </Typography>
                      <Typography variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {result.excerpt}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#333' }}>
                        {formatter.format(result.raw.ec_price as number)}
                      </Typography>

                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            );
          } else {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                display="grid"
                alignItems="stretch"
              // key={result.uniqueId}
              >
                <Card>
                  <CardMedia
                    component="img"
                    sx={{ padding: 1, width: '140px', margin: '0 auto' }}
                    image={`${result.raw.ec_image!}`}
                  />
                  <CardContent>
                    <Typography variant='subtitle1' fontWeight={400}>
                      {<ResultLink result={result} />}
                    </Typography>
                    <Typography variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {result.excerpt}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#333' }}>
                      {formatter.format(result.raw.ec_price as number)}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            );
          }




        })}
      </Grid>
    );
  }
}
