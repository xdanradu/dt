<template>
  <div class="home">
    <HelloWorld msg="VueJs architecture"/>

        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Nume produs</div>
              <div class="md-subhead">Price: 5000</div>
            </md-card-header-text>

            <md-card-media>
              <img src="../assets/it.jpg" alt="People">
            </md-card-media>
          </md-card-header>

          <md-card-actions>
                <md-button class="md-icon-button md-raised md-primary">
                  <md-icon>thumb_up</md-icon>
                </md-button>
            <md-button class="md-raised md-primary">Update</md-button>
            <md-button class="md-raised md-accent">Delete</md-button>
          </md-card-actions>
        </md-card>

  </div>
</template>

<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
