import expect from 'expect';
import React from 'react';
import describeWithDom from 'describe-with-dom';

describeWithDom('index', () => {

    it('should render the page', () => {
        createAppDiv();
        require('../src/index');
        expect(getHtmlBody()).toContain('Hello');
    });
});

function createAppDiv() {
  const appDiv = document.createElement('div');
  appDiv.setAttribute('id', 'app');
  document.body.appendChild(appDiv);
}

function getHtmlBody() {
  return document.documentElement.outerHTML;
}
