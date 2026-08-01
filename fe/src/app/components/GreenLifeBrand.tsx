import logoUrl from "../../imports/rmbg-logo.png";

/**
 * GreenLife brand lockup — renders the full logo image (leaf mark + wordmark)
 * from src/imports/rmbg-logo.png. Height scales with `iconSize`.
 */
export function GreenLifeBrand({
  textSize: _textSize,
  iconSize = 36,
  onClick,
}: {
  /** kept for API compatibility; the wordmark is baked into the image */
  textSize?: string;
  iconSize?: number;
  onClick?: () => void;
}) {
  const height = iconSize * 2.1;

  const img = (
    <img
      src={logoUrl}
      alt="GreenLife"
      style={{ height, width: "auto" }}
      className="shrink-0 select-none"
      draggable={false}
    />
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="group flex items-center transition-opacity duration-200 hover:opacity-80"
      >
        {img}
      </button>
    );
  }

  return <span className="flex items-center">{img}</span>;
}
