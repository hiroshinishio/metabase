import styled from "@emotion/styled";

import { GridItem } from "metabase/components/Grid";
import {
  breakpointMinMedium,
  breakpointMinSmall,
} from "metabase/styled-components/theme";

export const SchemaGridItem = styled(GridItem)`
  width: 100%;

  ${breakpointMinSmall} {
    width: 50%;
  }

  ${breakpointMinMedium} {
    width: 33.33%;
  }
`;
