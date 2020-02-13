import Vue from 'vue';
import { addClass, removeClass } from 'element-ui/src/utils/dom';

/**
 * PopupManager则功能
 *  1. 管理zIndex
 *  2. 管理modal的生命周期（创建、显示、隐藏、销毁、单例）
 */

// 标识是否已经存在modal实例
let hasModal = false;
/**
 * 标识zIndex是否已经初始化
 */
let hasInitZIndex = false;
/**
 * 记录最后一个“弹出层”的z-index，后续创建“弹出层”在此基础上+1，dialog、messageBox...也需要用到这个属性
 * 查看方法：nextZIndex
 * 初始化在：当前文件中Object.defineProperty的get方法中
 * 默认值初始值为2000，可以全局配置
 * 配置文件的位置：build/bin/build-entry.js，搜索：Vue.prototype.$ELEMENT
 */
let zIndex;

/**
 * 创建modal(实际上就是一个div)，挂到PopupManager对象上，单例
 * modal弹出层全局同一时间只有一个
 *
 */
const getModal = function() {
  if (Vue.prototype.$isServer) return;
  let modalDom = PopupManager.modalDom;
  if (modalDom) {
    hasModal = true;
  } else {
    hasModal = false;
    modalDom = document.createElement('div');
    PopupManager.modalDom = modalDom;

    modalDom.addEventListener('touchmove', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    modalDom.addEventListener('click', function() {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick();
    });
  }

  return modalDom;
};

// 存储？？实例
const instances = {};

const PopupManager = {
  modalFade: true,

  /**
   * 根据id获取modal实例
   * @param {*} id
   */
  getInstance: function(id) {
    return instances[id];
  },

  /**
   * 注册一个？？实例
   * @param {*} id
   * @param {*} instance
   */
  register: function(id, instance) {
    if (id && instance) {
      instances[id] = instance;
    }
  },

  /**
   * 注销实例
   * @param {*} id
   */
  deregister: function(id) {
    if (id) {
      instances[id] = null;
      delete instances[id];
    }
  },

  /**
   * 递增zIndex，并返回递增后的值
   */
  nextZIndex: function() {
    return PopupManager.zIndex++;
  },

  modalStack: [],

  /**
   * 关闭最顶层的modal
   */
  doOnModalClick: function() {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topItem) return;

    const instance = PopupManager.getInstance(topItem.id);
    if (instance && instance.closeOnClickModal) {
      instance.close();
    }
  },

  /**
   * 将modal添加到指定的dom元素中
   *    1. 创建modal只是创建了一个div对象，openModal方法将这个div插入到指定的dom元素中
   * @param {*} id
   * @param {*} zIndex
   * @param {*} dom
   * @param {*} modalClass
   * @param {*} modalFade
   */
  openModal: function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return;
    if (!id || zIndex === undefined) return;
    this.modalFade = modalFade;

    const modalStack = this.modalStack;

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    addClass(modalDom, 'v-modal');
    // 让modalDom开始显示动画
    if (this.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter');
    }
    // 将参数中的class(modalClass)添加到modalDom
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/);
      classArr.forEach(item => addClass(modalDom, item));
    }
    // 显示结束，移除指定的class
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter');
    }, 200);

    // 将modalDom追加到指定的dom
    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }
    // 设置modalDom的z-index
    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = '';
    // 在this.modalStack中记录当前modal的一些配置数据
    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
  },

  /**
   * 关闭modal
   * @param {*} id
   */
  closeModal: function(id) {
    const modalStack = this.modalStack;
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      /**
       * 通常关闭的modal都是最顶层的那个，
       */
      if (topItem.id === id) {
        if (topItem.modalClass) {
          let classArr = topItem.modalClass.trim().split(/\s+/);
          // 因为modal dom是共用的，所以删除时需要清理class
          classArr.forEach(item => removeClass(modalDom, item));
        }
        // 删除最顶层的配置，然后将最新的顶层配置应用到modalDom
        modalStack.pop();
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        // 如果删除的不是最顶层的modal，则遍历找到需要删除的那个modal的配置
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    /**
     * 如果modalStack中没有配置了，说明当前没有modal存在，销毁modal的dom
     */
    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave');
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
          modalDom.style.display = 'none';
          PopupManager.modalDom = undefined;
        }
        removeClass(modalDom, 'v-modal-leave');
      }, 200);
    }
  }
};

/**
 * 给PopupManager添加zIndex属性
 */
Object.defineProperty(PopupManager, 'zIndex', {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      // 初始化zIndex
      zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set(value) {
    zIndex = value;
  }
});

/**
 * 获取最后一个添加的modal实例
 */
const getTopPopup = function() {
  if (Vue.prototype.$isServer) return;
  if (PopupManager.modalStack.length > 0) {
    const topPopup =
      PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topPopup) return;
    const instance = PopupManager.getInstance(topPopup.id);

    return instance;
  }
};

/**
 * 在浏览器中，监听keydown(esc)，如果按下esc 且 closeOnPressEscape为true，则关闭modal
 */
if (!Vue.prototype.$isServer) {
  // handle `esc` key when the popup is shown
  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup();

      if (topPopup && topPopup.closeOnPressEscape) {
        topPopup.handleClose
          ? topPopup.handleClose()
          : topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close();
      }
    }
  });
}

export default PopupManager;
