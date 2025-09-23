import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { useWindowSize } from "@/hooks/useWindowSize";

export const SaveAndShare = ({ imgTheme }: { imgTheme: "light" | "dark" }) => {
  const { windowWidth } = useWindowSize();

  return (
    <>
      <div className="Lab__home__saveAndShare">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getPublicResourcePath(
            windowWidth && windowWidth < 600
              ? `/images/lab-home-save-share-mobile-${imgTheme}.png`
              : `/images/lab-home-save-share-${imgTheme}.png`,
          )}
          alt="Save and share graphic"
        />
      </div>
    </>
  );
};
