import React from "react";
import {
  DateFacet as DateFacetType,
  DateFacetState,
  buildDateFacet,
  DateFacetValue
} from "@coveo/headless";
import headlessEngine from "../Components/Engine";
import { IFacetProps } from "./Facet";
import {FormLabel, FormControl, FormGroup, FormControlLabel, Checkbox, Box} from "@mui/material";


interface IRangeDateFacetProps extends IFacetProps {
  delimiter?: string;
}

export default class DateFacet extends React.Component<
  IRangeDateFacetProps,
  {}
> {
  private headlessDateFacet: DateFacetType;
  state: DateFacetState & {
    inputValue: "";
  };

  constructor(props: any) {
    super(props);

    this.headlessDateFacet = buildDateFacet(headlessEngine, {
      options: {
        numberOfValues: 3,
        field: this.props.field,
        generateAutomaticRanges: true
      }
    });

    this.state = {
      ...this.headlessDateFacet.state,
      inputValue: ""
    };
  }
  componentDidMount() {
    this.headlessDateFacet.subscribe(() => this.updateState());
  }

  componentWillUnmount() {
    this.headlessDateFacet.subscribe(() => {});
  }

  updateState() {
    this.setState(this.headlessDateFacet.state);
  }

  toggleSelect(value: DateFacetValue) {
    this.headlessDateFacet.toggleSelect(value);
  }

  getDelimitedDate(date: string) {
    if (this.props.delimiter) {
      return date.split(this.props.delimiter)[0];
    }
    return date;
  }

  getStartDate(value: DateFacetValue) {
    return this.getDelimitedDate(value.start);
  }

  getEndDate(value: DateFacetValue) {
    return this.getDelimitedDate(value.end);
  }

  getLabel(value: DateFacetValue) {
    return `${this.getStartDate(value)}-${this.getEndDate(value)} (${
      value.numberOfResults
    })`;
  }

  getFacetValues() {
    return this.state.values.map(
      (value: DateFacetValue) =>
        value.numberOfResults !== 0 && (
          <Box mb={1} key={value.start}>
            <FormControlLabel
              label={this.getLabel(value)}
              control={
                <Checkbox
                  checked={this.headlessDateFacet.isValueSelected(value)}
                  color="primary"
                  onChange={(event) => this.toggleSelect(value)}
                />
              }
            />
          </Box>
        )
    );
  }

  render() {
    return (
      <Box mt={5} mr={3} p={1} bgcolor="#5D7289">
        <FormControl component="fieldset">
          <Box mb={1}>
            <FormLabel component="legend" color="primary">
              {this.props.title}
            </FormLabel>
          </Box>
          <FormGroup>{this.getFacetValues()}</FormGroup>
        </FormControl>
      </Box>
    );
  }
}
