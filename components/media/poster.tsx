import Image from "next/image";

/**
 * A still that fills its frame.
 *
 * Posters and photographs start life as SVG placeholders, which next/image will
 * not optimise, and become JPEG/WebP once Paras supplies them, which it should.
 * One component makes that swap a content-file change rather than a code change.
 */
export function Poster({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src.endsWith(".svg")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
