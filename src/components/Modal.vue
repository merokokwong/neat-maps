<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="close">
      <div class="modal" @click.stop>
        <header class="modal-header">
          <slot name="header">
            This is the default tile!

            <button type="button" class="btn-close" @click="close">
              x
            </button>
          </slot>
        </header>
        <section class="modal-body">
          <slot name="body">
            I'm the default body!
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            I'm the default footer!

            <button type="button" class="btn-green" @click="close">
              Close me!
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: ["show"],
  data() {
    return {};
  },
  mounted() {
    document.addEventListener("keydown", e => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
