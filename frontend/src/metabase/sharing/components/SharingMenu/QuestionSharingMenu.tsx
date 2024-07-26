import { Menu } from "@mantine/core";
import cx from "classnames";
import { useState } from "react";

import { useSetting } from "metabase/common/hooks";
import CS from "metabase/css/index.module.css";
import { useSelector } from "metabase/lib/redux";
import { getUserIsAdmin } from "metabase/selectors/user";
import { EmbedMenu } from "metabase/sharing/components/EmbedMenu";
import {QuestionAlertWidget} from "metabase/sharing/components/QuestionAlertWidget";
import type Question from "metabase-lib/v1/Question";

import { SharingMenu } from "./SharingMenu";



export function QuestionSharingMenu({ question }: { question: Question }) {

  if (!question?.isSaved()) {
    return null;
  }

  const isPublicSharingEnabed = useSetting("enable-public-sharing");
  const isEmbeddingEnabled = useSetting("enable-embedding");
  const isAdmin = useSelector(getUserIsAdmin);
  const canManageSubscriptions = useSelector(state => state.currentUser?.is_superuser);

  const hasPublicLink = !!question.publicUUID();

  return (
    <SharingMenu>
      <EmbedMenu
        resource={question}
        resourceType="question"
        hasPublicLink={hasPublicLink}
        onModalOpen={() => {}}
      />
      <QuestionAlertWidget
        key="alerts"
        className={cx(CS.hide, CS.smShow)}
        canManageSubscriptions={canManageSubscriptions}
        question={question}
        // questionAlerts={questionAlerts}
        // onCreateAlert={() => {}
        //   // question.isSaved()
        //   //   ? onOpenModal("create-alert")
        //   //   : onOpenModal("save-question-before-alert")
        // }
      />
    </SharingMenu>
  );
}