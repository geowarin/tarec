import expect from 'expect';
import React from 'react';
import describeWithDom from 'describe-with-dom';
import App from 'compo/App';

describeWithDom('index', () => {

    it('should render the page', () => {
        createAppDiv();
        require('../src/index');
        expect(getHtmlBody()).toContain('Hello');
    });
});

function createAppDiv() {
  const appDiv = getDocument().createElement('div');
  appDiv.setAttribute('id', 'app');
  getDocument().body.appendChild(appDiv);
}

function getDocument() {
  return document.defaultView.document;
}

function getHtmlBody() {
  return getDocument().documentElement.outerHTML;
}
