import Image from "../ui/Image";
export default function Brand() {
  return (
    <a href="#top" className="flex shrink-0 items-center gap-3 text-white">
      <Image
        src="/assets/responsive/logo-128.webp"
        loading="eager"
        width="400" height="276"
        alt="Imperia Sensa Park"
        className="h-11 w-auto object-contain"
      />
    </a>
  );
}
