import {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
  CSSProperties,
} from "react";
import { IconType } from "react-icons";
import {
  MdOutlineShare,
  MdOutlineContentCopy,
  MdOutlineCheck,
  MdOutlineClose,
} from "react-icons/md";
import { useToaster } from "../Toaster";

type Props = {
  text: () => string;
  children?: React.ReactNode;
  CopyIcon?: IconType;
  className?: string;
  style?: CSSProperties;
};

export const ShareButton = ({
  className,
  style,
  children,
  text: getText,
  CopyIcon = MdOutlineContentCopy,
}: Props) => {
  const text = getText();
  const { show, hide } = useToaster();

  const initialState = navigator.canShare?.({ text })
    ? "pending-share"
    : "pending-copy";

  const [state, setState] = useState<
    "pending-share" | "pending-copy" | "copied" | "shared" | "error"
  >(initialState);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state === "copied" || state === "shared") {
      if (state === "copied") {
        show({ text: "kopiert", level: "info" });
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const timeoutId = setTimeout(() => {
        setState(initialState);
        timeoutRef.current = null;
      }, 3000);
      timeoutRef.current = timeoutId;
    }

    const oldTimeoutId = timeoutRef.current;
    return () => {
      if (oldTimeoutId) {
        clearTimeout(oldTimeoutId);
      }
      hide();
    };
  }, [hide, initialState, show, state]);

  const onShare = useCallback(async () => {
    let currentState = state;
    if (currentState === "pending-share") {
      try {
        await navigator.share({ text });
        setState("shared");
        return;
      } catch {
        currentState = "pending-copy";
      }
    }

    if (currentState === "pending-copy") {
      try {
        await navigator.clipboard.writeText(text);
        setState("copied");
      } catch {
        currentState = "error";
      }
    }
  }, [state, text]);

  const Icon =
    {
      copied: MdOutlineCheck,
      shared: MdOutlineCheck,
      "pending-copy": CopyIcon,
      "pending-share": MdOutlineShare,
      error: MdOutlineClose,
    }[state] ?? Fragment;

  return (
    <button onClick={onShare} className={className} style={style}>
      <Icon />
      {children}
    </button>
  );
};
