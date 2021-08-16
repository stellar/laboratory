import SLUG from "constants/slug";
import { useRedux } from "hooks/useRedux";

const navItems = [
  {
    label: "Introduction",
    slug: SLUG.HOME,
  },
  {
    label: "Create Account",
    slug: SLUG.ACCOUNT_CREATOR,
  },
  {
    label: "Explore Endpoints",
    slug: SLUG.EXPLORER,
  },
  {
    label: "Build Transaction",
    slug: SLUG.TXBUILDER,
  },
  {
    label: "Sign Transaction",
    slug: SLUG.TXSIGNER,
  },
  {
    label: "Submit Transaction",
    slug: SLUG.TXSUBMITTER,
  },
  {
    label: "View XDR",
    slug: SLUG.XDRVIEWER,
  },
];

export const Navigation = () => {
  const { routing } = useRedux("routing");

  // TODO: add test for active nav item

  return (
    <div
      className="so-back LaboratoryChrome__siteNavBack"
      data-testid="page-navigation"
    >
      <div className="so-chunk">
        <nav className="s-buttonList">
          {navItems.map((item) => (
            <a
              href={"#" + item.slug}
              className={`buttonList__item s-button s-button--min ${
                routing.location === item.slug ? "is-active" : ""
              }`}
              key={item.slug}
              data-testid="page-navigation-link"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
