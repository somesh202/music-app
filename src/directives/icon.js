export default {
  beforeMount(el, binding) {
    const iconClass = `fa fa-${binding.value}-alt float-right text-green-400 text-2xl`;
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
