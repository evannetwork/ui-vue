<template>
  <div>
    <table class="permissions">
      <thead>
        <th>
          <h4> {{ dataset.name }} </h4>
        </th>
        <th>
          <small>{{ '_evan.read' | translate }}</small>
          <evan-form-control-checkbox :id="`${dataset.key}-read-all`" />
        </th>
        <th>
          <small>{{ '_evan.write' | translate }}</small>
          <evan-form-control-checkbox :id="`${dataset.key}-write-all`" />
        </th>
      </thead>
      <tbody>
        <tr v-for="(val, property) in permissions.properties" :key="property">
          <td class="caption">
            <span>{{ property }}</span>
            <span>Field1, Field2, Field3, Field4, Field5</span>
          </td>
          <td>
            <evan-form-control-checkbox :id="`${dataset.key}-${property}-read`" />
          </td>
          <td>
            <evan-form-control-checkbox :id="`${dataset.key}-${property}-write`" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import Component from './permissions';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './permissions.scss'
</style>

