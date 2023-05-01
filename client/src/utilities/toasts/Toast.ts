import { ToastPosition } from "react-toastify";
import { toast } from "react-toastify";

export default class Notification {

    success(content: string, position?: ToastPosition) {
        toast.dismiss();
        toast.success(content, {
            position: position
        });
    }

    info(content: string, position?: ToastPosition) {
        toast.dismiss();
        toast.info(content, {
            position: position
        });
    }

    warning(content: string, position?: ToastPosition) {
        toast.dismiss();
        toast.warning(content, {
            position: position
        });
    }

    error(content: string, position?: ToastPosition) {
        toast.dismiss();
        toast.error(content, {
            position: position
        })
    }
}