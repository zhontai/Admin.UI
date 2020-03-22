<template>
  <div v-if="!item.hidden">
    <el-submenu v-if="item.children && item.children.length > 0" :index="item.id + ''">
      <template slot="title">
        <i :class="item.icon" />
        <span slot="title">{{ item.label }}</span>
      </template>
      <menu-item v-for="child in item.children" :key="child.id" :item="child" />
    </el-submenu>
    <template v-else-if="item.path">
      <a v-if="item.newWindow" :href="item.path" target="_blank" rel="noopener">
        <el-menu-item :index="item.path">
          <i :class="item.icon" />
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </a>
      <router-link v-else-if="item.external" :to="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon" />
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </router-link>
      <router-link v-else :to="item.path" tag="div">
        <el-menu-item :index="item.path">
          <i :class="item.icon" />
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
