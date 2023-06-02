import * as React from 'react';
import ResultLink from "./ResultLink";
import {
  buildResultList,
  ResultList as ResultListType,
  Result,
  ResultListState,
  buildUrlManager,
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

export interface ResultListProps{
  viewType?:string;  
}

export default class ResultList extends React.Component<ResultListProps> {
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
     // Identify the hash fragment
     const fragment = window.location.hash.slice(1);

     // Build the UrlManager controller with said fragment.
     const urlManager = buildUrlManager(headlessEngine, {
       initialState: { fragment },
     });
 
     // Update the state
     urlManager.subscribe(() => {
       const hash = `#${urlManager.state.fragment}`;
       history.pushState(null, document.title, hash);
     });
 
     // Synchronize the has with the latest fragment.
     window.addEventListener('hashchange', () => {
       const fragment = window.location.hash.slice(1);
       urlManager.synchronize(fragment);
     });
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
    //const onMediaFallback = event => event.target.src = "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg";
    return (
      <Grid container spacing={2}>
        {this.state.results.map((result: Result) => {
          if(this.props.viewType.toLowerCase() === "list") {
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
                  height="140"
                  image={`${result.raw.BannerImageUrl}`}                 
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant='subtitle1' fontWeight={400}>
                      {<ResultLink result={result} />}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                        }}>
                      {result.raw.description}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary">
                      {result.raw.author}                    
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
              key={result.uniqueId}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${result.raw.BannerImageUrl}`}
                />
                <CardContent>
                  <Typography variant='subtitle1' fontWeight={400}>
                    {<ResultLink result={result} />}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                        }}>
                    {result.raw.description}
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {result.raw.author}                    
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
