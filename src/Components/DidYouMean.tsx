import React from "react";
import headlessEngine from "../Components/Engine";
import { buildDidYouMean, DidYouMean as HeadlessDidYouMean, DidYouMeanState} from "@coveo/headless";

class DidYouMean extends React.Component<{}, DidYouMeanState> {
  private headlessDidYouMean: HeadlessDidYouMean;
  constructor(props:any) {
    super(props);   
     this.headlessDidYouMean = buildDidYouMean(headlessEngine);
    this.state = this.headlessDidYouMean.state;
  }

  componentDidMount() {   
    this.headlessDidYouMean.subscribe(() => {
      this.setState(this.headlessDidYouMean.state);
    });
  }

  render() {
    if (this.state.hasQueryCorrection) {
      return (
        <div>
          Text was corrected to:{" "}
          <b>{this.state.queryCorrection.correctedQuery}</b>
        </div>
      );
    }
    if (this.state.wasAutomaticallyCorrected) {
      return (
        <div>
          <p>
            No results for{" "}
            <b>{this.state.queryCorrection.wordCorrections[0].originalWord}</b>
          </p>
          <p>
            Query was automatically corrected to{" "}
            <b>{this.state.wasCorrectedTo}</b>
          </p>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default DidYouMean;