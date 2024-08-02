import { useSelector } from "metabase/lib/redux";
import { getSetting } from "metabase/selectors/settings";
import { getUserIsAdmin } from "metabase/selectors/user";

import { AdminEmbedMenu } from "./AdminEmbedMenu";
import { NonAdminEmbedMenu } from "./NonAdminEmbedMenu";
import type { EmbedMenuProps } from "./types";

export const EmbedMenu = (props: EmbedMenuProps) => {
  const isAdmin = useSelector(getUserIsAdmin);

  const isPublicSharingEnabled = useSelector(state =>
    getSetting(state, "enable-public-sharing"),
  );

  const isEmbeddingEnabled = useSelector(state =>
    getSetting(state, "enable-embedding"),
  );

  if (isEmbeddingEnabled == null || isPublicSharingEnabled == null) {
    return null;
  }

  if (isAdmin) {
    return <AdminEmbedMenu {...props} />;
  }
  return <NonAdminEmbedMenu {...props} />;
};
