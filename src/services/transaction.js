import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import React from 'react';
import { Badge } from 'reactstrap';

export const listToTree = (list) => {
  const map = {}; let node; const roots = []; let
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i]['@id']] = i; // initialize the map
    // eslint-disable-next-line no-param-reassign
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parent?.['@id']) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parent?.['@id']]]?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const createCategoriesTree = (tree) => orderBy(
  tree.map((c) => {
    if (c.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      c.children = createCategoriesTree(c.children);
    }

    return {
      ...c,
      title: (
        <span title={c.name}>
          <i className={c.icon} aria-hidden style={{ fontSize: '18px' }} />
          {'  '}
          <code>
            #
            {c.id}
          </code>
          {' '}
          {c.name + (c.children.length > 0 ? `(${c.children.length})` : '')}
          {c.isFixed && (
            <Badge pill color="warning" className="ml-1" size="sm">
              F
            </Badge>
          )}
        </span>
      ),
      subtitle: (
        <p className="mt-2">
          {c.tags.map(({ name }) => (
            <a href={`#${name}`} className="mr-1 font-weight-bold" key={name}>
              #
              {name}
            </a>
          ))}
        </p>
      ),
    };
  }),
  ({ children }) => children.length,
  'desc',
);

export const initializeList = (transactions) => transactions.map(({ executedAt, canceledAt, ...rest }) => ({
  ...rest,
  executedAt: moment(executedAt),
  canceledAt: canceledAt ? moment(canceledAt) : null,
}));
