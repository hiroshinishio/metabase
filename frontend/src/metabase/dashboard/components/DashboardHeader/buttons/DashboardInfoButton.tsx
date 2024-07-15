import { t } from "ttag";

import { closeSidebar, setSidebar } from "metabase/dashboard/actions";
import { SIDEBAR_NAME } from "metabase/dashboard/constants";
import { getIsShowDashboardInfoSidebar } from "metabase/dashboard/selectors";
import { useDispatch, useSelector } from "metabase/lib/redux";

import { DashboardHeaderButton } from "../DashboardHeaderButton";

export const DashboardInfoButton = () => {
  const dispatch = useDispatch();

  const isShowingDashboardInfoSidebar = useSelector(
    getIsShowDashboardInfoSidebar,
  );

  return (
    <DashboardHeaderButton
      aria-label={t`More info`}
      tooltipLabel={t`More info`}
      icon="info"
      isActive={isShowingDashboardInfoSidebar}
      onClick={() =>
        isShowingDashboardInfoSidebar
          ? dispatch(closeSidebar())
          : dispatch(setSidebar({ name: SIDEBAR_NAME.info }))
      }
    />
  );
};
