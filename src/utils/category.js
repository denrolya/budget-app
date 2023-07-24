import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import cn from 'classnames';
import color from 'randomcolor';
import React from 'react';
import { Badge } from 'reactstrap';
import TreeModel from 'tree-model';

export const generateCategoriesStatisticsTree = (current, previous) => {
  const tree = new TreeModel({
    modelComparatorFn: (a, b) => b.total - a.total,
  });
  const treeData = tree.parse({
    name: 'All categories',
    total: sumBy(current, 'total'),
    children: current,
  });

  treeData.walk((node) => {
    const {
      model: { name, icon, value },
    } = node;
    if (value) {
      const newNode = tree.parse({
        icon,
        name,
        total: value,
      });
      node.addChild(newNode);
    }
  });

  if (previous) {
    const previousTreeData = tree.parse({
      name: 'All categories',
      total: sumBy(previous, 'total'),
      children: previous,
    });

    previousTreeData.walk((node) => {
      const {
        model: { name, icon, value },
      } = node;
      if (value) {
        const newNode = tree.parse({
          icon,
          name,
          total: value,
        });
        node.addChild(newNode);
      }
    });

    treeData.all().forEach((node) => {
      const sameNodeInPreviousTree = previousTreeData.first(
        (n) => n.model.name === node.model.name && n.getPath().length === node.getPath().length,
      );
      if (sameNodeInPreviousTree) {
        // eslint-disable-next-line no-param-reassign
        node.model.previous = sameNodeInPreviousTree.model.total;
      }
    });
  }

  return treeData;
};

export const listToTree = (list) => {
  const map = {};
  let node;
  const roots = [];
  const arr = [...list];

  arr.forEach((item, i) => {
    map[item.id] = i; // initialize the map
    // eslint-disable-next-line no-param-reassign
    item.children = []; // initialize the children
  });

  arr.forEach((item) => {
    node = item;
    if (node.parent?.id) {
      // if you have dangling branches check that map[node.parent.id] exists
      arr[map[node.parent?.id]]?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const findPath = (data, id) => {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === id) {
      // if we found the id we were looking for, return an array with just this id
      return [data[i].name];
    }

    // if this node has children, recursively search for the id in the children
    if (data[i].children) {
      const pathFromChild = findPath(data[i].children, id);

      // if the id was found in this node's children
      if (pathFromChild) {
        // return an array starting with this node's id, followed by the ids in the path from the child
        return [data[i].name, ...pathFromChild];
      }
    }
  }

  // the id was not found in this branch of the tree
  return null;
};

export const paintTree = (categories, hue = null) => {
  categories.forEach((category) => {
    // eslint-disable-next-line no-param-reassign
    category.color = category.color || color({ hue, seed: category.id, luminosity: 'bright' });

    if (category.children) {
      paintTree(category.children, category.color);
    }
  });
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
        <span>
          <i aria-hidden className={cn('font-18px', c.icon)} style={{ color: c.color }} />
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
