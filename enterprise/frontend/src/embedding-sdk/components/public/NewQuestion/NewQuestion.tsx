import {
  InteractiveQuestionProvider,
  useInteractiveQuestionContext,
} from "embedding-sdk/components/public/InteractiveQuestion/context";
import { useSdkDispatch } from "embedding-sdk/store";
import { useSelector } from "metabase/lib/redux";
import {
  runQuestionQuery,
  updateQuestion,
} from "metabase/query_builder/actions";
import { default as QBNotebook } from "metabase/query_builder/components/notebook/Notebook";
import {
  getIsDirty,
  getIsResultDirty,
  getIsRunnable,
} from "metabase/query_builder/selectors";
import { getSetting } from "metabase/selectors/settings";
import { ScrollArea } from "metabase/ui";
import Question from "metabase-lib/v1/Question";

export const NewQuestionInner = () => {
  const dispatch = useSdkDispatch();

  const { question, onQuestionChange } = useInteractiveQuestionContext();

  const isDirty = useSelector(getIsDirty);
  const isRunnable = useSelector(getIsRunnable);
  const isResultDirty = useSelector(getIsResultDirty);
  const reportTimezone = useSelector(state =>
    getSetting(state, "report-timezone-long"),
  );

  console.log({ question });

  return (
    question && (
      <ScrollArea w="100%" h="100%">
        <QBNotebook
          question={question}
          isDirty={isDirty}
          isRunnable={isRunnable}
          isResultDirty={Boolean(isResultDirty)}
          reportTimezone={reportTimezone}
          readOnly={false}
          updateQuestion={async (question: Question) => {
            console.log(question);
            await onQuestionChange(question);
            return await dispatch(updateQuestion(question));
          }}
          runQuestionQuery={() => {
            dispatch(runQuestionQuery());
          }}
          setQueryBuilderMode={() => {}}
          hasVisualizeButton={true}
        />
      </ScrollArea>
    )
  );
};

export const NewQuestion = () => {
  const question = Question.create();

  return (
    <InteractiveQuestionProvider
      location={{
        hash: question._serializeForUrl({
          creationType: "custom_question",
        }),
      }}
      params={{}}
    >
      <NewQuestionInner />
    </InteractiveQuestionProvider>
  );
};
