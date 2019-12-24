import { Toast, Notify, Dialog } from "vant";

const toast = {
  loading(msg) {
    Toast.loading({
      message: msg || "加载中...",
      forbidClick: true
    });
  },
  text(msg) {
    if (msg) {
      Toast(msg);
    }
  },
  clear() {
    Toast.clear();
  }
};

const notify = {
  primary(msg) {
    // 主要通知
    Notify({ type: "primary", message: msg });
  },
  success(msg) {
    // 成功通知
    Notify({ type: "success", message: msg });
  },
  danger(msg) {
    // 危险通知
    Notify({ type: "danger", message: msg });
  },
  warning(msg) {
    // 警告通知
    Notify({ type: "warning", message: msg });
  }
};

export { toast, notify };
