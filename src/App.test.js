import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import App, { Search, Button, Table } from './App';

describe('App', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <App />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
})

describe('Search', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search>Search</Search>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Search>Search</Search>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Button', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button>More</Button>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Button>More</Button>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Table', () => {

    const props = {
        list: [
            { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
            { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
        ],
        sortKey: 'TITLE',
        isSortReverse: false,
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Table {...props} />, div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Table {...props} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});
