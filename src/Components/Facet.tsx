import * as React from 'react';
import {
  Facet as FacetType,
  FacetState,
  buildFacet,
  FacetValue,
} from "@coveo/headless";
import headlessEngine from "../Components/Engine";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  ThemeProvider,
  checkboxClasses,
  createTheme,
} from "@mui/material";


export interface IFacetProps {
  title: string;
  field: string;
}

export const muiTheme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'primary',
          [`&.${checkboxClasses.checked}`]: {
            color: 'red',
          },
        },
      },
    },
  },
});

export default class Facet extends React.Component<IFacetProps, {}> {
  private headlessFacet: FacetType;
  state: FacetState & {
    inputValue: "";
  };

  constructor(props: any) {
    super(props);

    this.headlessFacet = buildFacet(headlessEngine, {
      options: {
        numberOfValues: 5,
        field: this.props.field,
      },
    });

    this.state = {
      ...this.headlessFacet.state,
      inputValue: "",
    };
  }
  componentDidMount() {
    this.headlessFacet.subscribe(() => this.updateState());
  }

  componentWillUnmount() {
    this.headlessFacet.subscribe(() => { });
  }

  updateState() {
    this.setState(this.headlessFacet.state);
  }

  toggleSelect(value: FacetValue) {
    this.headlessFacet.toggleSelect(value);
  }

  showMore() {
    this.headlessFacet.showMoreValues();
  }

  showLess() {
    this.headlessFacet.showLessValues();
  }

  getFacetValues() {
    return this.state.values.map((value: FacetValue) => (
      <ThemeProvider theme={muiTheme}>
        <Box padding={0} key={value.value}>
          <FormControlLabel
            label={`${value.value} (${value.numberOfResults})`}
            control={
              <Checkbox
                checked={this.headlessFacet.isValueSelected(value)}
                color="primary"
                onChange={(event) => this.toggleSelect(value)}
              />
            }
          />
        </Box>
      </ThemeProvider>

    ));
  }


  getShowMore() {
    return (
      <Button
        onClick={() => {
          this.showMore();
        }}
        size='small'
      >
        Show More
      </Button>
    );
  }

  getShowLess() {
    return (
      <Button
        onClick={() => {
          this.showLess();
        }}
        size='small'
      >
        Show Less
      </Button>
    );
  }

  render() {
    return (
      <Box mt={5} mr={3} p={1}>
        <FormControl component="fieldset">
          <Box mb={1}>
            <FormLabel component="legend" color="error">
              {this.props.title}
            </FormLabel>
          </Box>
          <FormGroup>{this.getFacetValues()}</FormGroup>
        </FormControl>
        {this.state.canShowMoreValues && this.getShowMore()}
        {this.state.canShowLessValues && this.getShowLess()}
      </Box>
    );
  }
}
