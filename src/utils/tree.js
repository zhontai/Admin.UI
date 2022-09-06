/**
* @description: 列表转树形列表
* @example
listToTree(_.cloneDeep(list), (parent, self) => {
	return self.parentId === 0
}, (parent, self) => {
	return parent.id === self.parentId
}, (parent, childList) => {
	parent['childs'] = childList
})
*/
export function listToTree(
  list = [],
  rootWhere = (parent, self) => {
    return self.parentId === 0
  },
  childsWhere = (parent, self) => {
    return parent.id === self.parentId
  },
  addChilds = (parent, childList) => {
    parent['children'] = childList
  },
  data
) {
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
      const childList = listToTree(list, childsWhere, childsWhere, addChilds, item)
      addChilds && addChilds(item, childList)
    })
    addChilds && addChilds(root, rootChildList)
  })

  return tree
}

export function addListWithChilds(list = [], data, getChilds = (data) => { return data['children'] }) {
  const childs = getChilds(data)
  if (childs?.length > 0) {
    list = list.concat(childs)
    childs.forEach(child => {
      addListWithChilds(list, child, getChilds)
    })
  }
  return list
}

/**
* @description: 树形列表转列表
* @example
treeToList(_.cloneDeep(tree), (data) => { return data['children'] })
*/
export function treeToList(tree = [], getChilds = (data) => { return data['children'] }) {
  let list = []
  // 空树
  if (!(tree?.length > 0)) {
    return list
  }

  tree.forEach(root => {
    list = addListWithChilds(list, root, getChilds)
    list.push(root)
  })
  return list
}

/**
* @description: 获得自身所有父级列表
* @example
const parents = getParents(items, self, (item, self) => {
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

export default {
  toTree: listToTree,
  toList: treeToList,
  getParents
}
