import errorImage from "../../assets/error.png";
import infoImage from "../../assets/info.png";
import successImage from "../../assets/success.png";
import warningImage from "../../assets/warning.png";

export type AlertDialogVariant = "success" | "error" | "warning" | "info";

export interface AlertDialogButtonConfig {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

export interface AlertDialogVariantConfig {
  image: string;
  defaultButtons?: AlertDialogButtonConfig[];
}

export const alertDialogConfig: Record<AlertDialogVariant, AlertDialogVariantConfig> = {
  success: {
    image: successImage.src,
    defaultButtons: [],
  },
  error: {
    image: errorImage.src,
    defaultButtons: [],
  },
  warning: {
    image: warningImage.src,
    defaultButtons: [],
  },
  info: {
    image: infoImage.src,
    defaultButtons: [],
  },
};

