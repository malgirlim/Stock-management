<template>
  <div>
    <div class="ground">
      <IamHeader />
      <IamMemo />
      <IamFooter />
    </div>
  </div>
</template>

<script>
import IamHeader from './IamHeader.vue'
import IamFooter from './IamFooter.vue'
import IamMemo from './IamMemo.vue'
export default { components: { IamHeader, IamFooter, IamMemo } }
</script>
