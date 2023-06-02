import React from "react";
import {Tabs, Paper} from "@mui/material";

export default class CenteredTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
  };

  render() {
    return (
      <Paper>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          {this.props.children}
        </Tabs>
      </Paper>
    );
  }
}
