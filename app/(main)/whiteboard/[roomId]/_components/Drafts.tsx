import { useOthersMapped } from "@/liveblocks.config";
import { Path } from "./Path";
import { colorToCss } from "@/lib/utils";

export const Drafts = () => {
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }));

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#fff"}
            />
          );
        }

        return null;
      })}
    </>
  );
};
