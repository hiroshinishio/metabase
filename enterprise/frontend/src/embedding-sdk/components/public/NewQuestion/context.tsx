import { createContext, ReactNode, useContext } from "react";

type NewQuestionContextType = any;

export const NewQuestionContext = createContext<NewQuestionContextType | null>(
  null,
);

export const useNewQuestionContext = () => {
  const context = useContext(NewQuestionContext);
  if (!context) {
    throw new Error(
      "useNewQuestionContext must be used within a NewQuestionContextProvider",
    );
  }
  return context;
};

export const NewQuestionContextProvider = ({
  children,
  context,
}: {
  children: ReactNode;
  context: NewQuestionContextType;
}) => {
  return (
    <NewQuestionContext.Provider value={context}>
      {children}
    </NewQuestionContext.Provider>
  );
};
