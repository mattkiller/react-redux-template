import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { parse } from 'qs';

export default function asyncComponent(getComponent)
{
    return class AsyncComponent extends React.Component
    {
        static propTypes = {
            location: PropTypes.object.isRequired
        }

        static Component = null;

        constructor(props, context)
        {
            super(props, context);
            this.state = {
                Component: AsyncComponent.Component
            };
        }

        componentWillMount()
        {
            if (!this.state.Component)
            {
                getComponent().then((Component) =>
                {
                    AsyncComponent.Component = Component;
                    this.setState(update(this.state, {
                        Component: { $set: Component }
                    }));
                });
            }
        }

        render()
        {
            const props = update(this.props, {
                location: {
                    query: { $set: parse(this.props.location.search.replace('?', '')) }
                }
            });

            const { Component } = this.state;
            if (Component)
            {
                return <Component {...props} />;
            }
            return null;
        }
    };
}
