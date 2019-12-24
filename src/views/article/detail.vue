<template>
  <div class="activity-content">
    <div class="content" v-html="content"></div>
  </div>
</template>

<script>
import { lectureDetail } from "../../api/article";
import { playNumberArticle } from '../../api/visitor';

export default {
  data() {
    return {
      content: ""
    };
  },
  created() {
    playNumberArticle(this.$route.params.id);
      this.$v_toast.loading();
    lectureDetail({
      article_id: this.$route.params.id
    }).then(res => {
      if (res.code == 10001) {
        this.content = res.data.content;
      }
      this.$v_toast.clear();
    });
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 1rem;
}

.activity-content {
  padding: 0.3rem;
}
</style>
