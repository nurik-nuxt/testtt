<script setup lang="ts">
const route = useRoute();
interface PropsItem {
  label: string;
  icon: string;
  url: string;
}



const props = withDefaults(defineProps<PropsItem>(), {});

const isActiveCurrentTab = (url: string) => {
  const [_, sub] = route.path.split('/');
  return sub === url;
};

// const isActiveCurrentTab = (url: string) => {
//   return route.path === `/${url}`;
// };

</script>

<template>
  <Transition class="layout-submenu">
    <ul class="layout-submenu">
      <nuxt-link :to="`/${url}`">
        <i :class="[icon, { 'active-item': isActiveCurrentTab(url) }]" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text" :class="{ 'active-item': isActiveCurrentTab(url) }">{{ label }}</span>
      </nuxt-link>
    </ul>
  </Transition>
</template>

<style scoped>
.active-item {
  color: #076AE1;
  font-weight: 700;
}
</style>