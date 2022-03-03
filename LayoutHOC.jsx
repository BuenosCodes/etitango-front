import React, { Component } from 'react';


const withLayout = (WrappedComponent) => {
  class WrappedClass extends Component {
    render() {
      return (
        <div>
          <h1>
            NavBar
          </h1>
          <WrappedComponent />
          <h1>
            Footer
          </h1>
        </div>
      )
    }
  }
  return WrappedClass;
}

export default withLayout;