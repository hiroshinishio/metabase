import { useState, useRef } from "react";

import { useSetting } from "metabase/common/hooks";
import { useSelector } from "metabase/lib/redux";
import { getUserIsAdmin } from "metabase/selectors/user";
import type Question from "metabase-lib/v1/Question";

import { EmbedMenuItem } from "../EmbedMenu/EmbedMenuItem";
import { PublicLinkMenuItem } from "../EmbedMenu/PublicLinkMenuItem";

import { SharingMenu } from "./SharingMenu";
import { SharingModals } from "./SharingModals";
import type { SharingModalType } from "./types";


export function QuestionSharingMenu({ question }: { question: Question }) {
  const [modalType, setModalType] = useState<SharingModalType | null>(null);
  const isPublicSharingEnabed = useSetting("enable-public-sharing");
  const isEmbeddingEnabled = useSetting("enable-embedding");
  const isAdmin = useSelector(getUserIsAdmin);

  const hasPublicLink = !!question.publicUUID();

  const canShare = isAdmin || (isPublicSharingEnabed || isEmbeddingEnabled);

  const sharingMenuRef = useRef(null);

  if (!question?.isSaved() || !canShare) {
    return null;
  }

  return (
    <>
      <SharingModals
        modalType={modalType}
        onClose={() => setModalType(null)}
        anchorEl={sharingMenuRef?.current}
      />
      <SharingMenu>
        <PublicLinkMenuItem
          hasPublicLink={hasPublicLink}
          onClick={() => setModalType("question-public-link")}
        />
        <EmbedMenuItem
          onClick={() => setModalType("question-embed")}
        />
      </SharingMenu>
    </>
  );
}