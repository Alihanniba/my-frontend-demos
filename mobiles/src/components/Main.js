import React from 'react';

import {
  Page
} from 'react-onsenui';

import NavBar from './NavBar';
import TabToolbar from './TabBar';

const Main = ({navigator}) => (
  <Page renderToolbar={() => <NavBar title='VegoTV' navigator={navigator} />}>
    <TabToolbar />
  </Page>
);

export default Main;
