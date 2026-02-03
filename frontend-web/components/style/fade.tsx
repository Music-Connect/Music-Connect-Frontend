import { ReactNode } from "react";

type FadeProp = {
  children: ReactNode;
  style: string;
};

export default function FadeIn({ children, style }: FadeProp) {
  return (
    <>
      <span
        className={`${style} bg-linear-to-r from-yellow-400 via-pink-500 to-purple-400
                    bg-size-[200%] bg-left hover:bg-right transition-[background-position] 
                    duration-600 ease-in-out bg-clip-text text-transparent font-semibold `}
      >
        {children}
      </span>
    </>
  );
}
