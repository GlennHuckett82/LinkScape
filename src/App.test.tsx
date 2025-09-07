import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import App from './App';

describe('App', () => {
  it('renders header and home route', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text()).toContain('LinkScape');
  });
});
