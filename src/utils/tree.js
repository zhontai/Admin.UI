/**
* @description: 列表转树形列表
* @example
listToTree(_.cloneDeep(list))

listToTree(_.cloneDeep(list), {
  rootWhere: (parent, self) => {
    return self.parentId === 0
  },
  childsWhere: (parent, self) => {
    return parent.id === self.parentId
  },
  addChilds: (parent, childList) => {
    if (childList?.length > 0) {
      parent['children'] = childList
    }
  }
})
*/
export function listToTree(
  list = [],
  options = {},
  data
) {
  const { rootWhere, childsWhere, addChilds } = Object.assign({
    rootWhere: (parent, self) => {
      return self.parentId === 0
    },
    childsWhere: (parent, self) => {
      return parent.id === self.parentId
    },
    addChilds: (parent, childList) => {
      if (childList?.length > 0) {
        parent['children'] = childList
      }
    }
  }, options || {})
  let tree = []
  // 空列表
  if (!(list?.length > 0)) {
    return tree
  }

  // 顶级
  const rootList = list.filter(item => rootWhere && rootWhere(data, item))
  if (!(rootList?.length > 0)) {
    return tree
  }
  tree = tree.concat(rootList)

  // 子级
  tree.forEach(root => {
    const rootChildList = list.filter(item => childsWhere && childsWhere(root, item))
    if (!(rootChildList?.length > 0)) {
      return
    }
    rootChildList.forEach(item => {
      const childList = listToTree(list, { rootWhere: childsWhere, childsWhere, addChilds }, item)
      addChilds && addChilds(item, childList)
    })
    addChilds && addChilds(root, rootChildList)
  })

  return tree
}

/**
* @description: 将树形列表转换为扁平化数据列表
* @example
toFlatList(tree, (data) => { return data['children'] }, list)
*/
export function toFlatList(tree, getChilds, flatList = [], noChildren = true) {
  tree.forEach(item => {
    flatList.push(item)
    const children = getChilds(item)
    if (children?.length > 0) {
      toFlatList(children, getChilds, flatList, noChildren)
    }
    if (noChildren) {
      delete item.children
    }
  })
}

/**
* @description: 树形列表转列表无子级
* @example
treeToList(_.cloneDeep(tree))

treeToList(_.cloneDeep(tree), (data) => { return data['children'] })
*/
export function treeToList(tree = [], getChilds = (data) => { return data['children'] }) {
  const list = []
  // 空树
  if (!(tree?.length > 0)) {
    return list
  }

  toFlatList(tree, getChilds, list)

  return list
}

/**
* @description: 树形列表转列表包含子级
* @example
treeToListWithChildren(_.cloneDeep(tree))

treeToListWithChildren(_.cloneDeep(tree), (data) => { return data['children'] })
*/
export function treeToListWithChildren(tree = [], getChilds = (data) => { return data['children'] }) {
  const list = []
  // 空树
  if (!(tree?.length > 0)) {
    return list
  }

  toFlatList(tree, getChilds, list, false)

  return list
}

/**
* @description: 获得自身所有父级列表
* @example
getParents(_.cloneDeep(items), self)
getParents(treeToList(_.cloneDeep(items), self))

const parents = getParents(_.cloneDeep(items), self, (item, self) => {
	return item.id === self.parentId
})
*/
export function getParents(
  list = [],
  self,
  parentWhere = (item, self) => {
    return item.id === self.parentId
  },
  parents = []
) {
  // 空列表
  if (!(list?.length > 0)) {
    return parents
  }

  if (!self) {
    return parents
  }

  const parent = list.find(item => parentWhere && parentWhere(item, self))

  if (parent) {
    parents.unshift(parent)
    getParents(list, parent, parentWhere, parents)
  }

  return parents
}

/**
* @description: 获得自身所有父级列表包含自身
* @example
getParentsAndSelf(_.cloneDeep(items), self)
getParentsAndSelf(treeToList(_.cloneDeep(items)), self)

const parents = getParentsAndSelf(_.cloneDeep(items), self, {
  selfWhere: (item, self) => {
    return item.id === self.id
  },
  parentWhere: (item, self) => {
    return item.id === self.parentId
  }
})
*/
export function getParentsAndSelf(
  list = [],
  self,
  options = {}
) {
  const { selfWhere, parentWhere } = Object.assign({
    selfWhere: (item, self) => {
      return item.id === self.id
    },
    parentWhere: (item, self) => {
      return item.id === self.parentId
    }
  }, options || {})

  const parents = getParents(list, self, parentWhere)
  const me = list.find(item => selfWhere && selfWhere(item, self))
  if (me) {
    parents.unshift(me)
  }

  return parents
}

export default {
  toTree: listToTree,
  toList: treeToList,
  toListWithChildren: treeToListWithChildren,
  getParents,
  getParentsAndSelf
}
