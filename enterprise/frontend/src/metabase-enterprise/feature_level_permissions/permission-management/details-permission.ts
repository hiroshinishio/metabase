import { getIn } from "icepick";
import { t } from "ttag";

import { UNABLE_TO_CHANGE_ADMIN_PERMISSIONS } from "metabase/admin/permissions/constants/messages";
import {
  getPermissionWarning,
  getPermissionWarningModal,
} from "metabase/admin/permissions/selectors/confirmations";
import { EntityId, PermissionSubject } from "metabase/admin/permissions/types";
import { Group, GroupsPermissions } from "metabase-types/api";

export const DETAILS_PERMISSION_OPTIONS = {
  no: {
    label: t`No`,
    value: "no",
    icon: "close",
    iconColor: "danger",
  },
  yes: {
    label: t`Yes`,
    value: "yes",
    icon: "check",
    iconColor: "success",
  },
};

const DETAILS_PERMISSIONS_DESC = [
  DETAILS_PERMISSION_OPTIONS.yes.value,
  DETAILS_PERMISSION_OPTIONS.no.value,
];

const getDetailsPermission = (
  permissions: GroupsPermissions,
  groupId: number,
  databaseId: number,
) =>
  getIn(permissions, [groupId, databaseId, "details"]) ??
  DETAILS_PERMISSION_OPTIONS.no.value;

export const buildDetailsPermission = (
  entityId: EntityId,
  groupId: number,
  isAdmin: boolean,
  permissions: GroupsPermissions,
  defaultGroup: Group,
  permissionSubject: PermissionSubject,
) => {
  if (permissionSubject !== "schemas") {
    return null;
  }

  const value = getDetailsPermission(permissions, groupId, entityId.databaseId);
  const defaultGroupValue = getDetailsPermission(
    permissions,
    defaultGroup.id,
    entityId.databaseId,
  );

  const warning = getPermissionWarning(
    value,
    defaultGroupValue,
    permissionSubject,
    defaultGroup,
    groupId,
    DETAILS_PERMISSIONS_DESC,
  );

  const confirmations = (newValue: string) => [
    getPermissionWarningModal(
      newValue,
      defaultGroupValue,
      permissionSubject,
      defaultGroup,
      groupId,
      DETAILS_PERMISSIONS_DESC,
    ),
  ];

  return {
    permission: "details",
    type: "details",
    value,
    isDisabled: isAdmin,
    isHighlighted: isAdmin,
    warning,
    confirmations,
    disabledTooltip: isAdmin ? UNABLE_TO_CHANGE_ADMIN_PERMISSIONS : null,
    options: [DETAILS_PERMISSION_OPTIONS.no, DETAILS_PERMISSION_OPTIONS.yes],
  };
};
