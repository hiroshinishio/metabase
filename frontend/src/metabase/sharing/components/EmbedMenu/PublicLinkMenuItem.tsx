import { t } from "ttag";

import { useSetting } from "metabase/common/hooks";
import { useSelector } from "metabase/lib/redux";
import { getUserIsAdmin } from "metabase/selectors/user";
import { Menu, Center, Icon, Title, Stack, Text } from "metabase/ui";

export function PublicLinkMenuItem({
  hasPublicLink,
  onClick
}: {
  hasPublicLink: boolean,
  onClick: () => void,
}) {
  const isPublicSharingEnabled = useSetting("enable-public-sharing");
  const isAdmin = useSelector(getUserIsAdmin);

  if (isAdmin) {
    return (
      <Menu.Item
        data-testid="embed-menu-public-link-item"
        py={isPublicSharingEnabled ? "md" : "sm"}
        icon={
          <Center mr="xs">
            <Icon name="link" />
          </Center>
        }
        disabled={!isPublicSharingEnabled}
        onClick={onClick}
      >
        {isPublicSharingEnabled ? (
          <Title order={4}>
            {hasPublicLink ? t`Public link` : t`Create a public link`}
          </Title>
        ) : (
          <Stack spacing="xs">
            <Title order={4}>{t`Public links are off`}</Title>
            <Text size="sm">{t`Enable them in settings`}</Text>
          </Stack>
        )}
      </Menu.Item>
    );
  }

  if (!isPublicSharingEnabled) {
    return null;
  }

  return (
    <Menu.Item
      data-testid="embed-menu-public-link-item"
      py={"sm"}
      icon={
        <Center mr="xs">
          <Icon name="link" />
        </Center>
      }
      onClick={onClick}
    >
      <Title order={4}>
        {hasPublicLink ? t`Public link` : t`Create a public link`}
      </Title>
    </Menu.Item>
  );
}
