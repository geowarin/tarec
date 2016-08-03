import * as React from "react";

export interface HelloProps {
  name?: String
}

export default class App extends React.Component<HelloProps, {}> {

  render () {
    return <h1>Hello, {this.props.name}</h1>
  }
}
