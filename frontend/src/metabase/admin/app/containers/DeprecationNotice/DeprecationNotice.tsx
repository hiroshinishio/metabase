import { connect } from "react-redux";
import _ from "underscore";

import Databases from "metabase/entities/databases";
import Database from "metabase-lib/metadata/Database";
import { State } from "metabase-types/store";

import { disableNotice } from "../../actions";
import DeprecationNotice from "../../components/DeprecationNotice";
import {
  hasDeprecatedDatabase,
  hasSlackBot,
  isNoticeEnabled,
} from "../../selectors";

interface Props {
  databases?: Database[];
}

const mapStateToProps = (state: State, props: Props) => ({
  hasSlackBot: hasSlackBot(state),
  hasDeprecatedDatabase: hasDeprecatedDatabase(state, props),
  isEnabled: isNoticeEnabled(state),
});

const mapDispatchToProps = {
  onClose: disableNotice,
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default _.compose(
  Databases.loadList({
    loadingAndErrorWrapper: false,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(DeprecationNotice);
