"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image that softly un-blurs once it has loaded. */
export function FadeImage({ className = "", alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      className={`img-fade ${className}`}
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
    />
  );
}
