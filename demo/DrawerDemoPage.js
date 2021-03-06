import React, { Component } from 'react';
import { Button }           from '@pearson-components/elements-sdk/build/dist.elements-sdk';
import { Drawer, BasicView, DetailView } from '../index';

import './DrawerDemoPage.scss';


class DrawerDemoPage extends Component {

  constructor() {
    super();
    this.state = {
      skipTo       : "",
      drawerIsOpen : false,
      position     : "left",
      text         : {
                      headerTitle       : "Basic Title",
                      headerTitleSR     : "I'm a drawer",
                      closeButtonSRText : "Close",
                      backButtonText    : "Back"
                     }
    };

    this.drawerHandler       = _drawerHandler.bind(this);
    this.documentationMarkup = _documentationMarkup.bind(this);

  }

  render() {

    const { drawerIsOpen, position, text, skipTo } = this.state;

    return(
      <div role="main">

        <div className="demo-container">
          <div className="header">
            <h1><a className="demoLink" href="http://uxframework.pearson.com/c/drawer/">Drawer:</a></h1>
          </div>
        </div>

        <div className="buttonBlock">
          <Button btnType="cta" btnSize="xlarge" onClick={() => {this.setState({drawerIsOpen:true})}}>Open Drawer</Button>
          <Button  id="insideButton" btnType="primary" btnSize="xlarge" onClick={() => {this.setState({drawerIsOpen:true, skipTo:'detailView4'})}}>Open Drawer To DetailView 4</Button>
          <Button  id="insideButton" btnType="primary" btnSize="xlarge" onClick={() => {this.setState({drawerIsOpen:true, skipTo:''})}}>Open Drawer To home</Button>
          <Button  id="insideButton" btnType="primary" btnSize="xlarge" onClick={() => {this.setState({position:'right'})}}>Drawer Position Right</Button>
          <Button btnType="primary" btnSize="xlarge" onClick={() => {this.setState({position:'left'})}}>Drawer Position Left</Button>
        </div>

        {this.documentationMarkup()}

        <Drawer
          id             = "myDrawer"
          drawerTop      = "61px"
          drawerOpen     = {drawerIsOpen}
          position       = {position}
          text           = {text}
          skipTo         = {skipTo}
          basicViewClick = {(e) => console.log('tags...' + e.currentTarget.innerHTML)}
          drawerHandler  = {this.drawerHandler}
          appRootId      = "drawer">
          <div>
            <BasicView mapToDetail="detailView1" myKind="BasicView">
              <h2>BasicView1</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView myKind="BasicView">
              <h2>BasicView2</h2>
              <button>hithere</button>
            </BasicView>
            <BasicView mapToDetail="detailView3" myKind="BasicView">
              <h2>BasicView3</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView mapToDetail="detailView4" myKind="BasicView">
              <h2>BasicView4</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView mapToDetail="detailView1" myKind="BasicView">
              <h2>BasicView5</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView myKind="BasicView">
              <h2>BasicView6</h2>
              <button>hithere</button>
            </BasicView>
            <BasicView mapToDetail="detailView3" myKind="BasicView">
              <h2>BasicView7</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView mapToDetail="detailView4" myKind="BasicView">
              <h2>BasicView8</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView myKind="BasicView">
              <h2>BasicView9</h2>
              <button>hithere</button>
            </BasicView>
            <DetailView id="detailView1" myKind="DetailView">
              <h3>DetailView1</h3>
            </DetailView>
            <DetailView id="detailView3" myKind="DetailView">
              <h3>DetailView3</h3>
              <details>
                <summary>Copyright 1999-2014.</summary>
                <p> - by Refsnes Data. All Rights Reserved.</p>
                <p>All content and graphics on this web site are the property of the company Refsnes Data.</p>
              </details>
            </DetailView>
            <DetailView id="detailView4" myKind="DetailView">
              <h3>DetailView4</h3>
              <details>
                <summary>Hi there</summary>
                <p> hi </p>
                <p>there</p>
              </details>
            </DetailView>
          </div>
        </Drawer>

      </div>
    )
  }

}


export default DrawerDemoPage;


function _drawerHandler() {
  this.setState({drawerIsOpen:!this.state.drawerIsOpen, skipTo:this.state.skipTo});
}

function _documentationMarkup() {

  const drawerPropsInfo = `
  id             : String   - a unqiue internationalized id for the drawer. Also, defines the aria-labeledby field
  position       : String   - one of:"left","right" default "right"
  drawerTop      : String   - adjust drawer top property default "61px"
  skipTo         : String   - go directly to a view default ""
  basicViewClick : Function - optional hook that fires when BasicView is clicked
  drawerOpen     : Boolean  - (required) default false default false
  drawerHandler  : Function - (required) sets state of drawerOpen to true or false
  text           : Object   - (required) text to be passed in.
                             default text:
                             const text =   {
                                               headerTitle       : "Basic Title",
                                               headerTitleSR     : "I'm a drawer",
                                               closeButtonSRText : "Close",
                                               backButtonText    : "Back"
                                             }
  `;

  const basicViewPropsInfo = `
  mapToDetail : String - DetailView to be shown, maps to DetailView id.
  myKind      : String - (required) one of:"BasicView","DetailView"`;

  const detailViewPropsInfo = `
  id     : String - (required) BasicView that produces DetailView on click id maps to mapToDetail.
  myKind : String - (required) one of:"BasicView","DetailView"`;

  return (
    <div>
      <div className="propsBlock code">
        <h1>Props:</h1>
        <h3>Drawer:</h3>
        <div>
          <pre>{drawerPropsInfo}</pre>
        </div>
        <h3>BasicView:</h3>
        <pre>{basicViewPropsInfo}</pre>
        <h3>DetailView:</h3>
        <pre>{detailViewPropsInfo}</pre>
      </div>


      <h2>{'Initial State:'}</h2>
      <pre className="code">
        {`this.state = {
            skipTo       : "",
            drawerTop    : "61px",
            drawerIsOpen : false,
            position     : "right",
            text         : {
                              headerTitle       : "Basic Title",
                              headerTitleSR     : "I'm a drawer",
                              closeButtonSRText : "Close",
                              backButtonText    : "Back"
                            }
            };`}
      </pre>


      <h2>{'Drawer Code:'}</h2>
      <pre className="code">
        {`             <Drawer
          id            = "myDrawer"
          text          = {text}
          drawerTop     = {this.state.drawerTop}
          drawerOpen    = {drawerIsOpen}
          skipTo        = {this.state.skipTo}
          position      = {this.state.position}
          tagManager    = {() => console.log("tags...")}
          drawerHandler = {this.drawerHandler}>
          <div>
            <BasicView mapToDetail='detailView1' myKind="BasicView">
              <h2>BasicView1</h2>
              <ul>
                <li>hi</li>
                <li>there</li>
              </ul>
            </BasicView>
            <BasicView myKind="BasicView">
              <h2>BasicView2</h2>
            </BasicView>
            <BasicView mapToDetail='detailView3' myKind="BasicView">
              <h2>BasicView3</h2>
            </BasicView>
            <DetailView id='detailView1' myKind="DetailView">
              <h3>DetailView1</h3>
            </DetailView>
            <DetailView id='detailView3' myKind="DetailView">
              <h3>DetailView3</h3>
            </DetailView>
          </div>
        </Drawer>`}
      </pre>

      <h2>{'Function to open/close the Drawer:'}</h2>
      <pre className="code">
        {`function _drawerHandler() {
          this.setState({drawerIsOpen:!this.state.drawerIsOpen});
        }`}
      </pre>
    </div>
  )
}
