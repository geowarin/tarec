import {shallow} from 'enzyme';
import expect from 'expect';
import React from 'react';
import App from 'compo/App';

describe('App component', () => {

    it('should say hello', () => {
        const component = shallow(<App />);
        expect(component.text()).toEqual('Hello');
    });
});
