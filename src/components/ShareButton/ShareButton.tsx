import { useState, useCallback } from "react";
import { IconType } from "react-icons";
import { MdOutlineShare, MdOutlineContentCopy } from "react-icons/md";
import { useToaster } from "../Toaster";

type Props = {
  text: () => string;
  children?: React.ReactNode;
  CopyIcon?: IconType;
};

export const ShareButton = ({
  children,
  text: getText,
  CopyIcon = MdOutlineContentCopy,
}: Props) => {
  const text = getText();
  const [canShare, setCanShare] = useState(!!navigator.canShare?.({ text }));
  const { show } = useToaster();

  const onShare = useCallback(() => {
    if (canShare) {
      navigator
        .share({ text })
        .catch(() => {
          navigator.clipboard.writeText(text);
        })
        .catch((_) => {
          setCanShare(false);
        });
    } else if (navigator.clipboard && !!navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      show({ text: "kopiert", level: "info" });
    }
  }, [canShare, show, text]);

  return (
    <button onClick={onShare}>
      {canShare ? <MdOutlineShare /> : <CopyIcon />}
      {children}
    </button>
  );
};
