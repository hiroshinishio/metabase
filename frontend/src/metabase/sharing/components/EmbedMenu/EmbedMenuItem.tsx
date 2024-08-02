import { t } from "ttag";

import { useSetting } from "metabase/common/hooks";
import { useSelector } from "metabase/lib/redux"
import { getUserIsAdmin } from "metabase/selectors/user";
import { Menu, Center, Icon, Title, Stack, Text} from "metabase/ui";

export function EmbedMenuItem({
  onClick,
}: {
  onClick: () => void;
}) {
  const isEmbeddingEnabled = useSetting("enable-embedding");
  const isAdmin = useSelector(getUserIsAdmin);

  if (!isAdmin) {
    return null;
  }

  return (
    <Menu.Item
      data-testid="embed-menu-embed-modal-item"
      py="md"
      icon={
        <Center mr="xs">
          <Icon name="embed" />
        </Center>
      }
      disabled={!isEmbeddingEnabled}
      onClick={onClick}
    >
      {isEmbeddingEnabled ? (
        <Title order={4}>{t`Embed`}</Title>
      ) : (
        <Stack spacing="xs">
          <Title order={4}>{t`Embedding is off`}</Title>
          <Text size="sm">{t`Enable it in settings`}</Text>
        </Stack>
      )}
    </Menu.Item>
  );
}