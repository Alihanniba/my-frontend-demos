import React from 'react';

import {
    Tabbar,
    Tab
} from 'react-onsenui';

import TabPage from './TabPage';

const sections = [
    ['Home', 'md-home'],
    ['Live', 'ion-videocamera'],
    ['Settings', 'ion-person']
];

const renderTabs = () => (
    sections.map((section) => {
        return {
            content: < TabPage key = { section[0] }
            title = { section[0] }
            />,
            tab: < Tab key = { section[0] }
            label = { section[0] }
            icon = { section[1] }
            />
        };
    })
);

const TabToolbar = ({ title, navigator }) => ( <
    Tabbar initialIndex = { 1 }
    renderTabs = { renderTabs }
    />
);

export default TabToolbar;
