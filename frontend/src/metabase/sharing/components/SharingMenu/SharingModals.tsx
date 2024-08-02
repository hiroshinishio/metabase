import type Question from "metabase-lib/v1/Question";
import type { Dashboard } from "metabase-types/api";

import { QuestionPublicLinkPopover, DashboardPublicLinkPopover } from "../PublicLinkPopover";

import type { SharingModalType } from "./types";


type BaseSharingModalProps = {
  onClose: () => void,
  modalType: SharingModalType,
  anchorEl: JSX.Element,
};

type SharingModalProps = BaseSharingModalProps & ({
  modalType: "question-public-link",
  question: Question,
  dashboard: never,
} | {
  modalType: "dashboard-public-link",
  dashboard: Dashboard,
  question: never,
});

export function SharingModals({
  modalType,
  onClose,
  question,
  dashboard,
  anchorEl,
} : SharingModalProps){
  if (modalType === "question-public-link"){
    return (
      <QuestionPublicLinkPopover
        question={question}
        target={anchorEl}
        isOpen={true}
        onClose={onClose}
      />
    );
  }

  if (modalType === "dashboard-public-link"){
    return (
      <DashboardPublicLinkPopover
        dashboard={dashboard}
        target={anchorEl}
        isOpen={true}
        onClose={onClose}
      />
    );
  }

  return null;
}
